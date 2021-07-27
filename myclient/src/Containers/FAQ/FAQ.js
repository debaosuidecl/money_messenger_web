import React from "react";
// import "./FAQ.css";
import Layout from "../../Component/Layout/Layout";
import classes from "./FAQ.module.css";
import { FontAwesomeIcon as F } from "@fortawesome/react-fontawesome";
import { Collapse, CardBody, Card } from "reactstrap";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

function FAQ() {
  const [isOpen, setIsOpen] = React.useState(true);
  const [faqs, setfaqs] = React.useState([
    {
      question: "Can I send  my campaigns with any API Route of My choice?",
      id: 1,
      collapse: false,
      answer:
        "Yes you can, you just need to properly go through the documentation of you API route provider ",
    },
    {
      question: "Can I pause, abort and resume my campaigns?",
      id: 2,
      collapse: false,
      answer:
        "Yes you can, in a seemless manner. You can do this by clicking on the play pause or abort buttons that appear at the extreme right of an active campaign",
    },
  ]);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Layout>
      <div>
        <br></br>

        <div className={classes.CreateCont}>
          <div className={classes.title}>
            <h1>Frequently Asked Questions</h1>
          </div>
        </div>

        <div className={classes.FAQ}>
          {faqs.map((faq) => {
            return (
              <div onClick={toggle} className={classes.Question}>
                <p className={classes.QCont}>
                  {faq.question}{" "}
                  {/* <F
                    icon={faArrowDown}
                    style={{
                      transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                    }}
                  /> */}
                </p>
                <Collapse isOpen={isOpen}>
                  <p>{faq.answer}</p>
                </Collapse>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default FAQ;
