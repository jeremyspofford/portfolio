# Secrets Management

> **Trigger:** Always-on (applies to all file operations)
> **Critical:** NEVER commit secrets, API keys, credentials, or passwords to version control

This repository enforces **strict secrets protection** through automated scanning and gitignore patterns. All developers and AI agents MUST follow these rules.

## What Qualifies as a Secret

**Secrets** are sensitive data that grant access to systems, services, or private information:

### Credentials

- API keys (OpenAI, Stripe, AWS, etc.)
- Access tokens and refresh tokens
- Passwords and passphrases
- Database connection strings with credentials
- Service account keys (JSON, YAML)
- OAuth client secrets

### Cryptographic Material

- Private keys (RSA, DSA, EC, PGP)
- SSL/TLS certificates (private keys)
- SSH private keys (id_rsa, id_ed25519)
- Signing keys
- Encryption keys

### Cloud Provider Credentials

- AWS access keys (AKIA...) and secret keys
- GCP service account JSON files
- Azure connection strings
- Cloud provider config files (~/.aws/credentials)

### Personal Identifiable Information (PII)

- Social Security Numbers
- Credit card numbers
- Personal email addresses in bulk
- Authentication cookies/sessions

## Detection: How to Identify Secrets

### Common Patterns in Code

**Hardcoded API keys:**

```typescript
// ❌ NEVER DO THIS
const API_KEY = "sk-1234567890abcdef";
const STRIPE_KEY = "sk_live_...";

// ✅ USE ENVIRONMENT VARIABLES
const API_KEY = process.env.OPENAI_API_KEY;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
```

**Connection strings:**

```typescript
// ❌ NEVER COMMIT CREDENTIALS
const db = "postgresql://user:password@localhost:5432/db";

// ✅ USE ENV VARS
const db = process.env.DATABASE_URL;
```

**Private keys in code:**

```typescript
// ❌ NEVER EMBED PRIVATE KEYS
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASC...
-----END PRIVATE KEY-----`;

// ✅ LOAD FROM SECURE LOCATION
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH);
```

### File Patterns That Indicate Secrets

- `.env`, `.env.local`, `.env.production` → Always contain secrets
- `credentials.json`, `secrets.yml` → Naming indicates secrets
- `*-service-account.json` → GCP service accounts
- `*.pem`, `*.key`, `*.p12` → Cryptographic keys
- `id_rsa`, `id_ed25519` → SSH keys

## Prevention: Best Practices

### 1. Use Environment Variables

**Always** store secrets in `.env` files (never committed):

```bash
# .env (gitignored)
DATABASE_URL=postgresql://user:real-password@localhost:5432/prod
OPENAI_API_KEY=sk-proj-real-key-here
STRIPE_SECRET_KEY=sk_live_real-key-here
```

### 2. Create .env.example Templates

Provide **safe templates** with placeholder values:

```bash
# .env.example (committed to git)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
OPENAI_API_KEY=sk-proj-your-key-here
STRIPE_SECRET_KEY=sk_test_your-key-here
```

### 3. Never Commit Secret Files

Files blocked by `.gitignore`:

- `.env*` (except `.env.example`)
- `credentials.json`, `secrets.yml`
- `*.pem`, `*.key`, `*.p12`
- Cloud provider configs (`.aws/credentials`, etc.)

### 4. Use Secret Management Services

For production:

- **AWS Secrets Manager** or **Parameter Store**
- **GCP Secret Manager**
- **Azure Key Vault**
- **HashiCorp Vault**

### 5. Scan Before Committing

The repository automatically scans commits using **git-secrets**:

- Detects AWS keys, private keys, API tokens
- Blocks commit if secrets detected
- Provides clear error messages

## AI Agent Responsibilities

When Claude Code, Cursor, or other AI agents are asked to work with credentials:

### ✅ AI MUST

1. **Warn users** before creating files that might contain secrets
2. **Use environment variables** instead of hardcoded values
3. **Create `.env.example`** with placeholder values, NOT `.env` with real values
4. **Check gitignore** before committing credential-related files
5. **Remind users** to add `.env` to `.gitignore` if not present

### ❌ AI MUST NEVER

1. Write real API keys, passwords, or tokens to any file
2. Commit `.env` files or credential files to git
3. Suggest hardcoding secrets in code
4. Create commits with secret patterns (flagged by git-secrets)
5. Bypass git-secrets hooks unless explicitly requested by user

### Example AI Workflow

**User request:** "Set up authentication with Stripe"

**Correct AI response:**

```markdown
I'll set up Stripe authentication using environment variables.

1. First, add your Stripe secret key to `.env`:
   STRIPE_SECRET_KEY=sk_test_your_key_here

2. I'll create the authentication service using process.env.STRIPE_SECRET_KEY

3. I'll add a `.env.example` template with placeholders

Note: Never commit your actual Stripe key. The .env file is gitignored.
```

**Incorrect AI response:**

```typescript
I'll add your Stripe key to the config:
const stripe = new Stripe("sk_live_51ABC123...");  // ❌ NEVER DO THIS
```

## Recovery: What If Secrets Are Committed?

If secrets are accidentally committed to git:

### Step 1: Immediate Rotation

**Rotate the exposed credentials immediately** (within minutes):

- Revoke/delete the exposed API key
- Generate a new key
- Update `.env` with new key
- Secrets in git history are considered compromised forever

### Step 2: Remove from Git History

**For recent commit (not yet pushed):**

```bash
# Amend last commit
git reset HEAD~1
git add .
git commit -m "Add config (secrets removed)"
```

**For older commits or pushed commits:**

```bash
# Install git-filter-repo (recommended)
brew install git-filter-repo

# Remove file from all history
git filter-repo --path secrets.env --invert-paths

# Force push (if necessary)
git push --force-with-lease
```

**For public repositories:**

- Assume credentials are compromised
- Rotate immediately
- Consider repository exposure scope
- Notify security team if applicable

### Step 3: Prevent Recurrence

```bash
# Ensure git-secrets is installed
brew install git-secrets

# Reinitialize hooks
lefthook install

# Test
echo "AKIAIOSFODNN7EXAMPLE" > test.txt
git add test.txt
git commit -m "Test"  # Should be blocked by git-secrets
```

## Testing Secret Protection

### Test .gitignore Patterns

```bash
# Try to stage .env file
echo "API_KEY=secret" > .env
git add .env
# Expected: "The following paths are ignored by one of your .gitignore files"
```

### Test git-secrets Scanning

```bash
# Try to commit a file with AWS key
echo "AKIAIOSFODNN7EXAMPLE" > test.txt
git add test.txt
git commit -m "Test commit"
# Expected: "[ERROR] Matched one or more prohibited patterns"
```

## Additional Resources

- [git-secrets documentation](https://github.com/awslabs/git-secrets)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Project Git Hooks Documentation](../../docs/GIT_HOOKS.md)

## False Positives

If git-secrets blocks a legitimate commit (e.g., "password" in a comment):

```bash
# Allow specific pattern for this repo
git secrets --add --allowed 'password validation test'

# Skip hook for emergency (USE SPARINGLY)
SKIP=secrets-scan git commit -m "Emergency fix"
```

## Summary Checklist

Before committing code with credentials:

- [ ] Secrets stored in `.env` (gitignored)
- [ ] `.env.example` created with placeholders
- [ ] Code uses `process.env.VAR_NAME`, not hardcoded values
- [ ] git-secrets is installed and configured
- [ ] Tested locally that secrets are not committed
- [ ] Reviewed `.gitignore` for credential patterns
