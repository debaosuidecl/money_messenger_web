// @ts-nocheck

import React from "react";
import InputSearch from "../../Component/InputSearch/InputSearch";
import classes from "./Namecheap.module.css";
function EnterDomainGroupTrafficDataOwner({
  domaingroup,
  traffic,
  datasupplier,
  domaingroups,
  showdomaingroups,
  traffics,
  showtraffics,
  datasuppliers,
  showdatasuppliers,
  selectitemhandler,
  handleblurremotely,
  focusHandler,
  inputblurhandler,
  changehandler,
}) {
  return (
    <div className={classes.LoadingBody}>
      <div className={classes.Flex}>
        <div className={classes.Item}>
          <h4>Select Important Configurations</h4>
        </div>
      </div>
      <br />
      <div className={classes.InputCont}>
        <InputSearch
          placeholder="--Select Domain Group--"
          label="Select Domain Group"
          value={domaingroup}
          id="domaingroup"
          onBlur={(e) => inputblurhandler(e, "domaingroup")}
          handleblur={(e) => {
            console.log(e);
            handleblurremotely(e, "domaingroup");
          }}
          onFocus={(e) => focusHandler(e, "domaingroup")}
          selectitemhandler={selectitemhandler}
          onChange={(e) => changehandler(e, "domaingroup")}
          identifier="domaingroup"
          itemname="name"
          showingselectitmes={showdomaingroups}
          selectitems={domaingroups}
        />
      </div>
      <div className={classes.InputCont}>
        <InputSearch
          label="Select Traffic"
          onBlur={(e) => inputblurhandler(e, "verticals")}
          id="traffic"
          handleblur={(e) => {
            handleblurremotely(e, "verticals");
          }}
          placeholder="--Select Traffic--"
          onFocus={(e) => focusHandler(e, "verticals")}
          value={traffic}
          onChange={(e) => changehandler(e, "verticals")}
          showingselectitmes={showtraffics}
          selectitemhandler={selectitemhandler}
          identifier="verticals"
          itemname="name"
          selectitems={traffics}
        />
      </div>
      <div className={classes.InputCont}>
        <InputSearch
          value={datasupplier}
          id="datasupplier"
          onFocus={(e) => focusHandler(e, "dataowner")}
          onBlur={(e) => inputblurhandler(e, "dataowner")}
          handleblur={(e) => {
            handleblurremotely(e, "dataowner");
          }}
          onChange={(e) => changehandler(e, "dataowner")}
          selectitemhandler={selectitemhandler}
          label="Select Data Supplier"
          placeholder="--Select Data Supplier--"
          identifier="dataowner"
          itemname="name"
          showingselectitmes={showdatasuppliers}
          selectitems={datasuppliers}
        />
      </div>
    </div>
  );
}

export default EnterDomainGroupTrafficDataOwner;
