function carrierSwitch(c) {
  if (c.indexOf("VERIZON") !== -1) {
    return "VERIZON";
  }
  if (
    c.indexOf("CINGULAR") !== -1 ||
    c.indexOf("AT&T") !== -1 ||
    c.indexOf("ATT") !== -1
  ) {
    return "AT&T";
  }
  if (c.indexOf("SPRINT") !== -1) {
    return "SPRINT";
  }
  if (c.indexOf("T-MOBILE") !== -1) {
    return "T-MOBILE";
  }
  if (c.indexOf("T-Mobile") !== -1) {
    return "T-MOBILE";
  }
  if (c.indexOf("METRO") !== -1 || c.indexOf("MetroPCS")) {
    return "METRO";
  }

  if (c.indexOf("N/A") !== -1) {
    return "N/A";
  }
  if (c.indexOf("United States Cellular Corporation") !== -1) {
    return "US Cellular";
  }

  return "OTHER";
}

module.exports = carrierSwitch;
