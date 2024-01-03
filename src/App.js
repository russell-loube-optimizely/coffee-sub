import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import FogLightNavbar from "./components/FogLightNavbar.js";
import ImageCard from "./components/ImageCard.js";
import Type from "./components/Type.js";
import AddToCartButton from "./components/AddToCartButton.js";
import DeliveryFrequency from "./components/DeliveryFrequency.js";
import Grind from "./components/Grind.js";

import React, { useState } from "react";
import datafile from "./datafile.json";

function App() {
  const [addedToCart, setAddedToCart] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [title, setTitle] = useState();
  const [cta, setCta] = useState();
  const [grindValue, setGrindValue] = useState("1");
  const [typeValue, setTypeValue] = useState("1");
  const [decideCalled, setDecideCalled] = useState(false);
  const [optimizelyReady, setOptimizelyReady] = useState(false);

  const optimizely = require("@optimizely/optimizely-sdk");
  const { createInstance, enums } = require("@optimizely/optimizely-sdk");
  const optimizelyClient = optimizely.createInstance({
    sdkKey: "B3sNMM9RTdM6X7b6kMW4r",
    logLevel: "info",
    datafileOptions: {
      updateInterval: 1,
    },
  });

  ///////////////////////////////////////////
  // SET UP DECISION NOTIFICATION LISTENER //
  ///////////////////////////////////////////
  const onDecision = ({ type, userId, attributes, decisionInfo }) => {
    // Add a DECISION Notification Listener for type FLAG
    if (type === "flag") {
      // Access information about feature, for example, key and enabled status
      console.log("decision notification listener fired");
      console.log("decisionInfo:", decisionInfo);
      console.log(decisionInfo["flagKey"]);
      console.log(decisionInfo["enabled"]);
      console.log(decisionInfo["decisionEventDispatched"]);
      // Send data to analytics provider here
    }
  };

  const notificationId =
    optimizelyClient.notificationCenter.addNotificationListener(
      enums.NOTIFICATION_TYPES.DECISION,
      onDecision
    );

  optimizelyClient.onReady().then(async () => {
    const attributes = { hasPurchased: true, mobileDevice: true };

    const user = optimizelyClient.createUserContext("user123", attributes);

    /* -------------------------------------------------------------------------- */
    /*                                 ODP Methods                                */
    /* -------------------------------------------------------------------------- */

    /* ------------------------ Fetch Qualified Segments ------------------------ */
    // const odpSegments = await user
    //   .fetchQualifiedSegments
    //   // "OptimizelySegmentOption.IGNORE_CACHE",
    //   // "OptimizelySegmentOption.RESET_CACHE"
    //   ();
    // console.log("Qualified segments", user.qualifiedSegments);

    const decision = user.decide("product_detail_page");
    console.log("Opti variables:", decision.variables);
    const title = decision.variables.title;
    setTitle(title);
    const cta = decision.variables.cta;
    setCta(cta);

    setDecideCalled(true);
    setOptimizelyReady(true);

    // if (!decideCalled) {
    //   const grindValue = decision.variables.grindValue;
    //   setGrindValue(grindValue);
    //   const typeValue = decision.variables.typeValue;
    //   setTypeValue(typeValue);
    // }
  });

  const identifiers = new Map([
    ["fs_user_id", "russ0828-05"],
    ["email", "russ0828-05@optimizely.com"],
  ]);

  const handleSignInClick = () => {
    if (!optimizelyReady) {
      return;
    }
    const updatedSignedIn = !signedIn;
    setSignedIn(updatedSignedIn);
  };

  /* ----------------------------- Send ODP Event ----------------------------- */
  const handleCartClick = () => {
    // optimizelyClient.sendOdpEvent("has_purchased");

    console.log("cart button clicked");
    const updatedAddedToCart = !addedToCart;
    setAddedToCart(updatedAddedToCart);
  };

  const handleDropDownChange = (eventKey) => {
    console.log("Selected eventKey:", eventKey);
    setGrindValue(eventKey);
  };

  const handleToggleButtonChange = (value) => {
    setTypeValue(value);
  };

  const frequencies = [
    { name: "Weekly ($18.00/delivery)", value: "1" },
    { name: "Bi-Weekly ($18.00/delivery)", value: "2" },
    { name: "Monthly ($18.00/delivery)", value: "3" },
  ];

  const type = [
    { name: "Roaster's Choice", value: "1" },
    { name: "Seasonal Espresso", value: "2" },
    { name: "House Blend", value: "3" },
  ];

  const grind = [
    { name: "Whole Bean", value: "1" },
    { name: "French Press", value: "2" },
    { name: "Chemex", value: "3" },
    { name: "Automatic Drip", value: "4" },
    { name: "Pour Over Cone", value: "5" },
    { name: "Espresso", value: "6" },
  ];

  return (
    <div className="container">
      <FogLightNavbar
        signedIn={signedIn}
        handleSignInClick={handleSignInClick}
      />
      <br />
      <Row>
        <ImageCard />
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">$18.00</Card.Subtitle>
              <br />
              <Grind
                grindValue={grindValue}
                grind={grind}
                handleDropDownChange={handleDropDownChange}
              />
              <br />
              <Type
                type={type}
                defaultTypeValue={typeValue}
                handleToggleButtonChange={handleDropDownChange}
              />
              <br />
              <br />
              <Card.Text>Delivery Frequency</Card.Text>
              <DeliveryFrequency frequencies={frequencies} />
              <br />
              <AddToCartButton
                text={cta}
                addedToCart={addedToCart}
                handleClick={handleCartClick}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default App;
