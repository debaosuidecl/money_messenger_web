import React, { useState } from "react";
import MyInput from "../../Component/Input/Input";
import { Button } from "@material-ui/core";

function ResetPasswordForm({ email, setnewpassword, disabled }) {
  // context

  // const {setnewpassword} = useContext(AuthContext)

  // state
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  return (
    <form>
      <h4 style={{ fontWeight: 800 }}>Update Password for {email}</h4>
      <br />
      <MyInput
        value={password}
        onChange={(e) => setpassword(e.target.value)}
        label="Enter Password"
        type="password"
      />
      <br />
      <MyInput
        onChange={(e) => setconfirmpassword(e.target.value)}
        value={confirmpassword}
        type="password"
        label="Confirm Password"
      />
      <br />

      <Button
        variant="contained"
        disabled={disabled}
        color="primary"
        style={{
          background: disabled ? undefined : "black",
          width: "100%",
        }}
        onClick={() => setnewpassword(password, confirmpassword)}
        //   onClick={handlesendlink}
      >
        Change Password
      </Button>
    </form>
  );
}

export default ResetPasswordForm;
