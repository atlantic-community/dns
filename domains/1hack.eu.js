// Imported from Cloudflare on 2026-07-16.
// Apex SOA and NS records are managed by Cloudflare and intentionally omitted.
D("1hack.eu", REG_NONE,
  DnsProvider(DNS_PRIMARY),
  DefaultTTL(3000),

  ALIAS("@", "1hack-web.1hack-eu.workers.dev.", CF_PROXY_ON),
  CNAME("www", "1hack-web.1hack-eu.workers.dev.", CF_PROXY_ON),
);
