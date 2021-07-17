import { makeStyles } from "@material-ui/core/styles";

export const subscriptionstyle = makeStyles({
  root: {
    maxWidth: 700,
    margin: "90px auto",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
  },
  div: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },
  button: {
    margin: "2em auto 1em",
    width: "100%",
    background: "black",
  },
  card: {
    maxWidth: "700px",
  },
});
