import React, { Component } from "react";
import { config, axiosInstance } from "../config";
import { GoogleLogin } from "react-google-login";
import Img from "react-image";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";

class Linked extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      representImg: null
    };
  }
  componentDidMount = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/problem/${this.props.location.problemId}`,
        config
      );
      const { title, representImg } = data;
      this.setState(() => ({
        title,
        representImg
      }));
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return this.state.title && this.state.representImg ? (
      <React.Fragment className="max-width">
        <Img src={this.state.representImg} width={300} height={300} />
        <div>{this.state.title}</div>
        <Login
          setUserInfo={this.props.location.setUserInfo}
          problemId={this.props.location.problemId}
          history={this.props.history}
        />
      </React.Fragment>
    ) : null;
  }
}

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
          this.props.history.push(`/SolvingProblem/${this.props.problemId}`);
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
    console.log("히스토리", this.props);
    return (
      <div className="Login-page">
        <GoogleLogin
          clientId={process.env.REACT_APP_Google}
          buttonText="문제풀러가기"
          onSuccess={this.responseGoogle}
          onFailure={this.responseFail}
        />
      </div>
    );
  }
}

export default Linked;
