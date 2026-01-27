# Changelog

All notable changes to ModelLab will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-27

### Added

#### Core Features
- Dataset management with CSV/JSON upload and automatic schema detection
- Run tracking with reproducible seeds and git commit hash capture
- EvalHarness evaluation library for classification and regression metrics
- Artifact storage for model checkpoints, plots, and reports
- Dashboard with real-time statistics and visualizations
- Run comparison view with side-by-side metrics analysis
- SQLite database with WAL mode for persistent storage
- Python SDK for one-line experiment tracking

#### Security Features
- Helmet.js integration for security headers (CSP, HSTS, XSS protection)
- Joi schema validation on all API endpoints
- CORS protection with configurable origin whitelist
- Rate limiting (100 API requests / 20 uploads per 15 minutes)
- Sanitized error messages (no stack traces in production)
- Foreign key enforcement in SQLite
- Regex-based ID validation (timestamp-randomstring format)

#### Reliability Features
- Graceful shutdown with clean database closure
- Health check endpoint (`/api/health`) with database connectivity test
- Uncaught exception handling for process-level recovery
- Request logging with Morgan (Apache combined format)

#### Documentation
- Comprehensive README with quick start and examples
- DEPLOYMENT.md with Vercel and self-hosted deployment guides
- CONTRIBUTING.md with development standards and workflow
- SECURITY.md with vulnerability disclosure and security policy
- AUDIT.md with complete technical audit and API reference
- LICENSE (MIT)
- Automated installation validation script (test-install.sh)

#### Developer Experience
- Environment variable configuration via .env file
- Multi-environment support (development/production)
- API documentation endpoint (`/api/docs`)
- Structured logging with timestamps and request context
- Python SDK with context manager API and git integration

#### Deployment
- Vercel deployment configuration
- Custom domain support (modellab.studio)
- PM2 ecosystem configuration for self-hosted deployments
- Nginx configuration examples
- Backup and monitoring scripts

### Changed
- Migrated from JSON file storage to SQLite database
- Updated formidable to v3 for better file upload handling
- Improved ID validation from basic checks to regex pattern matching

### Fixed
- Foreign key constraints now properly enforced
- macOS compatibility for test installation script
- File upload handling for formidable v3 API changes

### Security
- See [SECURITY.md](SECURITY.md) for security policy
- Known limitation: No authentication (planned for v1.1.0)
- Known limitation: No authorization/RBAC (planned for v1.2.0)

---

## [Unreleased]

### Planned for v1.1.0 (Q2 2026)
- [ ] JWT-based authentication
- [ ] User registration and login
- [ ] API key authentication
- [ ] Basic audit logging
- [ ] Session management

### Planned for v1.2.0 (Q3 2026)
- [ ] Role-based access control (RBAC)
- [ ] Team workspaces
- [ ] Granular permissions
- [ ] Advanced audit logging
- [ ] Data encryption at rest

### Planned for v1.3.0 (Q4 2026)
- [ ] SSO integration (SAML)
- [ ] IP whitelist/blacklist
- [ ] Advanced rate limiting
- [ ] Security dashboard
- [ ] Real-time updates via WebSockets

### Future Enhancements
- [ ] PostgreSQL migration support
- [ ] S3/Cloudflare R2 artifact storage
- [ ] Advanced visualizations
- [ ] Auto-logging for PyTorch/TensorFlow
- [ ] Experiment scheduling
- [ ] Slack/Discord notifications

---

## Version History

### Version Numbering
- **Major.Minor.Patch** (e.g., 1.0.0)
- **Major**: Breaking changes or significant new features
- **Minor**: New features, backward-compatible
- **Patch**: Bug fixes, backward-compatible

### Release Channels
- **Stable**: Production-ready releases (main branch)
- **Beta**: Feature-complete, testing phase
- **Alpha**: Experimental features, early access

---

## Migration Guides

### Migrating from v0.x to v1.0

If you were using the pre-release version with JSON storage:

1. **Backup your data:**
   ```bash
   cp -r modellab-data/ modellab-data-backup/
   ```

2. **Update to v1.0:**
   ```bash
   git pull origin main
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Migrate data (if needed):**
   The SQLite database will be created automatically on first run.
   Previous JSON data is not automatically migrated.

4. **Update environment variables:**
   Review `.env.example` for new configuration options.

---

## Support

For questions about specific versions or upgrades:
- Check the [README.md](README.md)
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment-specific changes
- Open an issue on [GitHub](https://github.com/calebnewtonusc/ModelLab/issues)

---

*Last updated: 2026-01-27*
