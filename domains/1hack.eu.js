// Imported from Cloudflare on 2026-07-16.
// Apex SOA and NS records are managed by Cloudflare and intentionally omitted.
D("1hack.eu", REG_NONE,
  DnsProvider(DNS_1HACK_EU),
  DefaultTTL(3000),

  // Migadu mail discovery and DKIM.
  CNAME("autoconfig", "autoconfig.migadu.com.", TTL(1), CF_PROXY_OFF),
  CNAME("key1._domainkey", "key1.1hack.eu._domainkey.migadu.com.", TTL(1), CF_PROXY_OFF),
  CNAME("key2._domainkey", "key2.1hack.eu._domainkey.migadu.com.", TTL(1), CF_PROXY_OFF),
  CNAME("key3._domainkey", "key3.1hack.eu._domainkey.migadu.com.", TTL(1), CF_PROXY_OFF),

  MX("@", 10, "aspmx1.migadu.com."),
  MX("@", 20, "aspmx2.migadu.com."),

  // Delegate x.1hack.eu to Iuvia.
  NS("x", "coruscant.iuvia.net.", TTL(60)),

  SRV("_autodiscover._tcp", 0, 1, 443, "autodiscover.migadu.com."),
  SRV("_imaps._tcp", 0, 1, 993, "imap.migadu.com."),
  SRV("_pop3s._tcp", 0, 1, 995, "pop.migadu.com."),
  SRV("_submissions._tcp", 0, 1, 465, "smtp.migadu.com."),

  TXT("@", "v=spf1 include:spf.migadu.com -all"),
  TXT("@", "hosted-email-verify=n8dovx55"),
  TXT("_dmarc", "v=DMARC1; p=quarantine;"),
);
