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

const App = () => {
  const { v4: uuidv4 } = require("uuid");

  const [addedToCart, setAddedToCart] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [title, setTitle] = useState();
  const [cta, setCta] = useState();
  const [grindValue, setGrindValue] = useState("1");
  const [typeValue, setTypeValue] = useState("1");
  const [deliveryFrequency, setDeliveryFrequency] = useState("1");
  const [vuid, setVuid] = useState(null);
  const [authId, setAuthId] = useState(null);

  const optimizely = require("@optimizely/optimizely-sdk");
  const { createInstance, enums } = require("@optimizely/optimizely-sdk");

  const optimizelyClient = optimizely.createInstance({
    sdkKey: "B3sNMM9RTdM6X7b6kMW4r",
    logLevel: "debug",
    datafileOptions: {
      updateInterval: 1000,
    },
    odpOptions: {},
  });

  /* ------------------------------ User Context ------------------------------ */

  const attributes = {
    // hasPurchased: true,
    mobileDevice: false,
  };

  const getUserContext = async (userContextId) => {
    const user = await optimizelyClient.createUserContext(
      userContextId,
      attributes
    );
    return user;
  };

  let user;

  /* -------------------- Optimizely Client Initialization -------------------- */

  optimizelyClient.onReady().then(async () => {
    const userId = "user123";
    setAuthId(userId);
    user = await getUserContext();
    const vuid = window.localStorage.getItem("optimizely-vuid");
    setVuid(vuid);

    /* ------------------------ Fetch Qualified Segments ------------------------ */

    const odpSegments = await user.fetchQualifiedSegments(
      "OptimizelySegmentOption.IGNORE_CACHE",
      "OptimizelySegmentOption.RESET_CACHE"
    );
    console.log("Qualified segments", user.qualifiedSegments);

    const decision = user.decide("product_detail_page");
    console.log("Opti decision:", decision);
    console.log("Opti variables:", decision.variables);
    const title = decision.variables.title;
    setTitle(title);
    const cta = decision.variables.cta;
    setCta(cta);
    const deliveryFrequency = decision.variables.deliveryFrequency;
    setDeliveryFrequency(deliveryFrequency);
  });

  const identifiers = new Map([
    ["fs_user_id", "russ0828-05"],
    ["email", "russ0828-05@optimizely.com"],
  ]);

  const handleSignInClick = () => {
    const updatedSignedIn = !signedIn;
    setSignedIn(updatedSignedIn);
    optimizelyClient.sendOdpEvent(identifiers);
  };

  const handleCartClick = async () => {
    optimizelyClient.sendOdpEvent("has_purchased");
    await user.trackEvent("addToCart");
    console.log("cart button clicked");
    const updatedAddedToCart = !addedToCart;
    setAddedToCart(updatedAddedToCart);
  };

  const handleDropDownChange = (eventKey) => {
    console.log("Selected eventKey:", eventKey);
    setGrindValue(eventKey);
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
        <ImageCard vuid={vuid} authId={authId} />
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
              <DeliveryFrequency
                frequencies={frequencies}
                defaultFrequency={"1"}
              />
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
};

export default App;
