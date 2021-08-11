//@ts-nocheck
import React, { Component } from "react";

class GLOBAL extends Component {
  static domainMain =
    process.env.NODE_ENV === "production"
      ? "https://powersms-9b6t6.ondigitalocean.app/"
      : "http://localhost:8080";
  static uploadlead1 =
    process.env.NODE_ENV === "production"
      ? "http://159.89.55.0:9200"
      : "http://localhost:9200";
  static campaigns =
    process.env.NODE_ENV === "production"
      ? "http://159.89.55.0:9300"
      : "http://localhost:9300";

  render() {
    return;
  }
}

export default GLOBAL;
