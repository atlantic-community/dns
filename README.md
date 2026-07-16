# Atlantic community DNS

This repository is the source of truth for DNS records managed by the Atlantic community. It uses [DNSControl](https://dnscontrol.org/) to apply the configuration to Cloudflare.

Managed domains:

- `atlantic.community`
- `1hack.eu`

Each domain has its own file under `domains/`. The root `dnsconfig.js` defines the registrar and DNS provider, then loads every domain file.

## How changes reach Cloudflare

DNS changes normally go through a pull request:

1. Edit a domain file on a branch.
2. Run `make check` locally.
3. Open a pull request and review the configuration diff.
4. Merge the pull request after approval.
5. The `Apply DNS` workflow previews the merged configuration and pushes it to Cloudflare through the `production-dns` environment.

Pull requests and non-`main` branches run the `Validate DNS` workflow. This checks the DNSControl syntax without contacting Cloudflare. A push to `main` runs the deployment workflow with credentials stored in the `DNSCONTROL_CREDS` environment secret.

Local production pushes are disabled by the Makefile. Production changes should come from the audited GitHub Actions workflow.

## Editing a domain

DNSControl treats each domain file as the complete desired state for that zone. A record that exists in Cloudflare but is absent from the file may be deleted during the next deployment.

Use relative labels inside a domain:

```javascript
A("api", "192.0.2.10"),
TXT("@", "example-verification=value"),
```

Targets outside the current domain must be fully qualified and end with a dot:

```javascript
CNAME("www", "example.pages.dev."),
MX("@", 10, "mail.example.net."),
```

Cloudflare proxy state is explicit where it matters:

```javascript
CNAME("www", "example.workers.dev.", CF_PROXY_ON),
CNAME("autoconfig", "autoconfig.example.net.", CF_PROXY_OFF),
```

Use `IGNORE` for records owned by another system. For example, Cloudflare Email Routing owns locked MX and DKIM records for `atlantic.community`; the domain file marks those records as unmanaged so DNSControl does not interfere with them.

## Local commands

The Makefile runs DNSControl 4.42.0 in Docker.

Check syntax and record validity without provider credentials:

```sh
make check
```

Preview the difference between the repository and Cloudflare:

```sh
cp creds.example.json creds.json
export DNSCONTROL_API_TOKEN="your-zone-scoped-token"
make preview
```

The token needs `Zone Read` and `DNS Edit` access to every zone included in the preview. Never commit `creds.json` or an API token.

## Adding a domain

Add a file named `domains/<domain>.js` containing a complete `D(...)` declaration. Use `DNS_PRIMARY` when the existing Cloudflare token has access to the zone:

```javascript
D("example.org", REG_NONE,
  DnsProvider(DNS_PRIMARY),
  DefaultTTL("1h"),

  // Complete desired record set.
);
```

If the zone needs different credentials, add another `NewDnsProvider(...)` entry to `dnsconfig.js`, add its non-secret shape to `creds.example.json`, and provide the real credentials through the GitHub environment.

Cloudflare manages the apex SOA and authoritative NS records. Domain files omit those records. `REG_NONE` also prevents DNSControl from changing registrar delegation.

## Repository layout

```text
dnsconfig.js                    DNSControl entry point and providers
domains/                        One complete desired-state file per domain
creds.example.json              Credential structure without secrets
Makefile                        Local check and preview commands
.github/workflows/validate.yml  Syntax validation for branches and pull requests
.github/workflows/deploy.yml    Preview and deployment from main
.github/CODEOWNERS              DNS review ownership
```
