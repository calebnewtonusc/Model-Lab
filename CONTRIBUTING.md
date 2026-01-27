# Contributing to ModelLab

Thank you for your interest in contributing to ModelLab! This document provides guidelines and instructions for contributing.

---

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions. We're here to build great software together.

---

## How to Contribute

### Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, browser)
   - Screenshots if applicable

### Suggesting Enhancements

1. **Check the roadmap** in README.md
2. **Create an issue** tagged as "enhancement" with:
   - Use case description
   - Proposed solution
   - Alternative solutions considered
   - Impact on existing features

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test thoroughly** (see [Testing](#testing))
5. **Commit with clear messages**
6. **Push to your fork**
7. **Create a Pull Request** with:
   - Clear description of changes
   - Link to related issues
   - Screenshots/videos if UI changes
   - Test results

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Python 3.7+ (for SDK development)
- Git

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ModelLab.git
cd ModelLab

# Add upstream remote
git remote add upstream https://github.com/calebnewtonusc/ModelLab.git

# Install dependencies
npm run install-all

# Create environment file
cp .env.example .env

# Start development servers
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Coding Standards

### JavaScript/Node.js

**Style Guide:**
- Use ES6+ features
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Descriptive variable names
- Comments for complex logic

**Example:**
```javascript
// Good
const getUserById = (id) => {
  const user = db.getUser(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Bad
function get(i){return db.getUser(i)}
```

### React/Frontend

**Style Guide:**
- Functional components with hooks
- Styled Components for styling
- Props destructuring
- Component files in PascalCase
- One component per file

**Example:**
```javascript
// Good
const RunCard = ({ run, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card onClick={() => onSelect(run.id)}>
      <Title>{run.name}</Title>
      <Status>{run.status}</Status>
    </Card>
  );
};

// Bad
function runcard(props){
  return <div>{props.run.name}</div>
}
```

### Python

**Style Guide:**
- PEP 8 compliance
- Type hints for function signatures
- Docstrings for public functions
- 4 spaces for indentation

**Example:**
```python
# Good
def log_metric(key: str, value: float, step: Optional[int] = None) -> None:
    """
    Log a metric value for the current run.
    
    Args:
        key: Metric name
        value: Metric value
        step: Optional training step
    """
    pass

# Bad
def log_metric(key,value,step=None):
    pass
```

### Database

**Guidelines:**
- Use prepared statements (never string concatenation)
- Index foreign keys
- Add NOT NULL constraints where appropriate
- Use transactions for multi-statement operations

### API Design

**RESTful Principles:**
- Use appropriate HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Return appropriate status codes
- Consistent error response format
- Validate all inputs
- Document all endpoints

**Example:**
```javascript
// Good
router.post('/:id/evaluate', validateId('id'), validate(schemas.run.evaluate), (req, res) => {
  try {
    const { predictions, labels } = req.body;
    // ... evaluation logic
    res.status(200).json({ evaluation, message: 'Success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bad
router.get('/eval', (req, res) => {
  const result = eval(req.query.code); // NEVER DO THIS
  res.send(result);
});
```

---

## Testing

### Running Tests

```bash
# Backend tests (when implemented)
npm test

# Frontend tests
cd frontend
npm test

# Python SDK tests
cd python-sdk
pytest
```

### Writing Tests

**Unit Tests:**
```javascript
describe('database', () => {
  it('should create a run with valid data', () => {
    const run = db.createRun({
      name: 'Test Run',
      seed: 42
    });
    expect(run).toHaveProperty('id');
    expect(run.seed).toBe(42);
  });
});
```

**Integration Tests:**
```javascript
describe('POST /api/modellab/runs', () => {
  it('should create a new run', async () => {
    const response = await request(app)
      .post('/api/modellab/runs')
      .send({ name: 'Test Run', seed: 42 })
      .expect(201);
    
    expect(response.body.run).toHaveProperty('id');
  });
});
```

---

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Build process, dependencies, tooling

### Examples

```
feat(api): add latency profiling endpoint

Adds POST /api/modellab/runs/:id/latency endpoint to track
inference latency metrics (p50, p95, p99).

Closes #45
```

```
fix(database): enable foreign key enforcement

Foreign keys were not enforced, allowing orphaned records.
Added db.pragma('foreign_keys = ON') to enable enforcement.
```

```
docs(readme): update installation instructions

Updated to include Python SDK installation and added
examples for PyTorch and TensorFlow integration.
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log() statements left in code
- [ ] No commented-out code
- [ ] Commit messages follow format
- [ ] PR description is clear and complete

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
```

### Review Process

1. **Automated checks** must pass (linting, tests)
2. **Maintainer review** within 1-2 business days
3. **Address feedback** with additional commits
4. **Approval** from at least one maintainer
5. **Merge** by maintainer (squash and merge)

---

## Project Structure

```
ModelLab/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/ModelLab/ # Main pages
│   │   └── utils/         # Utilities
│   └── package.json
├── api/modellab/          # Express API routes
│   ├── datasets.js        # Dataset endpoints
│   ├── runs.js            # Run endpoints
│   └── artifacts.js       # Artifact endpoints
├── lib/                   # Shared libraries
│   ├── database.js        # Database layer
│   ├── validation.js      # Input validation
│   ├── schemaDetector.js  # Schema detection
│   └── evalHarness.js     # Evaluation engine
├── python-sdk/            # Python client
│   ├── modellab/          # Package code
│   └── tests/             # Python tests
├── data/                  # SQLite database
└── modellab-data/         # File storage
```

---

## Key Files

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `server.js` | Main server | Rarely |
| `lib/database.js` | Database layer | Occasionally |
| `lib/validation.js` | Input schemas | Frequently |
| `api/modellab/*.js` | API routes | Frequently |
| `frontend/src/pages/ModelLab/*.js` | UI components | Frequently |
| `python-sdk/modellab/client.py` | Python SDK | Occasionally |

---

## Common Tasks

### Adding a New API Endpoint

1. Define Joi validation schema in `lib/validation.js`
2. Add route handler in appropriate `api/modellab/*.js` file
3. Apply validation middleware
4. Add endpoint to API docs in `server.js`
5. Update `AUDIT.md` endpoint table
6. Write tests

### Adding a New Frontend Component

1. Create component file in `frontend/src/pages/ModelLab/`
2. Use Styled Components for styling
3. Follow existing patterns (hooks, props)
4. Ensure responsive design
5. Test in multiple browsers

### Modifying Database Schema

1. Update schema in `lib/database.js`
2. Add migration logic
3. Update serialization functions
4. Test with existing data
5. Document changes in `AUDIT.md`

---

## Security

### Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email security@example.com (if configured)
2. Or create a private security advisory on GitHub
3. Include detailed description and reproduction steps

### Security Checklist for PRs

- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities
- [ ] Input validation on all user data
- [ ] No secrets in code
- [ ] Prepared statements for database queries
- [ ] Proper error handling

---

## Documentation

### Update Documentation When:

- Adding new features
- Changing API behavior
- Modifying configuration options
- Updating dependencies
- Changing deployment process

### Documentation Files

- `README.md` - Project overview, quick start
- `DEPLOYMENT.md` - Deployment instructions
- `AUDIT.md` - Technical audit, API reference
- `SECURITY.md` - Security policy
- `CONTRIBUTING.md` - This file

---

## Resources

### Learning Resources

- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Hooks](https://react.dev/reference/react)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Joi Validation](https://joi.dev/api/)

### Related Projects

- [MLflow](https://github.com/mlflow/mlflow) - Popular ML tracking
- [Weights & Biases](https://github.com/wandb/wandb) - ML experiment tracking

---

## Questions?

- Check existing issues and documentation first
- Ask in issue comments
- Email maintainers for complex questions

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ModelLab! 🚀
