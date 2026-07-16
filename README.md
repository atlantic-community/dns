# Atlantic community DNS

The source of truth for Atlantic community domains, managed with [DNSControl](https://dnscontrol.org/). Today the repository is prepared for `atlantic.community`; each future domain gets its own file under `domains/`.

DNS records are changed through pull requests. Contributors do not need access to the DNS provider's dashboard or API credentials. Maintainers review and merge changes; GitHub Actions then applies the reviewed state using credentials stored in a protected environment.

## Current status

`atlantic.community` is active in the configuration as a new, empty Cloudflare zone. Add its desired records to `domains/atlantic.community.js` through pull requests. DNSControl is authoritative, so every domain file must always contain the complete desired record set.

## One-time setup for maintainers

1. Initialize this directory as a Git repository and push it to GitHub.
2. Confirm that the `atlantic.community` zone exists in Cloudflare.
3. Create a read/write API token limited to the managed DNS zones. Do not grant account-wide access when the provider supports narrower permissions.
4. In the GitHub repository, create an environment named `production-dns`. Add required reviewers who are allowed to approve DNS deployments.
5. Add an environment secret named `DNSCONTROL_CREDS`. Its value must be the complete provider-specific `creds.json`, for example:

   ```json
   {
     "none": { "TYPE": "NONE" },
     "primary": {
       "TYPE": "CLOUDFLAREAPI",
       "apitoken": "the-real-token"
     }
   }
   ```

6. Create or rename the GitHub team referenced by `.github/CODEOWNERS` and enable branch protection for `main`:
   - require a pull request;
   - require at least one approval from Code Owners;
   - require the `check` status check;
   - dismiss stale approvals after new commits;
   - prevent direct pushes and force pushes, including for administrators if desired.

The `NONE` registrar is intentional: DNSControl manages records but cannot change the domain's parent nameserver delegation. Registrar automation can be added separately later.

## Everyday changes

1. Edit the domain file on a branch.
2. Run `make check`. Run `make preview` as well if you are a maintainer with a local credential.
3. Open a pull request. A DNS maintainer reviews it and merges it.
4. The protected `production-dns` job previews the exact merged revision, waits for an authorized environment approval, and then applies it.

Local `make push` is intentionally disabled so the audited GitHub workflow remains the normal production path.

## Adding another domain

Add a file such as `domains/example.org.js` with a complete `D("example.org", ...)` declaration. Reuse `DNS_PRIMARY` when it uses the same credentials, or declare another provider in `dnsconfig.js` and both credential files. Keep every zone complete and self-contained.
