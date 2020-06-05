import React from "react";

const Landing = () => (
  <div>
    <Landing1 />
    <br clear="all" />
    <br clear="all" />
    <Landing2 />
    <br clear="all" />
    <br clear="all" />
    <br clear="all" />
    <Landing3 />
  </div>
);
const Landing1 = () => (
  <div>
    <h1 style={{ textAlign: "center", fontFamily: "Bookman", margin: "25px" }}>
      Welcome to WelfareBoss!
    </h1>
    <div
      style={{ width: "600px", float: "left", height: "300px", margin: "0px" }}
    >
      <h2
        style={{
          textAlign: "left",
          color: "black",
          margin: "50px",
          fontSize: "20px",
          fontFamily: "Bookman",
        }}
      >
        <p style={{ textDecoration: "underline" }}>
          Why did we start this project?{" "}
        </p>
        <p>
          Exam Welfare Pack is a culture in many Universities. However, despite
          being an event that is supposed to provide welfare, it is often such a
          tedious process. 
        </p>
        <p>
          The slow collection process with all the checking of matriculation
          card numbers and survey completion must have taken away more time from
          you aside from packing the welfare packs. 
        </p>
        <p>
          WelfareBoss focuses on making the collection process fast and easy for
          everyone!
        </p>
      </h2>
    </div>

    <div
      style={{ width: "650px", float: "left", height: "400px", margin: "0px" }}
    >
      <img
        alt=""
        src="https://www.afgonline.com.au/wp-content/uploads/bfi_thumb/hipster-man-turning-opening-sign-on-door-coffee-shop-517678150_8660x5773-330bp8sf0h7ohrpif7gt6hylgssl50a537xoemampwvr0r3jk.jpg"
        width="650px"
        height="400px"
      ></img>
    </div>
  </div>
);

const Landing2 = () => (
  <div>
    <div
      style={{
        width: "500px",
        float: "left",
        height: "200px",
        margin: "5px",
        textAlign: "right",
      }}
    >
      <img
        alt=""
        src="https://robbeekmans.net/wp-content/uploads/2018/12/digital-nomad-millenial-woman-working-remotely-from-cafe_free_stock_photos_picjumbo_HNCK3157-2210x1474.jpg"
        width="450px"
        height="250px"
      ></img>
    </div>

    <div
      style={{
        width: "700px",
        float: "right",
        height: "200px",
        margin: "20px",
      }}
    >
      <h2
        style={{
          color: "black",
          margin: "0px",
          fontSize: "20px",
          fontFamily: "Bookman",
        }}
      >
        <p style={{ textDecoration: "underline" }}>Our Services </p>
        <ul>
          <li>
            Receive students' matriculation card number and picture proof of
            survey completion on this website
          </li>
          <li>Monitor queue</li>
        </ul>
        <p>
          Say no more to impatient crowds and repeatedly asking for matric cards
          and proof of survey completion!
        </p>
      </h2>
    </div>
  </div>
);

const Landing3 = () => (
  <div>
    <div
      style={{ width: "600px", float: "left", height: "250px", margin: "0px" }}
    >
      <h2
        style={{
          textAlign: "right",
          color: "black",
          margin: "20px",
          fontSize: "20px",
          fontFamily: "Bookman",
        }}
      >
        <p style={{ textDecoration: "underline" }}>Contact Us on Telegram</p>
        <p style={{ fontStyle: "italic" }}>Lim Jia Yi: @jiayi_i </p>
        <p style={{ fontStyle: "italic" }}>Wiline Tan: @wiline </p>
      </h2>
    </div>

    <div
      style={{ width: "400px", float: "left", height: "400px", margin: "0px" }}
    >
      <img
        alt=""
        src="https://lh3.googleusercontent.com/c9MIYFDcJCmHanj5v4w4q8ROtl8E2ebitOB3Xx-vuNqWkbS5ct7-8AdneiTB3zxFYlUuhfm872B7mVh2oZ2LsPtk1TH5OufedY3adOTEACVFwqdqA51I5Yb-v0FJt9e9QSAfPIIk9Q=w2400"
        width="380px"
        height="240px"
      ></img>
    </div>
  </div>
);

export default Landing;
