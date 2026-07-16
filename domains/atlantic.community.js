// DNSControl is the source of truth except for the locked Email Routing records
// that Cloudflare manages on our behalf.
D("atlantic.community", REG_NONE,
  DnsProvider(DNS_PRIMARY),
  DefaultTTL("1h"),

  // Cloudflare Email Routing owns these read-only records:
  //   MX @ 9  route3.mx.cloudflare.net.
  //   MX @ 62 route2.mx.cloudflare.net.
  //   MX @ 93 route1.mx.cloudflare.net.
  //   TXT cf2024-1._domainkey "v=DKIM1; ..."
  // DNSControl's Cloudflare provider hides read-only records, while these
  // ownership rules document and protect the boundary if that behavior changes.
  IGNORE("@", "MX"),
  IGNORE("cf*._domainkey", "TXT"),

  ALIAS("@", "atlantic-community.jorgeteixe.workers.dev.", CF_PROXY_ON),
  CNAME("www", "atlantic-community.jorgeteixe.workers.dev.", CF_PROXY_ON),

  // Cloudflare Email Routing SPF. Restored after the 2026-07-16 deployment
  // deleted the dashboard-created record because it was missing from this file.
  TXT("@", "v=spf1 include:_spf.mx.cloudflare.net ~all", TTL(1)),

  TXT("_gh-atlantic-community-o", "89efcec028"),
);
