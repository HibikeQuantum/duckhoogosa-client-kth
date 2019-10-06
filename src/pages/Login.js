import React from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";
import { config, axiosInstance } from "../config";
import FadeIn from "react-fade-in";
import styled from "styled-components";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: undefined
    };
  }

  componentDidMount() {}

  responseGoogle = async res => {
    let data = {
      email: res.profileObj.email,
      expires_at: res.tokenObj.expires_at + res.tokenObj.expires_in
    };
    this.props.setUserInfo(data);
    await localStorage.setItem("authData", JSON.stringify(res));
    const config = {
      headers: {
        access_token: localStorage["authData"]
          ? JSON.parse(localStorage["authData"]).Zi.access_token
          : null,
        "Access-Control-Allow-Origin": "*"
      },
      withCredentials: true
    };

    axiosInstance
      .post("/login", {}, config)
      .then(res => {
        console.log(res, "요청결과 확인");
        if (res.data.result) {
          this.props.history.push("/main");
        } else {
          console.log(res.data.reason);
          this.props.history.push("/login");
        }
      })
      .catch(err => {
        console.log(err, "ERROR in login SEQ");
      });
  };
  responseFail = err => {
    console.log(err);
  };

  logout = () => {
    axiosInstance
      .post("/logout", {}, config)
      .then(res => {
        if (res.data.result) {
          console.log(res.data.result);
        } else {
          console.log(res.data.reason);
        }
      })
      .catch(err => {
        console.log(err, "ERROR in logout SEQ");
      });
    console.log("로그아웃");
    this.props.emptyEmail();
    localStorage.removeItem("authData");
  };

  render() {
    const BottomTextBox = styled.div`
      height: 10em;
    `;
    return (
      <div className="pageCSS container center-parent max-width">
        <div className="center-flex">
          <h1 id="about">
            <i className="snes-jp-logo brand-logo" />
            <p>로그인</p>
            <a href="#about" />
          </h1>
        </div>
        <div className="button-box">
          <GoogleLogin
            clientId={process.env.REACT_APP_Google}
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.responseFail}
          />
          <span>{"  "}</span>
          <GoogleLogout
            clientId={process.env.REACT_APP_Google}
            buttonText="Logout"
            onLogoutSuccess={this.logout}
          />
        </div>
        <BottomTextBox>
          <span>{"  "}</span>
        </BottomTextBox>
      </div>
    );
  }
}

export default Login;
