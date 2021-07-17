import React, { Component } from "react";
import classes from "./CustomModal.module.css";
// import Aux from "../../../hoc/myAux/myAux";
import Backdrop from "../Backdrop/Backdrop";

class CustomModal extends Component {
  shouldComponentUpdate(nextProp, nextState) {
    return (
      nextProp.show !== this.props.show ||
      nextProp.children !== this.props.children
    );
  }

  render() {
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.removeModal} />
        <div
          className={
            this.props.show
              ? [classes.Modal, classes.SlideDown].join(" ")
              : classes.Modal
          }
          // style={{
          //   transform: this.props.show
          //     ? 'translateY(0) '
          //     : 'translateY(-100vh) !important',
          //   opacity: this.props.show ? '1' : '0'
          // }}
        >
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

export default CustomModal;
