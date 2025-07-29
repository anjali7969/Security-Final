// ssrfCheck.js (or in utils/ssrfCheck.js)
const dns = require("dns").promises;
const ipRangeCheck = require("ip-range-check");

const blockedRanges = [
  "127.0.0.0/8",
  "10.0.0.0/8",
  "172.16.0.0/12",
  "192.168.0.0/16",
  "169.254.0.0/16",
  "::1",
  "fc00::/7",
  "fe80::/10",
];

const isSafeUrl = async (url) => {
  try {
    const { hostname } = new URL(url);
    const addresses = await dns.lookup(hostname, { all: true });
    for (const addr of addresses) {
      if (ipRangeCheck(addr.address, blockedRanges)) {
        return false;
      }
    }
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { isSafeUrl };
