/**
 * Database Tests
 */

const path = require('path');
const fs = require('fs');
const db = require('../lib/database');

describe('Database', () => {
  describe('ID Generation', () => {
    it('should generate unique IDs', () => {
      const id1 = db.generateId();
      const id2 = db.generateId();

      expect(id1).not.toBe(id2);
    });

    it('should generate IDs matching the expected format', () => {
      const id = db.generateId();
      const idRegex = /^\d{13}-[a-z0-9]{9}$/;

      expect(id).toMatch(idRegex);
    });

    it('should generate IDs with correct parts', () => {
      const id = db.generateId();
      const [timestamp, random] = id.split('-');

      expect(timestamp).toHaveLength(13);
      expect(random).toHaveLength(9);
      expect(Number(timestamp)).not.toBeNaN();
    });
  });

  describe('Checksum Generation', () => {
    const testFilePath = path.join(__dirname, 'test-file.txt');

    beforeAll(() => {
      fs.writeFileSync(testFilePath, 'test content');
    });

    afterAll(() => {
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    });

    it('should generate SHA-256 checksum', () => {
      const checksum = db.generateChecksum(testFilePath);

      expect(checksum).toHaveLength(64); // SHA-256 = 64 hex chars
      expect(checksum).toMatch(/^[a-f0-9]+$/);
    });

    it('should generate consistent checksums for same content', () => {
      const checksum1 = db.generateChecksum(testFilePath);
      const checksum2 = db.generateChecksum(testFilePath);

      expect(checksum1).toBe(checksum2);
    });

    it('should generate different checksums for different content', () => {
      const testFile2 = path.join(__dirname, 'test-file-2.txt');
      fs.writeFileSync(testFile2, 'different content');

      const checksum1 = db.generateChecksum(testFilePath);
      const checksum2 = db.generateChecksum(testFile2);

      expect(checksum1).not.toBe(checksum2);

      fs.unlinkSync(testFile2);
    });
  });

  describe('Serialization', () => {
    it('should serialize JSON fields properly', () => {
      const data = {
        array: [1, 2, 3],
        object: { key: 'value' },
      };

      const serialized = db.serializeRun({ ...data });

      expect(serialized.array).toBe(JSON.stringify([1, 2, 3]));
      expect(serialized.object).toBe(JSON.stringify({ key: 'value' }));
    });

    it('should deserialize JSON fields properly', () => {
      const serialized = {
        hyperparameters: JSON.stringify({ lr: 0.001 }),
        metrics: JSON.stringify({ accuracy: 0.95 }),
      };

      const deserialized = db.deserializeRun(serialized);

      expect(deserialized.hyperparameters).toEqual({ lr: 0.001 });
      expect(deserialized.metrics).toEqual({ accuracy: 0.95 });
    });
  });
});
