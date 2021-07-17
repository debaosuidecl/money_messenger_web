// @ts-nocheck

import React, { useState, useEffect } from "react";
import classes from "./Namecheap.module.css";
import MyInput from "../../Component/Input/Input";
import GLOBAL from "../GLOBAL/GLOBAL";
import REQ from "../../helperFunctions/requestModule";
import { Button } from "@material-ui/core";
import SingleDomain from "./SingleDomain";
function DomainSearcher({
  startdomaingeneration,
  tldlistfrombackend,
  fetchingdomains,
  setfetchingdomains,
  // socket,
  balance,
  setfetchcomplete,
  settldlistfrombackend,
  fetchcomplete,
  purchasetime,
  setpurchasetime,
  fetcherror,
}) {
  const [numberoflinks, setnumberoflinks] = useState(1);
  const [tlds, settlds] = useState([]);
  const [selectedtlds, setselectedtlds] = useState([]);
  // const [fetchstarted, setfetchstarted] = useState(false);
  //   const [loading, setloading] = useState(false);

  // effect

  useEffect(() => {
    _gettldlist();
  }, []);

  const _gettldlist = async () => {
    try {
      const res = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/domains/tld-list`,
        null,
        true
      );

      console.log(res.data);

      settlds(res.data);
    } catch (error) {
      alert("error in fetching tld list");
    }
  };

  const _selecttldhandler = (tld, { deselect }) => {
    console.log(deselect);
    if (!deselect) {
      return setselectedtlds([...new Set([...selectedtlds, tld])]);
    }

    setselectedtlds([
      ...new Set(
        [...selectedtlds].filter(
          (alreadyexistingtld) => alreadyexistingtld != tld
        )
      ),
    ]);
  };

  const _searchhandler = (e) => {
    let searchResults = tlds.filter(
      (tld) => tld.indexOf(e.target.value) !== -1
    );

    settlds(searchResults);

    if (!e.target.value) {
      _gettldlist();
    }
  };

  const styleA = {
    color: "#222",
    fontWeight: 100,
    textAlign: "left",
    paddingLeft: 10,
  };
  return (
    <>
      {fetchingdomains ? null : (
        <div className={classes.LoadingBody}>
          <p
            style={{
              ...styleA,
              paddingLeft: 5,
              fontWeight: 100,
            }}
          >
            Please white list the following IP address on your namecheap
            dashboard to use the API Service
          </p>
          <h1 style={{ textAlign: "left", fontSize: 18, paddingLeft: 3 }}>
            105.112.37.189
          </h1>
        </div>
      )}

      {fetchingdomains ? null : (
        <div className={classes.LoadingBody}>
          <h4
            style={{
              ...styleA,
              // paddingLeft: 5,
            }}
          >
            Namecheap Balance
          </h4>
          <h1 style={{ textAlign: "left", paddingLeft: 10, fontSize: 18 }}>
            ${balance}
          </h1>
        </div>
      )}
      {fetchingdomains ? null : (
        <div className={classes.LoadingBody}>
          <div className={classes.InputCont}>
            <p style={{ color: "#222", fontWeight: 500, textAlign: "left" }}>
              Select the number of domains you wish to purchase
            </p>
            <p
              style={{
                color: "#222",
                fontSize: 13,
                fontWeight: 100,
                textAlign: "left",
              }}
            >
              Random domain names will be generated
            </p>
            <br />
            <MyInput
              type="number"
              value={numberoflinks}
              label="Number of domains"
              onChange={(e) => setnumberoflinks(e.target.value)}
            />
          </div>
          <br />
          <div className={classes.seletedTLDs}>
            <h4 style={styleA}>Selected TLDs:</h4>
            {selectedtlds.length > 0 ? (
              <>
                <p
                  style={{
                    color: "#222",
                    paddingLeft: 10,
                    paddingTop: 10,
                    fontWeight: 100,
                    textAlign: "left",
                  }}
                >
                  click on the tlds to deselect
                </p>

                <div style={{ paddingLeft: 7 }} className={classes.tldcont}>
                  {selectedtlds &&
                    selectedtlds.map((tld) => (
                      <div
                        key={tld}
                        onClick={() =>
                          _selecttldhandler(tld, { deselect: true })
                        }
                        className={classes.tld}
                      >
                        {tld}
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <p
                style={{
                  color: "#222",
                  paddingLeft: 10,
                  paddingTop: 10,
                  fontWeight: 100,
                  textAlign: "left",
                }}
              >
                No TLDs have been selected
              </p>
            )}
          </div>
          <br />
          <div className={classes.SearchTLD}>
            <MyInput
              onChange={_searchhandler}
              placeholder="Search TLD"
              bottomBorder
            ></MyInput>
            <p style={styleA}>
              Click on the tlds to select tlds for your domain purchase
            </p>
            <br />
            <div className={classes.tldcont}>
              {tlds &&
                tlds.map((tld) => (
                  <div
                    key={tld}
                    onClick={() => _selecttldhandler(tld, { deselect: false })}
                    className={classes.tld}
                  >
                    {tld}
                  </div>
                ))}
            </div>
          </div>
          <br></br>
          <div className={classes.ButtonCont}>
            <Button
              // onClick={() =>
              //   domain_CRUD({
              //     configureApiKey: true,
              //   })
              // }

              onClick={() => {
                startdomaingeneration({
                  numberoflinks,
                  selectedtlds,
                });
              }}
              disabled={
                numberoflinks <= 0 ||
                selectedtlds.length <= 0 ||
                numberoflinks > 40
              }
              className={classes.buttonClass}
            >
              Generate Domains
            </Button>
          </div>
        </div>
      )}

      {/* Generate again Prompt */}

      {!fetchingdomains ? null : (
        <div className={classes.LoadingBody}>
          <div className={classes.Flex}>
            <div className={classes.Item}>
              <h4>Generate Domains</h4>
              <p>
                {numberoflinks} domains, {selectedtlds.length}{" "}
                {selectedtlds.length > 1 ? "TLDs" : "TLD"}
              </p>
              <p>
                Total Cost: $
                {tldlistfrombackend &&
                  tldlistfrombackend
                    .reduce((prev, cur) => {
                      return prev + cur.price;
                    }, 0)
                    .toFixed(2)}
              </p>
            </div>

            <div className={classes.Item}>
              <button
                onClick={() => {
                  setfetchingdomains(false);
                  setfetchcomplete(false);
                  settldlistfrombackend(false);
                  setpurchasetime(false);
                }}
              >
                Generate again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of Domains from backend */}

      {purchasetime ? null : (
        <div className={classes.fetchedDomains}>
          {tldlistfrombackend &&
            tldlistfrombackend.map((domain, i) => {
              return (
                <SingleDomain fetcherror={fetcherror} key={i} domain={domain} />
              );
            })}
        </div>
      )}

      {/* Continue to purchase section prompt */}
      {fetchcomplete && !purchasetime ? (
        <div className={classes.LoadingBody}>
          <div className={classes.Flex}>
            <div className={classes.Item}>
              <button
                onClick={() => {
                  setpurchasetime(true);
                }}
              >
                Continue To Purchase Section
              </button>
            </div>
            <div className={classes.Item}>
              <p>
                Total Cost: $
                {tldlistfrombackend
                  .reduce((prev, cur) => {
                    return prev + cur.price;
                  }, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* SECTION FOR ENTERING DOMAIN GROUP TRAFFIC DATA OWNER */}

      {/* <EnterDomainGroupTrafficDataOwner
      
      
      
      /> */}
    </>
  );
}

export default DomainSearcher;
