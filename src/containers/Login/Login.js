import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { useHistory } from "react-router-dom";
import "./Login.scss";
import logo from "../../assets/img/logo.png";
import { Button } from "react-bootstrap";
import axios from "axios";

const Login = () => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({
    isSignedIn: false,
    userName: "",
    email: "",
    imageUrl: ""
  });

  const responseGoogle = res => {
    console.log("daaaaaa res", res.profileObj);
    axios({
      method: "POST",
      url: "http://localhost:3002/send",
      data: res.profileObj
    }).then(response => {
      if (response.data.status === "success") {
        alert("Message Sent.");
      } else if (response.data.status === "fail") {
        alert("Message failed to send.");
      }
    });

    if (res.profileObj.name) {
      let newState = {
        isSignedIn: true,
        userName: res.profileObj.name,
        email: res.profileObj.email,
        imageUrl: res.profileObj.imageUrl
      };
      setUserInfo(newState);
    }
  };

  useEffect(() => {
    if (userInfo.isSignedIn) {
      history.push({
        pathname: "/cliente",
        state: { userInfo }
      });
    }
  }, [userInfo, history]);

  return (
    <div className="login">
      <form className="form-signin text-center">
        <div className="text-center mb-4">
          <img className="mb-4" src={logo} alt="" />
          <h1 className="h3 mb-3 font-weight-normal">Iniciar Sesion</h1>
          <p>
            Por el momento la unica de manera de logearse es con tu cuenta de
            Gmail. Tu cuenta sera validada por el administrador, quien te
            asignara un tipo de perfil.{" "}
            <a href="#test">Problemas para iniciar sesion?</a>
          </p>
        </div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          render={renderProps => (
            <React.Fragment>
              <Button
                variant="primary"
                // className="ml-5"
                id="signInBtn"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Iniciar Sesion
              </Button>
            </React.Fragment>
          )}
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          isSignedIn={true}
          cookiePolicy={"single_host_origin"}
        />
        <p className="mt-5 mb-3 text-muted text-center">&copy; 2020-2022</p>
      </form>
    </div>
  );
};

export default Login;
