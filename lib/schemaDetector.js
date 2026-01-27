/**
 * Schema Detection and Validation for Dataset Files
 */

const fs = require('fs');
const path = require('path');

// Detect data type of a value
const detectType = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'null';
  }

  if (typeof value === 'boolean') {
    return 'boolean';
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'integer' : 'float';
  }

  if (typeof value === 'string') {
    // Try to detect if it's a date
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
    if (dateRegex.test(value)) {
      return 'datetime';
    }

    // Check if it's a number in string format
    if (!isNaN(value) && value.trim() !== '') {
      return value.includes('.') ? 'float' : 'integer';
    }

    return 'string';
  }

  if (Array.isArray(value)) {
    return 'array';
  }

  if (typeof value === 'object') {
    return 'object';
  }

  return 'unknown';
};

// Parse CSV file
const parseCSV = (content) => {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => {
      v = v.trim().replace(/^"|"$/g, '');
      // Try to parse as number
      if (!isNaN(v) && v !== '') {
        return parseFloat(v);
      }
      // Try to parse as boolean
      if (v.toLowerCase() === 'true') return true;
      if (v.toLowerCase() === 'false') return false;
      return v;
    });

    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] !== undefined ? values[idx] : null;
    });
    rows.push(row);
  }

  return rows;
};

// Detect schema from data
const detectSchema = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { columns: [], rowCount: 0 };
  }

  const schema = { columns: [], rowCount: data.length };
  const firstRow = data[0];

  // Get all unique keys across all rows
  const allKeys = new Set();
  data.forEach(row => {
    Object.keys(row).forEach(key => allKeys.add(key));
  });

  allKeys.forEach(key => {
    const values = data.map(row => row[key]).filter(v => v !== null && v !== undefined);
    const types = values.map(detectType);
    const uniqueTypes = [...new Set(types)];

    // Determine primary type (most common)
    const typeCounts = {};
    types.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const primaryType = Object.keys(typeCounts).reduce((a, b) =>
      typeCounts[a] > typeCounts[b] ? a : b
    );

    // Calculate statistics
    const nullCount = data.length - values.length;
    const uniqueValues = new Set(values);

    schema.columns.push({
      name: key,
      type: primaryType,
      nullable: nullCount > 0,
      nullCount,
      uniqueCount: uniqueValues.size,
      distinctTypes: uniqueTypes,
      examples: values.slice(0, 5)
    });
  });

  return schema;
};

// Validate data against schema
const validateData = (data, expectedSchema) => {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(data)) {
    errors.push('Data must be an array of objects');
    return { valid: false, errors, warnings };
  }

  if (data.length === 0) {
    warnings.push('Dataset is empty');
  }

  // Check if all expected columns are present
  const actualSchema = detectSchema(data);
  const actualColumns = new Set(actualSchema.columns.map(c => c.name));
  const expectedColumns = new Set(expectedSchema.columns.map(c => c.name));

  expectedColumns.forEach(col => {
    if (!actualColumns.has(col)) {
      errors.push(`Missing expected column: ${col}`);
    }
  });

  // Check for extra columns
  actualColumns.forEach(col => {
    if (!expectedColumns.has(col)) {
      warnings.push(`Unexpected column: ${col}`);
    }
  });

  // Type checking
  expectedSchema.columns.forEach(expectedCol => {
    const actualCol = actualSchema.columns.find(c => c.name === expectedCol.name);
    if (actualCol && actualCol.type !== expectedCol.type) {
      // Allow some type flexibility
      const compatibleTypes = {
        'integer': ['float', 'string'],
        'float': ['integer', 'string'],
        'string': []
      };

      if (!compatibleTypes[expectedCol.type]?.includes(actualCol.type)) {
        errors.push(
          `Column "${expectedCol.name}" has type "${actualCol.type}" but expected "${expectedCol.type}"`
        );
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// Load and parse dataset file
const loadDatasetFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath).toLowerCase();

  let data;
  if (ext === '.json') {
    data = JSON.parse(content);
  } else if (ext === '.csv') {
    data = parseCSV(content);
  } else {
    throw new Error(`Unsupported file type: ${ext}`);
  }

  return {
    data,
    schema: detectSchema(data),
    fileType: ext.substring(1)
  };
};

module.exports = {
  detectType,
  parseCSV,
  detectSchema,
  validateData,
  loadDatasetFile
};
