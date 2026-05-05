# Security Policy

## Scope

Taskinator is a static browser app. It has no backend, authentication layer, server-side storage, payment flow, or third-party runtime dependency. Task data is stored only in the user's browser through `localStorage`.

In scope:

- Cross-site scripting risks in task rendering or saved local data.
- Unsafe DOM insertion patterns.
- Input validation or localStorage parsing failures that break the app.
- Accidental inclusion of secrets or external network dependencies.

Out of scope:

- Compromise of a user's device, browser profile, extensions, or local filesystem.
- Physical access attacks.
- Issues requiring a malicious browser or modified local copy of the app.
- Social engineering.

## Current Security Posture

- No secrets or environment files are required.
- No external scripts, fonts, stylesheets, CDNs, or mixed-content resources are loaded.
- User input is rendered with `textContent` and DOM node creation, not HTML string insertion.
- Task types and statuses are allowlisted.
- Saved task data is parsed defensively and normalized before rendering.

## Reporting

If this project is published, report vulnerabilities through the repository's preferred private disclosure channel. Include:

1. A clear description of the issue.
2. Steps to reproduce.
3. Browser/version details.
4. Expected and actual behavior.
5. Any suggested fix, if available.

Please do not publicly disclose an exploitable issue before the maintainer has had a reasonable opportunity to respond.
