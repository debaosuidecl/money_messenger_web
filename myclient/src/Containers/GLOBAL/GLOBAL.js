//@ts-nocheck
import React, { Component } from "react";

class GLOBAL extends Component {
  static domainMain =
    process.env.NODE_ENV === "production"
      ? "http://159.89.55.0:8080"
      : "http://localhost:8080";
  static domainDomains =
    process.env.NODE_ENV === "production"
      ? "http://159.89.55.0:8081"
      : "http://localhost:8081";
  static domainuserphoneupload =
    process.env.NODE_ENV === "production"
      ? "http://159.89.55.0:8082"
      : "http://localhost:8082";
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
