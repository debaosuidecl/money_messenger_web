// @ts-nocheck
import React from "react";

import MyModal from "../../Component/MyModal/MyModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function Info({ show, handleClose, children }) {
  return (
    <MyModal open={show} handleClose={handleClose}>
      <div className="">
        <h2>
          <FontAwesomeIcon icon={faInfoCircle} /> Info
        </h2>
        <br />
        <hr />
      </div>
      <br />
      <p style={{ fontWeight: 100 }}>{children}</p>
    </MyModal>
  );
}

export default Info;
