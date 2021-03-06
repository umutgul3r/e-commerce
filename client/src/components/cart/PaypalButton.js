import React from "react";
import PaypalExpressBtn from "react-paypal-express-checkout";

export default class PaypalButton extends React.Component {
  render() {
    const onSuccess = (payment) => {
      this.props.tranSuccess(payment);
    };

    const onCancel = (data) => {
      console.log("The payment was cancelled!", data);
    };

    const onError = (err) => {
      console.log("Error!", err);
    };

    let env = "sandbox";
    let currency = "USD";
    let total = this.props.total;

    const client = {
      sandbox:
        "AaliDxtIOkseJQO3MryBmBZJw7E8tJ5kSy0OEdLzolH-SFU3XBam0LnfpZhNmgzmvfZ7rL-m0h8j7KJa",
    };

    let style = {
      size: "responsive",
      color: "black",
      shape: "pill",
      label: "checkout",
      tagline: false,
    };

    return (
      <PaypalExpressBtn
        env={env}
        client={client}
        currency={currency}
        total={total}
        onError={onError}
        onSuccess={onSuccess}
        onCancel={onCancel}
        style={style}
      />
    );
  }
}
