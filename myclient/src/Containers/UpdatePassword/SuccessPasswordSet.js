import React from "react";
import Layout from "../../Component/Layout/Layout";
import ImageAndMessage from "./ImageAndMessage";
// @ts-ignore
import classes from "./UpdatePassword.module.css";
function SuccessPasswordSet() {
  return (
    // @ts-ignore

    <Layout removesidenav>
      <div className={classes.LoadingBody}>
        <ImageAndMessage
          message="Yay, You have successfully reset your password"
          src="https://lh3.googleusercontent.com/proxy/Kgpdmbb5VLJ2UJC7yBkBGOCPmyAcIQ-8bEdv5leceVthVQRtZtbIrGIOARVFRhsHjVddRokXk5qsHoYhfrds_CPagkpE5TQOM2aWlgRJ8nRD-aYRGHv4fUIg6gavKg"
        />
      </div>
    </Layout>
  );
}

export default SuccessPasswordSet;
