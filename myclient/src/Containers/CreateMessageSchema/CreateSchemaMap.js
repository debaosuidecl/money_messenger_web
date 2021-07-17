// @ts-nocheck
import React, { useRef } from "react";
// import CustomModal from "../../Component/CustomModal/CustomModal";
import MyInput from "../../Component/Input/Input";
import classes from "./CreateMessageSchema.module.css";
import MyModal from "../../Component/MyModal/MyModal";

function CreateSchemaMapMoal({
  setShowingModalRandomMapList,
  createRule,
  ShowingModalRandomMapList,
  pipeListName,
  setPipeListName,
  isEditingSchema,
  randomOptionValue,
  setRandomOptionValue,
  isCommunicatingwithServer,
  setListOfOptions,
  editRule,
  deleteRule,
  idOfUserSchemaToUpdate,
  listOfOptions,
  deleteOptionFromList,
}) {
  const inputRef = useRef(null);

  return (
    <MyModal
      open={ShowingModalRandomMapList}
      handleClose={() =>
        setShowingModalRandomMapList(!ShowingModalRandomMapList)
      }
    >
      <form
        className={classes.EditSeedCont}
        onSubmit={(e) =>
          isEditingSchema ? editRule(e, idOfUserSchemaToUpdate) : createRule(e)
        }
      >
        {isEditingSchema ? (
          <p
            style={{ fontWeight: 100, textAlign: "center" }}
            className={classes.ModalHeader}
          >
            Edit Rule
          </p>
        ) : (
          <p
            style={{ fontWeight: 100, textAlign: "center" }}
            className={classes.ModalHeader}
          >
            Create Rule
          </p>
        )}
        <div className={classes.InputCont}>
          {" "}
          <MyInput
            type="text"
            label="Random List Name"
            placeholder="Enter name of Random list e.g:  Greetings"
            value={pipeListName}
            onChange={(e) => setPipeListName(e.target.value)}
          />
        </div>
        <p style={{ fontWeight: 100, textAlign: "center" }}>
          Randomized words:
        </p>
        <div className={classes.ListOfTags}>
          {listOfOptions.map((option, i) => {
            return (
              <div className={classes.Option} key={i}>
                {option}{" "}
                <span
                  onClick={() => deleteOptionFromList(i)}
                  className={classes.Delete}
                >
                  x
                </span>
              </div>
            );
          })}
        </div>
        <div className={classes.InputCont}>
          <div className={classes._}>
            <input
              type="text"
              value={randomOptionValue}
              ref={inputRef}
              onChange={(e) => setRandomOptionValue(e.target.value)}
              placeholder="Enter words to cycle and press tab"
              onKeyDown={(e) => {
                // console.log(e.target.value);
                if (e.key === "Tab") {
                  e.preventDefault();
                  if (e.target.value.length > 0) {
                    setListOfOptions();
                    inputRef.current.focus();
                  }
                }
                console.log(e.key);
              }}
            />
          </div>
        </div>

        <div className={classes.ButtonContForRules}>
          <button
            disabled={
              !pipeListName ||
              listOfOptions.length <= 0 ||
              isCommunicatingwithServer
            }
            className={classes.inject}
            // onClick={() => createRule()}
          >
            {isEditingSchema ? "Edit Rule" : "Create Rule"}
          </button>
          <br />
          {isEditingSchema ? (
            <p
              className={classes.DeleteRule}
              onClick={() => deleteRule(idOfUserSchemaToUpdate)}
            >
              Delete Rule
            </p>
          ) : null}
          {/* <button>Inject</button> */}
        </div>
      </form>
    </MyModal>
  );
}

export default CreateSchemaMapMoal;
