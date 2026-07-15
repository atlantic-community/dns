// This is a new Cloudflare zone with no records yet. Add the complete desired
// record set here; DNSControl treats this file as the source of truth.
D("atlantic.community", REG_NONE,
  DnsProvider(DNS_PRIMARY),
  DefaultTTL("1h"),
);
