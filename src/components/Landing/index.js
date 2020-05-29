import React from 'react';
 

const Landing = () => (
  <div>
    <Landing1/>
    <br clear="all" />
    <br clear="all" />
    <Landing2/>
  </div>
)
const Landing1 = () => (
<div>
  <h1 style={{ textAlign: 'center',fontFamily:'Bookman',margin:'25px'}}>Welcome to WelfareBoss!</h1>
    <div style={{width: "600px", float:"left", height:"300px", margin:"0px"}}>
      <h2 style={{textAlign:'left', color: 'black', margin:'50px', fontSize: '20px',fontFamily:'Bookman'}}>
        <p style={{ textDecoration: 'underline'}}>Why did we start this project? </p>
        <p>Exam Welfare Pack is a culture in many Universities. However, despite being an event that is supposed to provide welfare, it is often such a tedious process. </p>
        <p>The slow collection process with all the checking of matriculation card numbers and survey completion must have taken away more time from you aside from packing the welfare packs. </p>
        <p>WelfareBoss focuses on making the collection process fast and easy for everyone!</p>
      </h2>
    </div>

    <div style={{width:"650px", float:"left", height:"400px", margin:"0px"}}>
      <img src = "https://www.afgonline.com.au/wp-content/uploads/bfi_thumb/hipster-man-turning-opening-sign-on-door-coffee-shop-517678150_8660x5773-330bp8sf0h7ohrpif7gt6hylgssl50a537xoemampwvr0r3jk.jpg" width='650px' height ='400px'></img>
    </div>
</div>
);

const Landing2 = () => (
  <div>
    <div style={{width:"500px", float:"left", height:"100px", margin:"5px"}}>
        <img src = "https://esabook.files.wordpress.com/2018/08/telegram-bots-father.png" width='600px' height ='400px'></img>
    </div>
    <div style={{width: "700px", float:"right", height:"500px", margin:"15px"}}>
      <h2 style={{color: 'black', margin:'0px', fontSize: '20px',fontFamily:'Bookman'}}>
        <p style={{textDecoration: 'underline'}}>Our Services </p>
        <ul>
          <li>Receive students' matriculation card number and picture proof of survey completion on this website</li>
          <li>Monitor queue</li>
        </ul>
        <p>Say no more to impatient crowds and repeatedly asking for matric cards and proof of survey completion!</p>
      </h2>
    </div>
  </div>
  );

export default Landing;
