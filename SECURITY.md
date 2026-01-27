# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

### How to Report

1. **Private Disclosure Preferred**
   - Create a private security advisory on GitHub
   - Or email: security@modellab.studio (if configured)

2. **Include the Following Information**
   - Type of vulnerability
   - Full description with step-by-step reproduction
   - Potential impact
   - Suggested fix (if you have one)
   - Your contact information

3. **Response Timeline**
   - Initial response: Within 48 hours
   - Status update: Within 7 days
   - Fix deployment: Varies by severity (see below)

### Severity Levels

| Severity | Example | Response Time |
|----------|---------|---------------|
| **Critical** | RCE, SQL injection, auth bypass | 24-48 hours |
| **High** | XSS, CSRF, data exposure | 3-7 days |
| **Medium** | Rate limit bypass, info disclosure | 1-2 weeks |
| **Low** | Minor issues, best practice violations | 2-4 weeks |

---

## Security Measures

ModelLab implements the following security measures:

### Application Security

✅ **Input Validation**
- Joi schema validation on all API endpoints
- ID format validation with regex
- File type and size restrictions
- Parameter sanitization

✅ **SQL Injection Prevention**
- Prepared statements for all database queries
- No dynamic SQL construction
- Parameterized queries only

✅ **XSS Protection**
- Helmet.js security headers
- Content-Security-Policy configured
- X-XSS-Protection enabled
- Output encoding

✅ **CSRF Protection**
- CORS whitelist enforcement
- Origin validation
- Credentials validation

✅ **Rate Limiting**
- 100 requests per 15 minutes (general API)
- 20 uploads per 15 minutes
- Per-IP tracking
- Configurable limits

✅ **Error Handling**
- No stack traces in production
- Generic error messages to users
- Detailed logs server-side
- Graceful degradation

✅ **Authentication & Authorization**
- ⚠️ **NOT YET IMPLEMENTED**
- Planned: JWT-based authentication
- Planned: Role-based access control
- Planned: API key support

### Infrastructure Security

✅ **HTTPS/TLS**
- Automatic SSL via Vercel
- Certificate auto-renewal
- HSTS headers enabled
- TLS 1.2+ required

✅ **Security Headers**
- `Strict-Transport-Security`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`

✅ **Database Security**
- Foreign key enforcement
- WAL mode for consistency
- Prepared statements
- Connection security

✅ **File Upload Security**
- Max file size limits (100MB datasets, 500MB artifacts)
- Extension validation
- SHA-256 checksums
- Isolated storage directories

### Network Security

✅ **CORS Configuration**
- Whitelist-based origins
- Credentials support
- Preflight handling

✅ **API Security**
- Input validation
- Output encoding
- Error sanitization
- Request logging

---

## Known Security Limitations

### 🔴 Critical (Must Address for Production)

1. **No Authentication**
   - **Impact:** Anyone can view/modify all data
   - **Mitigation:** Use self-hosted deployment with firewall
   - **Planned:** JWT authentication in v1.1.0

2. **No Authorization**
   - **Impact:** No role-based access control
   - **Mitigation:** Single-tenant deployment only
   - **Planned:** RBAC in v1.2.0

3. **No Audit Logging**
   - **Impact:** Can't track who did what
   - **Mitigation:** Enable request logging
   - **Planned:** Audit trail in v1.1.0

### 🟡 Medium (Improve When Possible)

4. **Limited File Type Validation**
   - **Impact:** Potential malicious file uploads
   - **Mitigation:** File size limits, SHA-256 checksums
   - **Improvement:** Add MIME type validation, virus scanning

5. **In-Memory Rate Limiting**
   - **Impact:** Rate limits per-instance only
   - **Mitigation:** Use single-instance deployment
   - **Improvement:** Redis-backed rate limiting

6. **Local File Storage**
   - **Impact:** Files don't persist on Vercel
   - **Mitigation:** Use self-hosted or PostgreSQL + S3
   - **Improvement:** Cloud storage integration

---

## Security Best Practices

### For Users

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique values
   - Rotate credentials regularly

2. **Network Security**
   - Use HTTPS only
   - Configure firewalls appropriately
   - Limit API access to trusted IPs (if self-hosted)

3. **Database Security**
   - Backup regularly
   - Encrypt backups
   - Test restore procedures

4. **Monitoring**
   - Monitor health endpoint
   - Set up error alerting
   - Review logs regularly

### For Developers

1. **Code Review**
   - Review all code changes for security issues
   - Use automated security scanning
   - Follow secure coding guidelines

2. **Dependencies**
   - Keep dependencies updated
   - Review security advisories
   - Use `npm audit` regularly

3. **Testing**
   - Write security-focused tests
   - Test input validation thoroughly
   - Verify error handling

4. **Deployment**
   - Use environment variables for secrets
   - Enable all security features
   - Configure rate limiting appropriately

---

## Security Updates

### Update Policy

- **Critical vulnerabilities:** Patch released ASAP, announcement within 24h
- **High severity:** Patch released within 1 week
- **Medium severity:** Included in next release
- **Low severity:** Included in next minor version

### Notification Channels

- GitHub Security Advisories
- Release notes
- README.md updates

### Applying Updates

```bash
# Check for updates
git fetch origin
git log HEAD..origin/main --oneline

