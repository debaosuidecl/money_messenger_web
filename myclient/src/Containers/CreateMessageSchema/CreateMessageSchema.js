// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
// import Input from "../../Component/Input/Input";
import Layout from "../../Component/Layout/Layout";
import Routes from "../../Component/Routes/Routes";
import classes from "./CreateMessageSchema.module.css";
import REQ from "../../helperFunctions/requestModule";
import GLOBAL from "../GLOBAL/GLOBAL";
import { useParams, withRouter, Prompt } from "react-router";
import MySkeletonLoader from "../../Component/MySkeletonLoader/MySkeletonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyModal from "../../Component/MyModal/MyModal";
import {
  faInfoCircle,
  faPen,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import Info from "../Leads/Info";
import CreateSchemaMapMoal from "./CreateSchemaMap";

// import {  } from '@material-ui/core/colors';

function CreateMessageSchema({ history }) {
  const [formatSchema, setFormatSchema] = useState("");
  const [listOfUserCreatedSchemas, setlistOfUserCreatedSchemas] = useState([]);
  const [isEditingSchema, setIsEditingSchema] = useState(false);
  const [customlegendinfo, setcustomlegendinfo] = useState(false);
  const [pipeListName, setPipeListName] = useState("");
  const [listOfOptions, setListOfOptions] = useState([]);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [isCommunicatingwithServer, setisCommunicatingwithServer] =
    useState(false);
  const [successes, setsuccesses] = useState([]);

  // const [isEditingSchema, setIsEditingSchema] = useState(false);
  const [idOfUserSchemaToUpdate, setIdOfUserSchemaToUpdate] = useState("");

  const [randomOptionValue, setRandomOptionValue] = useState("");

  const [ShowingModalRandomMapList, setShowingModalRandomMapList] =
    useState(false);
  const [name, setname] = useState("");
  const [showdeleteschemamodal, setshowdeleteschemamodal] = useState(false);
  const [loading, setloading] = useState(true);
  const [isupdated, setisupdated] = useState(false);
  const [errors, seterrors] = useState([]);
  const { id } = useParams("id");

  useEffect(() => {
    getSingle();
    fetchUserCreatedSchemas();
    // setInterval(updateMessageStructure, 120000 )
    // return ()=>{
    //   updateMessageStructure()
    //   clearInterval(updateMessageStructure)
    // }
  }, []);

  
  // useEffect(() => {
  //   console.log(633333)
  //   setisupdated(true);
  // }, [isupdated]);

  const fetchUserCreatedSchemas = async () => {
    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/messageschema/getpipelines`,
        null,
        true
      );
      console.log(data);
      setlistOfUserCreatedSchemas(data);
    } catch (error) {
      seterrors(error.response.data.message);
      clearErrors();
    }
  };

  const deleteRule = async (id) => {
    try {
      setisCommunicatingwithServer(true);

      let pipeSeparatedOptions = "<<" + [...listOfOptions].join("|") + ">>";
      console.log(pipeSeparatedOptions, pipeListName);
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/messageschema/deletepipelinemap/${id}`,
        {
          pipeName: pipeListName,
          pipeList: pipeSeparatedOptions,
        },
        true
      );
      console.log(data);
      setisCommunicatingwithServer(false);

      if (data.success) {
        setshowDeleteModal(false);
        setListOfOptions([]);
        setShowingModalRandomMapList(false);
        fetchUserCreatedSchemas();
        setsuccesses([
          {
            msg: "Deleted Rule Successfully",
          },
        ]);
        clearSuccesses();
      }
    } catch (error) {
      setisCommunicatingwithServer(false);

      seterrors(error.response.data.message);
      clearErrors();
    }
  };
  const deleteSchema = async () => {
    try {
      setisCommunicatingwithServer(true);

      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/messageschema/delete/${id}`,
        null,

        true
      );
      console.log(data);
      setisCommunicatingwithServer(false);

      history.push("/campaign-message");
    } catch (error) {
      setisCommunicatingwithServer(false);

      seterrors(error.response.data.message);
      clearErrors();
    }
  };

  const clearErrors = () => {
    let timeoutval = 0;
    timeoutval = setTimeout(() => {
      seterrors([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const clearSuccesses = () => {
    let timeoutval = 0;
    timeoutval = setTimeout(() => {
      setsuccesses([]);

      clearTimeout(timeoutval);
    }, 5000);
  };

  const editSchema = async (e, id) => {
    e.preventDefault();

    try {
      setisCommunicatingwithServer(true);

      let pipeSeparatedOptions = "<<" + [...listOfOptions].join("|") + ">>";
      console.log(pipeSeparatedOptions, pipeListName);
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/messageschema/updatepipelinemap/${id}`,
        {
          pipeName: pipeListName,
          pipeList: pipeSeparatedOptions,
        },
        true
      );
      console.log(data);
      setisCommunicatingwithServer(false);

      if (data.success) {
        setListOfOptions([]);
        setShowingModalRandomMapList(false);
        fetchUserCreatedSchemas();
        setsuccesses([
          {
            msg: "You have edited a rule successfully",
          },
        ]);
        clearSuccesses();
      }
    } catch (error) {
      setisCommunicatingwithServer(false);

      seterrors(error.response.data.message);
      clearErrors();
    }
  };

  const createRule = async (e) => {
    e.preventDefault();

    setisCommunicatingwithServer(true);
    try {
      let pipeSeparatedOptions = "<<" + [...listOfOptions].join("|") + ">>";
      console.log(pipeSeparatedOptions, pipeListName);
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/messageschema/createpipelinemap`,
        {
          pipeName: pipeListName,
          pipeList: pipeSeparatedOptions,
        },
        true
      );
      console.log(data);
      setisCommunicatingwithServer(false);

      if (data.success) {
        setListOfOptions([]);
        setShowingModalRandomMapList(false);
        fetchUserCreatedSchemas();
        setsuccesses([
          {
            msg: "You have created a new rule",
          },
        ]);
        clearSuccesses();
      }
    } catch (error) {
      setisCommunicatingwithServer(false);

      seterrors(error.response.data.message);
      clearErrors();
    }
  };

  const addToListOfOptions = () => {
    let list = [...listOfOptions];
    list = [...list, randomOptionValue];
    setListOfOptions(list);
    setRandomOptionValue("");
  };

  const deleteOptionFromList = (indexToDelete) => {
    let list = [...listOfOptions];

    list = list.filter((o, i) => indexToDelete !== i);

    setListOfOptions(list);
  };

  const getSingle = async () => {
    try {
      const { data } = await REQ(
        "get",
        `${GLOBAL.domainMain}/api/messageschema/single/${id}`,
        null,
        true
      );
      console.log(data);

      if (!data.user) {
        return setloading(false);
      }
      setname(data.name);
      setFormatSchema(data?.messagestructure || "");
      //   seteditname(data.name);
      //   seturl(data.url);
      //   setediturl(data.url);
      //   setuser(data.user);
      //   setpostback(data.postback);
      //   seteditpostback(data.postback);
      setloading(false);
    } catch (error) {
      console.log(error.response.data);

      seterrors(error.response.data); // must be an array;
    }
  };

  const bringEditUserCreatedSchema = (schema) => {
    // "st".replaceAll("")
    let list = schema.pipeList
      .replaceAll("<<", "")
      .replaceAll(">>", "")
      .split("|");
    console.log(list);
    setIsEditingSchema(true);
    setListOfOptions(list);
    setPipeListName(schema.name);
    setIdOfUserSchemaToUpdate(schema._id);
    setShowingModalRandomMapList(true);
  };
  const updateMessageStructure = async () => {
    try {
      if(!formatSchema)return;
      const { data } = await REQ(
        "post",
        `${GLOBAL.domainMain}/api/messageschema/save-schema/${id}`,
        {
          formatSchema,
          // url,
        },
        true
      );

      // const id = data._id;

      setsuccesses([
        {
          msg: "Message Schema Saved",
        },
      ]);

      setisupdated(false)

      clearSuccesses();

      console.log(data);

      // history.push(`/vertical/${id}`);
    } catch (error) {
      console.log(error?.response?.data);

      seterrors(error?.response?.data?.errors); // must be an array;\

      if (Array.isArray(error.response.data)) {
        seterrors(error.response.data); // must be an array;\
      }

      let timeoutval = 0;
      timeoutval = setTimeout(() => {
        seterrors([]);

        clearTimeout(timeoutval);
      }, 5000);
    }
  };

  const ruledeletemodal = (
    content,
    opencondition,
    acceptaction,
    declineaction
  ) => (
    <MyModal
      open={opencondition}
      handleClose={() => {
        declineaction(false);
      }}
      maxWidth="500px"
    >
      <h3 style={{ color: "#222", fontWeight: 100 }}>{content}</h3>

      <br />

      <button
        onClick={() => acceptaction()}
        className={[classes.Option, classes.Red].join(" ")}
      >
        Yes
      </button>
      <button
        onClick={() => declineaction()}
        className={[classes.Option, classes.black].join(" ")}
      >
        No
      </button>
    </MyModal>
  );
  return (
    <Layout>

<Prompt
  when={isupdated}
  message="Are you sure you want to leave this page without saving your message schema?"
/>
      {ruledeletemodal(
        "Are You sure you want to delete this rule now?",
        showDeleteModal,
        () => deleteRule(idOfUserSchemaToUpdate),
        () => setshowDeleteModal(false)
      )}
      {ruledeletemodal(
        "Are You sure you want to delete this schema modal? This action is irreversible.",
        showdeleteschemamodal,
        () => deleteSchema(),
        () => setshowdeleteschemamodal(false)
      )}
      <CreateSchemaMapMoal
        setShowingModalRandomMapList={setShowingModalRandomMapList}
        ShowingModalRandomMapList={ShowingModalRandomMapList}
        setPipeListName={setPipeListName}
        editRule={editSchema}
        deleteRule={() => {
          setshowDeleteModal(true);
        }}
        pipeListName={pipeListName}
        listOfOptions={listOfOptions}
        isEditingSchema={isEditingSchema}
        idOfUserSchemaToUpdate={idOfUserSchemaToUpdate}
        setListOfOptions={addToListOfOptions}
        randomOptionValue={randomOptionValue}
        setRandomOptionValue={setRandomOptionValue}
        isCommunicatingwithServer={isCommunicatingwithServer}
        // setisCommunicatingwithServer={setisCommunicatingwithServer}
        deleteOptionFromList={deleteOptionFromList}
        createRule={createRule}
      />
      <Info
        show={customlegendinfo}
        handleClose={() => setcustomlegendinfo(false)}
      >
        As there are prepopulated legends such as {"{"}firstname{"}"} etc, You
        can also create your own legends based on randomized characters. all you
        need to do is to set the keyword for the legend eg: "Greeting", and then
        you can add a list of words that pertain to the keyword such as: "Hi",
        "Hello", "Hey there" etc. This way each message you send feels unique to
        the particualr lead recieving it.
      </Info>
      <div className={classes.CreateMessageSchema}>
        <Routes
          routeList={[
            {
              name: "Home",
              link: "/dashboard",
            },
            {
              name: "Message Schema",
              link: "/campaign-message",
            },
          ]}
        />
        <br />
        <div className={classes.Container}>
          {loading ? (
            <div className={classes.LoadingBody}>
              <MySkeletonLoader />
            </div>
          ) : (
            <>
              <div className={classes.title}>
                <h4>Configure Message Schema: {name}</h4>
              </div>

              <div className={classes.body}>
                <div className={classes.InputCont}>
                  <div className={classes.TextAreaCont}>
                    <label htmlFor="">Schema</label>
                    <textarea
                      placeholder="Please Enter a message schema"
                      value={formatSchema}
                      onChange={(e) => {
                        setFormatSchema(e.target.value)

                        setisupdated(true)
                      
                      }
                      
                      
                      }
                    ></textarea>
                  </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #eee" }} />

                <div className={classes.Legend}>
                  <div style={{ textAlign: "left", marginLeft: 10 }}>
                    <p style={{ fontWeight: 100 }}>Message format legend:</p>
                  </div>
                  <ul>
                    <li
                      id="{first_name}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{first_name}");
                      }}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text", e.target.id);
                      }}
                      draggable
                    >
                      First name: {"{first_name}"}
                    </li>
                    <li
                      id="{last_name}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{last_name}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      Last name: {"{last_name}"}
                    </li>
                    <li
                      id="{random_name}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{random_name}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      Random name: {"{random_name}"}
                    </li>
                    <li
                      id="{address}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{address}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      Address: {"{address}"}
                    </li>
                    <li
                      id="{carrier}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{carrier}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      Carrier: {"{carrier}"}
                    </li>
                    <li
                      id="{city}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{city}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      City: {"{city}"}
                    </li>
                    <li
                      id="{state}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{state}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      state: {"{state}"}
                    </li>
                    <li
                      id="{email}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{email}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      state: {"{email}"}
                    </li>
                    <li
                      id="{domain}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{domain}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      domain: {"{domain}"}
                    </li>
                    <li
                      id="{title}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{title}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      title: {"{title}"}
                    </li>
                    <li
                      id="{4_random_digits}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{4_random_digits}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      {"{4_random_digits}"}
                    </li>
                    <li
                      id="{multiples_of_5_5k}"
                      onClick={() => {
                        setFormatSchema((text) => text + "{multiples_of_5_5k}");
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      {"{multiples_of_5_5k}"}
                    </li>
                    <li
                      id="{multiples_of_5_10k}"
                      onClick={() => {
                        setFormatSchema(
                          (text) => text + "{multiples_of_5_10k}"
                        );
                      }}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("text", e.target.id)
                      }
                      draggable
                    >
                      {"{multiples_of_5_10k}"}
                    </li>
                  </ul>

                  <br></br>
                  <div style={{ textAlign: "left", marginLeft: 10 }}>
                    <p className={classes.CL} style={{ fontWeight: 100 }}>
                      My Custom Legends{" "}
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        onClick={() => {
                          setcustomlegendinfo(true);
                        }}
                      />
                      :
                    </p>
                  </div>
                  <br />

                  <div className={classes.UserCreatedSection}>
                    <div
                      onClick={() => {
                        setShowingModalRandomMapList(true);
                        setIsEditingSchema("");
                        setPipeListName("");
                        setListOfOptions([]);
                      }}
                      className={classes.AddUserSchema}
                    >
                      <p>Add New Rule</p>

                      <FontAwesomeIcon icon={faPlusCircle} />
                    </div>
                  </div>

                  {listOfUserCreatedSchemas.length > 0
                    ? // <span style={{ color: "#bbb", fontSize: 13 }}>
                      //   {" "}
                      //   User Created Schema
                      // </span>
                      // <p
                      null
                    : //   style={{
                      //     textAlign: "left",
                      //     fontWeight: 100,
                      //     marginLeft: 10,
                      //     fontSize: 14,
                      //   }}
                      // >
                      //   Right click on a schema to edit it
                      // </p>
                      null}
                  <ul>
                    {listOfUserCreatedSchemas.map((schema, i) => {
                      return (
                        <div className={classes.CustomSchema}>
                          <li
                            id={schema._id}
                            style={{ fontWeight: 100 }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              bringEditUserCreatedSchema(schema);
                            }}
                            onClick={() => {
                              setFormatSchema(
                                (text) => text + "{{" + schema.name + "}}"
                              );
                            }}
                            data-transfer={`{{${schema.name}}}`}
                            onDragStart={(e) =>
                              e.dataTransfer.setData(
                                "text",
                                `${e.target.getAttribute("data-transfer")}`
                              )
                            }
                            draggable
                          >
                            {"{{"}
                            {schema.name}
                            {"}}"}
                          </li>

                          <FontAwesomeIcon
                            onClick={(e) => {
                              e.preventDefault();
                              bringEditUserCreatedSchema(schema);
                            }}
                            style={{
                              marginLeft: -5,
                              color: "#bbb",
                              cursor: "pointer",
                            }}
                            icon={faPen}
                          />
                        </div>
                      );
                    })}
                  </ul>
                </div>

                <div className={classes.ButtonCont}>
                  <Button
                    onClick={updateMessageStructure}
                    disabled={!isupdated || !formatSchema}
                    className={classes.buttonClass}
                  >
                    Save Changes to schema
                  </Button>
                </div>
                <div className={classes.ButtonCont}>
                  <Button
                    onClick={setshowdeleteschemamodal}
                    // disabled={!isupdated || !formatSchema}
                    className={classes.buttonClass2}
                  >
                    Delete Schema
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={classes.Errors}>
        {errors &&
          errors.map((e) => {
            return (
              <p className={classes.Error} key={e.msg}>
                {e.msg}
              </p>
            );
          })}
      </div>
      <div className={classes.Successes}>
        {successes &&
          successes.map((e) => {
            return (
              <p className={classes.Success} key={e.msg}>
                {e.msg}
              </p>
            );
          })}
      </div>
    </Layout>
  );
}

export default withRouter(CreateMessageSchema);
