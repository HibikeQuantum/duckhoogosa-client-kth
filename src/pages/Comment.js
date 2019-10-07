import React from "react";
//import { formatRelative } from "date-fns";
import { axiosInstance, config } from "../config";
import "../shared/App.css";
import cats100 from "../client/img/pixel-icon-creator-24.jpg";
export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentBtn: false,
      inputComment: "",
      problem_id: this.props.match.params.id,
      email: this.props.history.location.state.email,
      comments: []
    };
  }
  componentDidMount() {
    //console.log(this.props);
    axiosInstance
      .get(`/comment/${this.state.problem_id}`, config)
      .then(res => {
        this.setState({ comments: JSON.parse(res.data) });
      })
      .catch(err => console.log(err));
  }
  inputCommentHandle(e) {
    this.setState({ inputComment: e.target.value });
  }
  commentBtnHandle() {
    this.setState({ commentBtn: !this.state.commentBtn });
  }
  submitComment = async() => {
    axiosInstance
      .post(
        "/problem/evaluation",
        {
          problem_id: this.state.problem_id,
          email: this.state.email,
          evalQ: null,
          evalD: null,
          comment: this.state.inputComment
        },
        config
      )
      .then(res => console.log(res))
      .catch(err => console.log(err));
    await axiosInstance
      .get(`/comment/${this.state.problem_id}`, config)
      .then(res => {
        this.setState({ comments: JSON.parse(res.data) });
      })
      .catch(err => console.log(err));
    await this.setState({
      commentBtn: false,
      inputComment: ""
    })
    // this.props.history.replace({
    //   pathname: `/comment/${this.state.problem_id}`,
    //   state: { email: this.state.email }
    // });
  }
  render() {
    let list;
    const { comments } = this.state;
    const commentBtn = this.state.commentBtn;
    // console.log(comments);
    if (comments) {
      list = comments.map((data, i) => (
        <section key={i} className="message-left flex">
          {/*IMG삽입*/}
          {data.img === null ? (
            <img
              style={{
                width: "100px",
                height: "100px",
                "object-fit": "cover",
                "border-radius": "50%",
                "margin-top": "auto"
              }}
              src={cats100}
              alt="image place"
            />
          ) : (
            <img
              style={{
                width: "100px",
                height: "100px",
                "object-fit": "cover",
                "border-radius": "50%",
                "margin-top": "auto"
              }}
              src={data.img}
              alt="image place"
            />
          )}

          <div
            className="nes-balloon from-left padding-zero-only"
            style={{
              "padding-bottom": "1em"
            }}
          >
            <p>
              <span className="span_em_small">
                {!data.nick ? " 익명의 더쿠" : data.nick}:{" "}
              </span>
              {data.comment}
              <br />
              <span className="span_em_small grey">
                {data.day}
              </span>
            </p>
          </div>
        </section>
      ));
    } else {
      list = undefined;
    }
    return (
      <div className="pageCSS-white max-width">
        <section
          className="message-list"
          style={{
            marginTop: "2em",
            paddingBottom: "3em"
          }}
        >
          <div className="nes-container with-title is-centered padding-zero">
            <p className="title">Comments</p>
            {commentBtn ? (
              <div>
                <textarea
                  cols="40%"
                  rows="4"
                  onChange={e => this.inputCommentHandle(e)}
                  placeholder="의견을 남겨주세요"
                ></textarea>
                <button onClick={() => this.submitComment()}>댓글 쓰기</button>
                <button onClick={() => this.commentBtnHandle()}>
                  댓글입력창없애기
                </button>
              </div>
            ) : (
              <div>
                <button onClick={() => this.commentBtnHandle()}>
                  댓글입력모드
                </button>
              </div>
            )}
            {list ? list : <div>아직 해당문제에 대한 의견이 없습니다.</div>}
          </div>
        </section>
      </div>
    );
  }
}
