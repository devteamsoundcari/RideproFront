import React from "react";
import { Redirect } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Redirect from="/" to="/login" />
      <p>Home</p>
    </div>
  );
};

export default Home;
