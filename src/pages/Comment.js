import React from "react";
// import axiosInstance from "axios";
import { axiosInstance, config } from "../config";
import "../shared/App.css";

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problem_id: this.props.match.params.id,
      comments: []
    };
  }
  componentDidMount() {
    // console.log(this.props);
    // let temp;
    axiosInstance
      .get(`/comment/${this.state.problem_id}`, config)
      .then(res => {
        // console.log("응답 response값:" + res.data);
        this.setState({ comments: JSON.parse(res.data) });
      })
      .catch(err => console.log(err));
  }
  render() {
    const { comments } = this.state;
    // console.log(comments);
    if (comments) {
      const list = comments.map((data, i) => (
        <div key={i} className="nes-container is-rounded">
          <div>
            <span style={{ fontStyle: "Italic", color: "blue" }}>
              {!data.nick ? "익명의 더쿠" : data.nick}
            </span>
            님의 의견:
            <div style={{ fontSize: "20px" }}>{data.comment}</div>
          </div>
          날짜:{data.day}
        </div>
      ));
      return <div>의견 모음{list}</div>;
    } else {
      return <div>아직 해당문제에 대한 의견이 없습니다.</div>;
    }
  }
}