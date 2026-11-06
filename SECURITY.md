# Security Policy

## Supported versions

Security fixes are applied to the latest release. Older releases may not receive
patches.

## Reporting a vulnerability

Please do not open a public issue for a security vulnerability.

Use GitHub's private vulnerability reporting:

<https://github.com/sparelay/sparelay/security/advisories/new>

If private reporting is unavailable, contact the maintainers at
contact@saitogo.me.

Please include:

- The affected version or image tag
- Deployment method (Docker Compose, Docker image, or local build)
- Steps to reproduce
- Potential impact
- Any suggested remediation

Do not include real provider API keys, the Sparelay `API_KEY`, or production
search logs in your report. Use redacted examples.

We will acknowledge reports as soon as possible and aim to provide a
remediation plan within a reasonable timeframe. Please allow time for a fix
before public disclosure.

## Scope

Examples of in-scope issues:

- Authentication or authorization bypass
- Exposure of the Sparelay `API_KEY` or stored provider credentials
- Server-side request forgery through provider URLs
- Injection or unsafe handling of search queries
- Exposure of search logs or other stored user data
- Supply-chain issues in the published Docker image or GitHub Actions workflows

## Out of scope

- Vulnerabilities in third-party search providers
- Misconfiguration of a self-hosted deployment, such as exposing the admin UI
  without HTTPS or reusing a weak `API_KEY`
- Denial of service caused by intentionally sending large volumes of traffic
- Issues that require access to a user's local machine or database
