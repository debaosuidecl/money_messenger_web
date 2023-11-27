//@ts-nocheck
import React, { Component } from "react";

class GLOBAL extends Component {
  static domainMain =
    process.env.NODE_ENV === "production"
      ? "https://short-message-service.com"
      : "http://localhost:8080";
  static uploadlead1 =
    process.env.NODE_ENV === "production"
      ? "http://leads.short-message-service.com"
      : "http://localhost:9200";
  static campaigns =
    process.env.NODE_ENV === "production"
      ? "http://159.89.55.0:9300"
      : "http://campaigns.short-message-service.com";

  render() {
    return;
  }
}

export default GLOBAL;
