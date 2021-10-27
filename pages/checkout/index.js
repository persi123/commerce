import React, { Component } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
// import { Card, Checkbox, Form, Radio, Tabs } from "antd";
import { Steps, Button, message, Card, Radio, Checkbox, Progress } from "antd";
import { AppstoreAddOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import ccFormat from "../../utils/ccFormat";
import commerce from "../../lib/commerce";
// import Checkbox from "../../components/common/atoms/Checkbox";
import Dropdown from "../../components/common/atoms/Dropdown";
import Radiobox from "../../components/common/atoms/Radiobox";
import Root from "../../components/common/Root";
import AddressForm from "../../components/checkout/common/AddressForm";
import PaymentDetails from "../../components/checkout/common/PaymentDetails";
import Loader from "../../components/checkout/Loader";
import {
  generateCheckoutTokenFromCart as dispatchGenerateCheckout,
  getShippingOptionsForCheckout as dispatchGetShippingOptions,
  setShippingOptionInCheckout as dispatchSetShippingOptionsInCheckout,
  setDiscountCodeInCheckout as dispatchSetDiscountCodeInCheckout,
  captureOrder as dispatchCaptureOrder,
} from "../../store/actions/checkoutActions";
import Group from "./Group.png";
import discount from "./discount.png";
import { connect } from "react-redux";
import { withRouter } from "next/router";
// import { DeliveryCards, CustomRadio, Tab, CustomCheck } from "./addressComponent/style";
import { CardElement, Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { Form, Tabs, Collapse } from "antd";
import pickrrLogo from "./pickrrLogo.jpeg";
import deleteIcon from "./delete.png";
import AddressContainer from "./addressComponent/addressForm";
import AddressContent from "./addressComponent/AddressContent.js";
import OtpVerification from "./otpComponent/index";
import GeneratedOtp from "./otpComponent/generatedOtp";
import Payment from "./paymentComponent/index";
import Success from "./success/success";
const billingOptions = ["Same as shipping Address", "Use a different billing address"];

/**
 * Render the checkout page
 */
class CheckoutPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBillingOption: billingOptions[0],
      current: 0,
      // string property names to conveniently identify inputs related to commerce.js validation errors
      // e.g error { param: "shipping[name]"}
      "customer[first_name]": "John",
      "customer[last_name]": "Doe",
      "customer[email]": "john@doe.com",
      "customer[phone]": "",
      "customer[id]": null,
      "shipping[name]": "John Doe",
      "shipping[street]": "318 Homer Street",
      "shipping[street_2]": "",
      "shipping[town_city]": "Vancouver",
      "shipping[region]": "BC",
      "shipping[postal_zip_code]": "V6B 2V2",
      "shipping[country]": "CA",
      "billing[name]": "",
      "billing[street]": "",
      "billing[street_2]": "",
      "billing[town_city]": "",
      "billing[region]": "",
      "billing[postal_zip_code]": "",
      "billing[country]": "",
      receiveNewsletter: true,
      orderNotes: "",
      countries: {},

      "fulfillment[shipping_method]": "",
      cardNumber: ccFormat("4242424242424242"),
      expMonth: "11",
      expYear: "22",
      cvc: "123",
      billingPostalZipcode: "V6B 2V2",

      errors: {
        "fulfillment[shipping_method]": null,
        gateway_error: null,
        "customer[email]": null,
        "shipping[name]": null,
        "shipping[street]": null,
        "shipping[town_city]": null,
        "shipping[postal_zip_code]": null,
      },

      discountCode: "CUSTOMCOMMERCE",

      selectedGateway: "test_gateway",
      loading: false,
      // Optional if using Stripe, used to track steps of checkout using Stripe.js
      stripe: {
        paymentMethodId: null,
        paymentIntentId: null,
      },
      edit: false,
      formId: "",
      type: "",
      pincode: "",
      city: "",
      state: "",
      addressLine1: "",
      addressLine2: "",

      type: "",
      addressList: [
        {
          type: "home",
          pincode: "301001",
          city: "alwar",
          state: "rajasthan",
          addressLine: "Lorem Ipsum has been the industry's ",
        },
        {
          type: "work",
          pincode: "301001",
          city: "alwar",
          state: "rajasthan",
          addressLine: "Lorem Ipsum has been the industry's ",
          // addressLine: "Lorem Ipsum has been the industry's ",
        },
        {
          type: "other",
          pincode: "301001",
          city: "alwar",
          state: "rajasthan",
          addressLine: "Lorem Ipsum has been the industry's ",
          // addressLine2: "Lorem Ipsum has been the industry's ",
        },
      ],
      shippingAddressList: [
        {
          type: "other",
          pincode: "301001",
          city: "alwar",
          state: "rajasthan",
          addressLine: "Lorem Ipsum has been the industry's ",
          // addressLine2: "Lorem Ipsum has been the industry's ",
        },
      ],
      selectedAddress: "home",
      selectedDeliverySpeed: "express",
      editShipping: false,
      paymentMethod: "prepaid",
      otpVerified: false,
      pendingOtp: true,
      success: true,
      billingAddress: "",
    };

    this.captureOrder = this.captureOrder.bind(this);
    this.generateToken = this.generateToken.bind(this);
    this.getAllCountries = this.getAllCountries.bind(this);
    this.toggleNewsletter = this.toggleNewsletter.bind(this);
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.handleDiscountChange = this.handleDiscountChange.bind(this);
    this.handleGatewayChange = this.handleGatewayChange.bind(this);
    this.handleCaptureSuccess = this.handleCaptureSuccess.bind(this);
    this.handleCaptureError = this.handleCaptureError.bind(this);
    this.redirectOutOfCheckout = this.redirectOutOfCheckout.bind(this);
  }

  next = () => {
    console.log(this.state.current);
    if (this.state.current == 2) {
      this.setState({ success: false });
    } else {
      this.setState({ current: this.state.current + 1, success: true });
    }
  };

  prev = () => {
    this.setState({ current: this.state.current - 1 });
  };

  componentDidMount() {
    // if cart is empty then redirect out of checkout;
    if (this.props.cart && this.props.cart.total_items === 0) {
      this.redirectOutOfCheckout();
    }

    this.updateCustomerFromRedux();
    // on initial mount generate checkout token object from the cart,
    // and then subsequently below in componentDidUpdate if the props.cart.total_items has changed
    this.generateToken();
  }

  componentDidUpdate(prevProps, prevState) {
    // if cart items have changed then regenerate checkout token object to reflect changes.
    if (
      prevProps.cart &&
      prevProps.cart.total_items !== this.props.cart.total_items &&
      !this.props.orderReceipt
    ) {
      // reset selected shipping option
      this.setState({
        "fulfillment[shipping_method]": "",
      });
      // regenerate checkout token object since cart has been updated
      this.generateToken();
    }

    if (this.props.customer && !prevProps.customer) {
      this.updateCustomerFromRedux();
    }

    const hasDeliveryCountryChanged =
      prevState["shipping[country]"] !== this.state["shipping[country]"];
    const hasDeliveryRegionChanged =
      prevState["shipping[region]"] !== this.state["shipping[region]"];

    // if delivery country or region have changed, and we still have a checkout token object, then refresh the token,
    // and reset the previously selected shipping method
    if ((hasDeliveryCountryChanged || hasDeliveryRegionChanged) && this.props.checkout) {
      // reset selected shipping option since previous checkout token live object shipping info
      // was set based off delivery country, deliveryRegion
      this.setState({
        "fulfillment[shipping_method]": "",
      });
      this.generateToken();
    }

    // if selected shippiing option changes, regenerate checkout token object to reflect changes
    if (
      prevState["fulfillment[shipping_method]"] !== this.state["fulfillment[shipping_method]"] &&
      this.state["fulfillment[shipping_method]"] &&
      this.props.checkout
    ) {
      // update checkout token object with shipping information
      this.props.dispatchSetShippingOptionsInCheckout(
        this.props.checkout.id,
        this.state["fulfillment[shipping_method]"],
        this.state["shipping[country]"],
        this.state["shipping[region]"]
      );
    }

    console.log(this.state, "hii");
  }

  /**
   * Uses the customer provided by redux and updates local state with customer detail (if present)
   */
  updateCustomerFromRedux() {
    // Pull the customer object from prop (provided by redux)
    const { customer } = this.props;

    // Exit early if the customer doesn't exist
    if (!customer) {
      return;
    }

    // Build a some new state to use with "setState" below
    const newState = {
      "customer[email]": customer.email,
      "customer[id]": customer.id,
    };

    if (customer.firstname) {
      newState["customer[first_name]"] = customer.firstname;
      newState["shipping[name]"] = customer.firstname;
      newState["billing[name]"] = customer.firstname;
    }

    if (customer.lastname) {
      newState["customer[last_name]"] = customer.lastname;

      // Fill in the rest of the full name for shipping/billing if the first name was also available
      if (customer.firstname) {
        newState["shipping[name]"] += ` ${customer.lastname}`;
        newState["billing[name]"] += ` ${customer.lastname}`;
      }
    }

    this.setState(newState);
  }

  /**
   * Generate a checkout token. This is called when the checkout first loads.
   */
  generateToken() {
    const { cart, dispatchGenerateCheckout, dispatchGetShippingOptions } = this.props;
    const { "shipping[country]": country, "shipping[region]": region } = this.state;

    // Wait for a future update when a cart ID exists
    if (typeof cart.id === "undefined") {
      return;
    }

    return dispatchGenerateCheckout(cart.id)
      .then((checkout) => {
        // continue and dispatch getShippingOptionsForCheckout to get shipping options based on checkout.id
        this.getAllCountries(checkout);
        return dispatchGetShippingOptions(checkout.id, country, region);
      })
      .catch((error) => {
        console.log("error caught in checkout/index.js in generateToken", error);
      });
  }

  redirectOutOfCheckout() {
    this.props.router.push("/");
  }

  handleGatewayChange(selectedGateway) {
    this.setState({
      selectedGateway,
    });
  }

  handleDiscountChange(e) {
    e.preventDefault();
    if (!this.state.discountCode.trim() || !this.props.checkout) {
      return;
    }

    this.props
      .dispatchSetDiscountCodeInCheckout(this.props.checkout.id, this.state.discountCode)
      .then((resp) => {
        if (resp.valid) {
          return this.setState({
            discountCode: "",
          });
        }
        return Promise.reject(resp);
      })
      .catch((error) => {
        alert("Sorry, the discount code could not be applied");
      });
  }

  handleChangeForm(e) {
    // when input cardNumber changes format using ccFormat helper
    if (e.target.name === "cardNumber") {
      e.target.value = ccFormat(e.target.value);
    }
    // update form's input by name in state
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  /**
   * Handle a successful `checkout.capture()` request
   *
   * @param {object} result
   */
  handleCaptureSuccess(result) {
    this.props.router.push("/checkout/confirm");
  }

  /**
   * Handle an error during a `checkout.capture()` request
   *
   * @param {object} result
   */
  handleCaptureError(result) {
    // Clear the initial loading state
    this.setState({ loading: false });

    let errorToAlert = "";

    // If errors are passed as strings, output them immediately
    if (typeof result === "string") {
      alert(result);
      return;
    }

    const {
      data: { error = {} },
    } = result;

    // Handle any validation errors
    if (error.type === "validation") {
      console.error("Error while capturing order!", error.message);

      if (typeof error.message === "string") {
        alert(error.message);
        return;
      }

      error.message.forEach(({ param, error }, i) => {
        this.setState({
          errors: {
            ...this.state.errors,
            [param]: error,
          },
        });
      });

      errorToAlert = error.message.reduce((string, error) => {
        return `${string} ${error.error}`;
      }, "");
    }

    // Handle internal errors from the Chec API
    if (["gateway_error", "not_valid", "bad_request"].includes(error.type)) {
      this.setState({
        errors: {
          ...this.state.errors,
          [error.type === "not_valid" ? "fulfillment[shipping_method]" : error.type]: error.message,
        },
      });
      errorToAlert = error.message;
    }

    // Surface any errors to the customer
    if (errorToAlert) {
      alert(errorToAlert);
    }
  }

  /**
   * Capture the order
   *
   * @param {Event} e
   */
  captureOrder(e) {
    e.preventDefault();

    // reset error states
    this.setState({
      errors: {
        "fulfillment[shipping_method]": null,
        gateway_error: null,
        "shipping[name]": null,
        "shipping[street]": null,
      },
    });

    // set up line_items object and inner variant group object for order object below
    const line_items = this.props.checkout.live.line_items.reduce((obj, lineItem) => {
      const variantGroups = lineItem.selected_options.reduce((obj, option) => {
        obj[option.group_id] = option.option_id;
        return obj;
      }, {});
      obj[lineItem.id] = { ...lineItem, variantGroups };
      return obj;
    }, {});

    const shippingAddress = {
      name: this.state["shipping[name]"],
      country: this.state["shipping[country]"],
      street: this.state["shipping[street]"],
      street_2: this.state["shipping[street_2]"],
      town_city: this.state["shipping[town_city]"],
      county_state: this.state["shipping[region]"],
      postal_zip_code: this.state["shipping[postal_zip_code]"],
    };

    // construct order object
    const newOrder = {
      line_items,
      customer: {
        firstname: this.state["customer[first_name]"],
        lastname: this.state["customer[last_name]"],
        email: this.state["customer[email]"],
        phone: this.state["customer[phone]"] || undefined,
      },
      // collected 'order notes' data for extra field configured in the Chec Dashboard
      extrafields: {
        extr_j0YnEoqOPle7P6: this.state.orderNotes,
      },
      // Add more to the billing object if you're collecting a billing address in the
      // checkout form. This is just sending the name as a minimum.
      billing:
        this.state.selectedBillingOption === "Same as shipping Address"
          ? shippingAddress
          : {
              name: this.state["billing[name]"],
              country: this.state["billing[country]"],
              street: this.state["billing[street]"],
              street_2: this.state["billing[street_2]"],
              town_city: this.state["billing[town_city]"],
              county_state: this.state["billing[region]"],
              postal_zip_code: this.state["billing[postal_zip_code]"],
            },
      shipping: shippingAddress,
      fulfillment: {
        shipping_method: this.state["fulfillment[shipping_method]"],
      },
      payment: {
        gateway: this.state.selectedGateway,
      },
    };

    // If test gateway selected add necessary card data for the order to be completed.
    if (this.state.selectedGateway === "test_gateway") {
      this.setState({
        loading: true,
      });

      newOrder.payment.card = {
        number: this.state.cardNumber,
        expiry_month: this.state.expMonth,
        expiry_year: this.state.expYear,
        cvc: this.state.cvc,
        postal_zip_code: this.state.billingPostalZipcode,
      };
    }

    // If Stripe gateway is selected, register a payment method, call checkout.capture(),
    // and catch errors that indicate Strong Customer Authentication is required. In this
    // case we allow Stripe.js to handle this verification, then re-submit
    // `checkout.capture()` using the payment method ID or payment intent ID returned at
    // each step.
    if (this.state.selectedGateway === "stripe") {
      // Create a new Payment Method in Stripe.js
      return this.props.stripe
        .createPaymentMethod({
          type: "card",
          card: this.props.elements.getElement(CardElement),
        })
        .then((response) => {
          // Check for errors from using Stripe.js, surface to the customer if found
          if (response.error) {
            this.handleCaptureError(response.error.message);
            return;
          }

          // Enable loading state now that we're finished interacting with Elements
          this.setState({
            loading: true,
          });

          // Get the payment method ID and continue with the capture request
          this.props
            .dispatchCaptureOrder(this.props.checkout.id, {
              ...newOrder,
              payment: {
                ...newOrder.payment,
                stripe: {
                  payment_method_id: response.paymentMethod.id,
                },
              },
            })
            // If no further verification is required, go straight to the "success" handler
            .then(this.handleCaptureSuccess)
            .catch((error) => {
              // Look for "requires further verification" from the Commerce.js backend. This
              // will be surfaced as a 402 Payment Required error, with a unique type, and
              // the secret you need to continue verifying the transaction on the frontend.
              if (error.data.error.type !== "requires_verification") {
                this.handleCaptureError(error);
                return;
              }

              this.props.stripe.handleCardAction(error.data.error.param).then((result) => {
                // Check for errors from Stripe, e.g. failure to confirm verification of the
                // payment method, or the card was declined etc
                if (result.error) {
                  this.handleCaptureError(result.error.message);
                  return;
                }

                // Verification has successfully been completed. Get the payment intent ID
                // from the Stripe.js response and re-submit the Commerce.js
                // `checkout.capture()` request with it
                this.props
                  .dispatchCaptureOrder(this.props.checkout.id, {
                    ...newOrder,
                    payment: {
                      ...newOrder.payment,
                      stripe: {
                        payment_intent_id: result.paymentIntent.id,
                      },
                    },
                  })
                  .then(this.handleCaptureSuccess)
                  .catch(this.handleCaptureError);
              });
            });
        })
        .catch(this.handleCaptureError);
    }

    // Capture the order
    this.props
      .dispatchCaptureOrder(this.props.checkout.id, newOrder)
      .then(this.handleCaptureSuccess)
      .catch(this.handleCaptureError);
  }

  /**
   * Fetch all available countries for shipping
   */
  getAllCountries(checkout) {
    commerce.services
      .localeListShippingCountries(checkout.id)
      .then((resp) => {
        this.setState({
          countries: resp.countries,
        });
      })
      .catch((error) => console.log(error));
  }

  toggleNewsletter() {
    this.setState({
      receiveNewsletter: !this.state.receiveNewsletter,
    });
  }

  handleForm = async (e) => {
    // let form = Form.useForm();
    e.preventDefault();
    this.setState({ edit: false });
    const { pincode, city, state, addressLine, type } = this.state;

    if (type !== "work" && !type !== "home") {
      console.log(type);
      this.setState({
        addressList: [...this.state.addressList, { type, pincode, city, state, addressLine }],
      });
    } else {
      this.setState({
        addressList: this.state.addressList.map((el) => {
          if (el.type === type) {
            return { type, pincode, city, state, addressLine };
          }
          return el;
        }),
      });
    }
    this.setState({ selectedAddress: type });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSelectedAddress = (value) => {
    this.setState(value);
  };
  /**
   * Renders payment methods and payment information
   *
   * @returns {JSX.Element}
   */
  renderPaymentDetails() {
    const { checkout, stripe, elements } = this.props;
    const { selectedGateway, cardNumber, expMonth, expYear, cvc } = this.state;

    return (
      <PaymentDetails
        gateways={checkout.gateways}
        onChangeGateway={this.handleGatewayChange}
        selectedGateway={selectedGateway}
        cardNumber={cardNumber}
        expMonth={expMonth}
        expYear={expYear}
        cvc={cvc}
        stripe={stripe}
        elements={elements}
      />
    );
  }

  render() {
    const { Step } = Steps;
    const { TabPane } = Tabs;
    const { Panel } = Collapse;
    const { checkout, shippingOptions } = this.props;
    const otpVerified = this.state.otpVerified;
    const selectedShippingOption = shippingOptions.find(
      ({ id }) => id === this.state["fulfillment[shipping_method]"]
    );
    const steps = [
      {
        title: "Address",
        content: "First-content",
      },
      {
        title: "Shipping",
        content: "Second-content",
      },
      {
        title: "Payment",
        content: "Last-content",
      },
    ];

    if (this.state.loading) {
      return <Loader />;
    }
    const DeliveryCards = styled(Card)`
      border-radius: 12px !important;
      margin-bottom: 4px !important;
      background-color: ${({ selectedDeliverySpeed, value }) =>
        selectedDeliverySpeed === value ? "#EAEAEA" : "#fff"};
      .ant-radio-checked .ant-radio-inner {
        border-color: #000;
      }
      .ant-radio-inner::after {
        background-color: #000;
      }
    `;
    const CustomCheck = styled(Checkbox)`
      .ant-checkbox-checked .ant-checkbox-inner {
        background-color: #000;
        border-color: #000;
      }
      .ant-checkbox-wrapper:hover .ant-checkbox-inner,
      .ant-checkbox:hover .ant-checkbox-inner,
      .ant-checkbox-input:focus + .ant-checkbox-inner {
        border-color: #000;
      }
    `;

    const CustomRadio = styled(Radio)`
      span {
        width: 100%;
      }
      .ant-radio {
        width: 16px;
      }
    `;

    return (
      <Root>
        {/* <div className="row footer">
          <div>
            <Button
              type="primary"
              onClick={() => this.prev()}
              style={{ backgroundColor: "black", borderColor: "black", borderRadius: "5px" }}
              icon={<ArrowLeftOutlined />}
            >
              Previous
            </Button>
          </div>
          <div>
            <Button
              type="primary"
              icon={<Image src={Group} style={{ marginRight: "5px" }} />}
              onClick={() => this.next()}
              className="next"
            >
              Continue
            </Button>
          </div>
        </div> */}
        <Head>{/* <title>Checkout</title> */}</Head>

        {this.state.success ? (
          <div
            className="custom-container py-5 my-4 my-sm-5"
            style={{ backgroundColor: "aliceblue" }}
          >
            {!!this.state.pendingOtp ||
              (!!this.state.otpVerified && (
                <div className="row footer" style={{ padding: "17px", marginTop: 0 }}>
                  <h3 style={{ padding: "5px", fontWeight: "600" }}>Checkout</h3>
                  <div>
                    <Button
                      type="primary"
                      icon={<Image src={Group} style={{ marginRight: "5px" }} />}
                      onClick={() => this.next()}
                      className="next"
                    >
                      {this.state.paymentMethod === "cash" ? "Place order" : "continue"}
                    </Button>
                  </div>
                </div>
              ))}
            {/* Row */}
            <div className="row mt-2" style={{ justifyContent: "space-between" }}>
              <div className="col-12 col-md-10 col-lg-7 offset-md-1 offset-lg-0 column-container">
                {/* Breadcrumbs */}
                <div className="d-flex pb-4 breadcrumb-container">
                  <Link href="/collection">
                    <a className="font-color-dark font-size-caption text-decoration-underline cursor-pointer">
                      Cart
                    </a>
                  </Link>
                  <img src="/icon/arrow-right.svg" className="w-16 mx-1" alt="Arrow icon" />
                  <div className="font-size-caption font-weight-bold cursor-pointer">Checkout</div>
                </div>
                {checkout && otpVerified ? (
                  <form>
                    <p className="font-size-subheader font-weight-semibold mb-4">Customer</p>
                    <div className="row">
                      {/* <div className="col-24 col-sm-6 mb-3"> */}
                      <div className="w-100 stepper">
                        <Steps
                          current={this.state.current}
                          onChange={(current) => this.setState({ current: current })}
                          className="site-navigation-steps"
                          type="navigation"
                        >
                          {steps.map((item) => (
                            <Step key={item.title} title={item.title} />
                          ))}
                        </Steps>
                        {/* <div className="steps-content">{steps[this.state.current].content}</div> */}
                        <div className="steps-action">
                          {this.state.current < steps.length - 1 && this.state.current === 0 && (
                            <>
                              <div className="row">
                                <div
                                  className="col-12  m-3"
                                  style={{ display: "flex", justifyContent: "space-between" }}
                                >
                                  <span> Available Address for this number +918824249504</span>

                                  <span
                                    style={{ float: "right", textDecoration: "underline" }}
                                    onClick={() =>
                                      this.setState({ otpVerified: false, pendingOtp: true })
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    Change Number
                                  </span>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-12  m-3 heading-container">
                                  <p className="font-size-subheader font-weight-semibold mb-4">
                                    Choose Delivery Address
                                  </p>
                                  <div>
                                    {/* <span>
                                    <Button icon={<AppstoreAddOutlined />}>Current Location</Button>
                                  </span> */}
                                    <span style={{ marginLeft: "5px" }}>
                                      {this.state.edit ? (
                                        <Button
                                          // form="address"
                                          icon={<AppstoreAddOutlined />}
                                          // htmlType="submit"
                                          onClick={this.handleForm}
                                        >
                                          save Address
                                        </Button>
                                      ) : (
                                        <Button
                                          icon={<AppstoreAddOutlined />}
                                          onClick={() => this.setState({ edit: true })}
                                        >
                                          Add New Address
                                        </Button>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {!this.state.edit ? (
                                <AddressContent
                                  addressList={this.state.addressList}
                                  selectedAddress={this.handleSelectedAddress}
                                  address={this.state.selectedAddress}
                                  type="shipping"
                                />
                              ) : (
                                <AddressContainer change={this.onChange} state={this.state} />
                              )}
                              <div className="row ">
                                <div className="col-12  m-3 heading-container">
                                  <p className="font-size-subheader font-weight-semibold mb-4">
                                    Billing Address
                                  </p>
                                  <div>
                                    <span>
                                      {!this.state.editShipping ? (
                                        <Button
                                          icon={<AppstoreAddOutlined />}
                                          onClick={() => this.setState({ editShipping: true })}
                                        >
                                          Add More Address
                                        </Button>
                                      ) : (
                                        <Button
                                          icon={<AppstoreAddOutlined />}
                                          onClick={() => this.setState({ editShipping: false })}
                                        >
                                          Save Billing Address
                                        </Button>
                                      )}
                                    </span>
                                  </div>
                                </div>
                                {!this.state.editShipping ? (
                                  <div className="col-12  m-3 ">
                                    <div>
                                      <CustomCheck
                                        checked={this.state.billingAddress.length ? false : true}
                                      >
                                        Same as shipping address
                                      </CustomCheck>
                                      <div style={{ marginTop: "20px" }}>
                                        <AddressContent
                                          addressList={this.state.shippingAddressList}
                                          selectedAddress={this.handleSelectedAddress}
                                          address={this.state.billingAddress}
                                          type="billing"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <AddressContainer />
                                )}
                              </div>
                              {/* <div className="row main" style={{ marginTop: "85px" }}>
                              <div className="col-12  m-3 ">
                                <Checkbox>Remember my information on this device</Checkbox>
                              </div>
                            </div> */}
                            </>
                          )}
                          {this.state.current < steps.length - 1 && this.state.current === 1 && (
                            <>
                              <div className="row">
                                <div className="col-12  m-3">
                                  <p className="font-size-subheader font-weight-semibold ">
                                    Delivery Address
                                  </p>
                                  <p
                                    className="font-size-caption"
                                    style={{ opacity: "60%", maxWidth: "200px" }}
                                  >
                                    Under Secretary (Funds), PMO, South Block, New Delhi, Pin
                                    -110011
                                  </p>
                                  <p className="font-size-paragraph">(Home)</p>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-12  m-3">
                                  <p
                                    className="font-size-subheader"
                                    style={{ display: "flex", alignItems: "center" }}
                                  >
                                    <div
                                      style={{ width: "19px", height: "22px", marginRight: "5px" }}
                                    >
                                      <Image src={discount} />
                                    </div>
                                    <span> Available Offers</span>
                                  </p>
                                  <p className="font-size-caption" style={{ opacity: "60%" }}>
                                    10% cashback on above order of 100 valid only on amazon pay
                                  </p>
                                  <p
                                    className="font-size-paragraph"
                                    style={{ textDecoration: "underline" }}
                                  >
                                    <Collapse
                                      // activeKey={this.state.showOffers}
                                      className="collapse-container"
                                      accordion
                                    >
                                      <Panel header="Availabe Offers" key="cash">
                                        <div
                                          style={{
                                            // marginLeft: "24px",
                                            lineHeight: "2.1",
                                            fontWeight: "normal",
                                          }}
                                        >
                                          <ul style={{ lineHeight: "39px", fontSize: " 13px" }}>
                                            <li>
                                              10% cashback on order above 100 vaild only for amazon
                                              pay
                                            </li>
                                            <li>
                                              10% cashback on order above 100 vaild only for amazon
                                              pay
                                            </li>
                                            <li>
                                              10% cashback on order above 100 vaild only for amazon
                                              pay
                                            </li>
                                          </ul>
                                        </div>
                                      </Panel>
                                    </Collapse>
                                  </p>
                                </div>
                              </div>
                              <div className="row" style={{ minHeight: "344px" }}>
                                <div className="col-12  m-3">
                                  <p className="font-size-subheader font-weight-semibold ">
                                    Choose Delivery Speed
                                  </p>
                                  <Radio.Group
                                    onChange={(e) =>
                                      this.setState({ selectedDeliverySpeed: e.target.value })
                                    }
                                    defaultValue={this.state.selectedDeliverySpeed}
                                    style={{ width: "100%" }}
                                  >
                                    <DeliveryCards
                                      selectedDeliverySpeed={this.state.selectedDeliverySpeed}
                                      value="express"
                                    >
                                      <CustomRadio value="express" style={{ width: "100%" }}>
                                        <div style={{ display: "flex" }}>
                                          <div style={{ display: "block" }}>
                                            <p className="font-size-subheader font-weight-semibold ">
                                              Express Delivery
                                            </p>
                                            <p className="font-size-caption">
                                              Place order before 5pm and get it in 24 - 48 hr
                                            </p>
                                          </div>
                                        </div>
                                        <p className="font-size-caption" style={{ float: "right" }}>
                                          shipping price ₹ 80.00
                                        </p>
                                      </CustomRadio>
                                    </DeliveryCards>
                                    <DeliveryCards
                                      selectedDeliverySpeed={this.state.selectedDeliverySpeed}
                                      value="no-rush"
                                    >
                                      {" "}
                                      <CustomRadio value="no-rush" style={{ width: "100%" }}>
                                        <div style={{ display: "flex" }}>
                                          <div style={{ display: "block" }}>
                                            <p className="font-size-subheader font-weight-semibold ">
                                              No rush
                                            </p>
                                            <p className="font-size-caption">
                                              Place order before 5pm and get it in 24 - 48 hr
                                            </p>
                                          </div>
                                        </div>
                                        <p className="font-size-caption" style={{ float: "right" }}>
                                          shipping price ₹ 80.00
                                        </p>
                                      </CustomRadio>
                                    </DeliveryCards>
                                    {/* <DeliveryCards
                                      selectedDeliverySpeed={this.state.selectedDeliverySpeed}
                                      value="no-rush"
                                    >
                                      <CustomRadio value="no-rush" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex' }}>
                                          <div style={{ display: 'block' }}>
                                            <p className="font-size-subheader font-weight-semibold ">
                                              Express Delivery
                                            </p>
                                            <p className="font-size-caption">
                                              Place order before 5pm and get it in 24 - 48 hr
                                            </p>
                                          </div>
                                        </div>
                                        <p className="font-size-caption" style={{ float: 'right' }}>
                                          shipping price ₹ 80.00
                                        </p>
                                      </CustomRadio>
                                    </DeliveryCards> */}
                                  </Radio.Group>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-12  m-3">
                                  <p className="font-size-subheader font-weight-semibold ">
                                    Choose Payment Mode
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Radio.Group
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                      // value="prepaid"
                                      className="radio-wrapper"
                                      onChange={(e) =>
                                        this.setState({ paymentMethod: e.target.value })
                                      }
                                      value={this.state.paymentMethod}
                                    >
                                      <Radio value="prepaid">Prepaid</Radio>
                                      <Radio value="cash">
                                        <Collapse
                                          activeKey={this.state.paymentMethod}
                                          className="collapse-container"
                                        >
                                          <Panel header="Cash" key="cash">
                                            <div
                                              style={{
                                                // marginLeft: "24px",
                                                lineHeight: "2.1",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              <p>
                                                We urge you to pay online and enable smooth and
                                                no-contct with social distancing, kindly select
                                                online payments if you are able to pay online.
                                              </p>
                                              <ul style={{ lineHeight: "39px", fontSize: " 13px" }}>
                                                <li>Pay Online and get priority shipping.</li>
                                                <li>
                                                  COD charges (charge by the courier service)inr 75.
                                                </li>
                                                <li>COD on all orders above INR 1500/- inr 75.</li>
                                              </ul>
                                            </div>
                                          </Panel>
                                        </Collapse>
                                      </Radio>
                                    </Radio.Group>
                                    <Progress
                                      style={{ marginRight: "31px" }}
                                      type="circle"
                                      strokeColor={
                                        this.state.paymentMethod === "prepaid"
                                          ? "#00BF1F"
                                          : "#F0BB00"
                                      }
                                      percent={this.state.paymentMethod === "prepaid" ? 68 : 32}
                                      format={(percent) => (
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            color:
                                              this.state.paymentMethod === "prepaid"
                                                ? "#00BF1F"
                                                : "#F0BB00",
                                          }}
                                        >
                                          <span style={{ fontSize: "34px" }}>{percent}% </span>
                                          <span style={{ fontSize: "11px" }}>
                                            {this.state.paymentMethod === "prepaid"
                                              ? "prepaid"
                                              : "cod"}{" "}
                                            users
                                          </span>
                                        </div>
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          {this.state.current === 2 && (
                            <>
                              <Payment />
                            </>
                          )}
                          {/* {this.state.current === steps.length - 1 && (
                          <Button
                            type="primary"
                            onClick={() => message.success("Processing complete!")}
                          >
                            Done
                          </Button>
                        )}
                        {this.state.current > 0 && (
                          <Button style={{ margin: "0 8px" }} onClick={() => this.prev()}>
                            Previous
                          </Button>
                        )} */}
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                  </form>
                ) : this.state.pendingOtp ? (
                  <OtpVerification handleSelectedAddress={this.handleSelectedAddress} />
                ) : (
                  <GeneratedOtp handleSelectedAddress={this.handleSelectedAddress} />
                )}
              </div>

              <div className="col-12 col-lg-5 col-md-10  mt-4 mt-lg-0">
                <div
                  className="bg-brand200 p-lg-5 p-3 checkout-summary"
                  style={{ borderRadius: "12px" }}
                >
                  <div className="borderbottom font-size-subheader border-color-gray400 pb-2 font-weight-medium">
                    Your order
                  </div>
                  <div className="pt-3 pb-3 borderbottom border-color-gray400">
                    {(checkout.live ? checkout.live.line_items : []).map((item, index, items) => {
                      let quantity = item.quantity;
                      return (
                        <div key={item.id} className="d-flex mb-2">
                          {item && item.media && (
                            <img
                              className="checkout__line-item-image mr-2"
                              src={item.media.source}
                              alt={item.product_name}
                              style={{ borderRadius: "10px" }}
                            />
                          )}
                          <div className="d-flex flex-grow-1" style={{ position: "relative" }}>
                            <div className="flex-grow-1">
                              <p className="font-weight-medium">{item.product_name}</p>
                              <p className="font-color-light">Quantity: {quantity}</p>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  position: "absolute",
                                  width: "100%",
                                }}
                              >
                                <div
                                  className="d-flex align-items-center"
                                  style={{
                                    border: "2px solid #DFE0EB",
                                    width: "84px",
                                    borderRadius: " 8px",
                                    height: "28px",
                                  }}
                                >
                                  <p
                                    className="text-center px-3"
                                    style={{ fontWeight: "600", paddingRight: "0.8rem" }}
                                  >
                                    {quantity}
                                  </p>
                                  <button
                                    className="p-0 bg-transparent quantity"
                                    onClick={() => (quantity = quantity - 1)}
                                    style={{ borderRight: " 2px solid #C5CDE3" }}
                                  >
                                    <img
                                      src="/icon/minus.svg"
                                      className="w-16"
                                      title="Minus icon"
                                      alt=""
                                    />
                                  </button>
                                  <button
                                    className="p-0 bg-transparent quantity"
                                    onClick={() => (quantity = quantity + 1)}
                                  >
                                    <img
                                      src="/icon/plus.svg"
                                      className="w-16"
                                      title="Plus icon"
                                      alt=""
                                      style={{ marginLeft: "3px" }}
                                    />
                                  </button>
                                </div>
                                <div>
                                  <Image src={deleteIcon} />
                                </div>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                {item.selected_options.map((option) => (
                                  <p
                                    key={option.group_id}
                                    className="font-color-light font-weight-small"
                                  >
                                    {option.group_name}: {option.option_name}
                                  </p>
                                ))}
                              </div>
                            </div>
                            <div className="text-right font-weight-semibold">
                              ${item.line_total.formatted_with_code}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="row py-3 borderbottom border-color-gray400">
                    <input
                      name="discountCode"
                      onChange={this.handleChangeForm}
                      value={this.state.discountCode}
                      placeholder="Gift card or discount code"
                      className="mr-2 col"
                      style={{ borderRadius: "8px" }}
                    />
                    <button
                      className="font-color-white border-none font-weight-medium px-4 col-auto"
                      disabled={!this.props.checkout || undefined}
                      onClick={this.handleDiscountChange}
                      style={{ borderRadius: "8px" }}
                    >
                      Apply
                    </button>
                  </div>
                  <div className="py-3 borderbottom border-color-black">
                    {[
                      {
                        name: "Subtotal",
                        amount: checkout.live ? checkout.live.subtotal.formatted_with_symbol : "",
                      },
                      {
                        name: "Tax",
                        amount: checkout.live ? checkout.live.tax.amount.formatted_with_symbol : "",
                      },
                      {
                        name: "Shipping",
                        amount: selectedShippingOption
                          ? `${selectedShippingOption.description} - ${selectedShippingOption.price.formatted_with_symbol}`
                          : "No shipping method selected",
                      },
                      {
                        name: "Discount",
                        amount:
                          checkout.live && checkout.live.discount && checkout.live.discount.code
                            ? `Saved ${checkout.live.discount.amount_saved.formatted_with_symbol}`
                            : "No discount code applied",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <p>{item.name}</p>
                        <p className="text-right font-weight-medium">{item.amount}</p>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2 pt-3">
                    <p className="font-size-title font-weight-semibold">Total amount</p>
                    <p className="text-right font-weight-semibold font-size-title">
                      $ {checkout.live ? checkout.live.total.formatted_with_code : ""}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginTop: "60px",
                      fontSize: "12px",
                    }}
                  >
                    <div style={{ height: "65px", width: "60px" }}>
                      <Image src={pickrrLogo} />
                    </div>
                    <p style={{ fontWeight: 600 }}>Pickrr Powered checkout</p>
                  </div>
                </div>
              </div>
            </div>
            {!!this.state.pendingOtp ||
              (!!this.state.otpVerified && (
                <div className="row footer">
                  <div>
                    <Button
                      type="primary"
                      onClick={() => this.prev()}
                      style={{
                        color: "black",
                        borderColor: "white",
                        borderRadius: "5px",
                        backgroundColor: "white",
                        boxShadow: "none",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                      icon={<ArrowLeftOutlined />}
                    >
                      Previous
                    </Button>
                  </div>
                  <div>
                    <Button
                      type="primary"
                      icon={<Image src={Group} style={{ marginRight: "5px" }} />}
                      onClick={() => this.next()}
                      className="next"
                    >
                      {this.state.paymentMethod === "cash" ? "Place order" : "continue"}
                      {/* Continue */}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <Success />
        )}
      </Root>
    );
  }
}

CheckoutPage.propTypes = {
  orderReceipt: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
  checkout: PropTypes.object,
  cart: PropTypes.object,
  shippingOptions: PropTypes.array,
  dispatchGenerateCheckout: PropTypes.func,
  dispatchGetShippingOptions: PropTypes.func,
  dispatchSetDiscountCodeInCheckout: PropTypes.func,
};

// If using Stripe, this provides context to the page so we can use `stripe` and
// `elements` as props.
const InjectedCheckoutPage = (passProps) => {
  return (
    <Elements stripe={passProps.stripe}>
      <ElementsConsumer>
        {({ elements, stripe }) => (
          <CheckoutPage {...passProps} stripe={stripe} elements={elements} />
        )}
      </ElementsConsumer>
    </Elements>
  );
};

export default withRouter(
  connect(
    ({ checkout: { checkoutTokenObject, shippingOptions }, cart, customer, orderReceipt }) => ({
      checkout: checkoutTokenObject,
      customer,
      shippingOptions,
      cart,
      orderReceipt,
    }),
    {
      dispatchGenerateCheckout,
      dispatchGetShippingOptions,
      dispatchSetShippingOptionsInCheckout,
      dispatchSetDiscountCodeInCheckout,
      dispatchCaptureOrder,
    }
  )(InjectedCheckoutPage)
);
