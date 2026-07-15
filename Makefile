DNSCONTROL_VERSION ?= 4.42.0
DNSCONTROL := docker run --rm -v "$(CURDIR):/dns" -w /dns ghcr.io/dnscontrol/dnscontrol:$(DNSCONTROL_VERSION)

.PHONY: check preview push

check:
	$(DNSCONTROL) check

preview:
	test -f creds.json || (echo "Missing creds.json; copy creds.example.json and configure it first" && exit 1)
	$(DNSCONTROL) preview --creds creds.json --full

push:
	@echo "Refusing to push locally. Production changes are applied by the protected GitHub Actions environment after merge."
	@exit 1
