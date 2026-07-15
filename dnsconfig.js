// DNSControl entry point.
// Provider types and secrets live in creds.json (local) or GitHub secrets (CI).
var REG_NONE = NewRegistrar("none");
var DNS_PRIMARY = NewDnsProvider("primary");

// Keep one file per domain so adding future Atlantic domains stays straightforward.
require_glob("./domains/");
