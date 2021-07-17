import React from "react";
// @ts-ignore
import classes from "./UserActivity.module.css";
import Single from "./Single";
function UserActivity({ activities }) {
  return (
    <div className={classes.UserActivity}>
      <header>
        <h5 className={classes.title}>Latest Activities</h5>
      </header>

      <ul>{activities && activities.map((a) => <Single activity={a} />)}</ul>

      {activities.length <= 0 ? (
        <div className={classes.noactivity}>
          <h3>There are no user activities at this moment</h3>
        </div>
      ) : null}
    </div>
  );
}

export default UserActivity;