# Apply updates
git pull origin main
npm install
cd frontend && npm install && npm run build && cd ..

# Restart server
pm2 restart modellab

# Verify
curl https://your-domain.com/api/health
```

---

## Security Checklist

### Before Production Deployment

- [ ] HTTPS enabled with valid certificate
- [ ] Environment variables configured (no defaults)
- [ ] CORS whitelist configured
- [ ] Rate limiting enabled
- [ ] Error messages sanitized (no stack traces)
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] Firewall rules configured
- [ ] SSH keys only (no password auth for self-hosted)
- [ ] Security headers verified
- [ ] Input validation tested
- [ ] File upload restrictions verified

### Post-Deployment

- [ ] Health check accessible
- [ ] API documentation accessible
- [ ] Test API endpoints
- [ ] Verify rate limiting
- [ ] Check CORS functionality
- [ ] Monitor error logs
- [ ] Verify backup system

---

## Compliance

### Data Protection

- **Data at rest:** SQLite with file system permissions
- **Data in transit:** HTTPS/TLS encryption
- **Data retention:** User-controlled (manual deletion)
- **Data backup:** User-responsible

### Privacy

- No personal data collection by default
- User-uploaded data stays on user's infrastructure
- No third-party analytics (unless user adds)
- No tracking cookies

### Regulations

⚠️ **Important:** ModelLab does NOT currently implement:
- GDPR compliance features
- HIPAA compliance features
- SOC 2 controls
- PCI DSS requirements

If you need compliance with these regulations:
- Implement authentication and access controls
- Add audit logging
- Encrypt data at rest
- Add data retention policies
- Implement right-to-delete

---

## Security Roadmap

### Version 1.1.0 (Q2 2026)

- [ ] JWT-based authentication
- [ ] User registration and login
- [ ] API key authentication
- [ ] Basic audit logging
- [ ] Session management

### Version 1.2.0 (Q3 2026)

- [ ] Role-based access control
- [ ] Team workspaces
- [ ] Granular permissions
- [ ] Advanced audit logging
- [ ] Data encryption at rest

### Version 1.3.0 (Q4 2026)

- [ ] SSO integration
- [ ] SAML support
- [ ] IP whitelist/blacklist
- [ ] Advanced rate limiting
- [ ] Security dashboard

---

## Contact

- **Security issues:** Create private security advisory on GitHub
- **General security questions:** Open a GitHub issue
- **Urgent security matters:** Email maintainers directly

---

## Acknowledgments

We appreciate responsible disclosure of security vulnerabilities. Contributors who report valid security issues will be acknowledged in:

- CHANGELOG.md
- Release notes
- Hall of Fame (if implemented)

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

*Last updated: 2026-01-27*
