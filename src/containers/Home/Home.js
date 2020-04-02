import React from "react";
import { Link, Redirect } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Redirect from="/" to="/login" />
      <p>Home</p>
      <Link to="/login">login</Link>
    </div>
  );
};

export default Home;
