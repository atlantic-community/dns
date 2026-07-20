// DNSControl is the source of truth except for the locked Email Routing records
// that Cloudflare manages on our behalf.
D("1hack.eu", REG_NONE,
  DnsProvider(DNS_PRIMARY),
  DefaultTTL(3000),

  // Cloudflare Email Routing owns these read-only records:
  //   MX @ 1  route2.mx.cloudflare.net.
  //   MX @ 14 route3.mx.cloudflare.net.
  //   MX @ 48 route1.mx.cloudflare.net.
  //   TXT cf2024-1._domainkey "v=DKIM1; ..."
  // DNSControl's Cloudflare provider hides read-only records, while these
  // ownership rules document and protect the boundary if that behavior changes.
  IGNORE("@", "MX"),
  IGNORE("cf*._domainkey", "TXT"),

  ALIAS("@", "1hack-web.1hack-eu.workers.dev.", CF_PROXY_ON),
  CNAME("www", "1hack-web.1hack-eu.workers.dev.", CF_PROXY_ON),

  TXT("@", "v=spf1 include:_spf.mx.cloudflare.net ~all", TTL(1)),
);
