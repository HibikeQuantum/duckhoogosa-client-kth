import React, { Component } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Joi from "joi-browser";
var Scroll = require("react-scroll");

var Element = Scroll.Element;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;
const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

class CreateProblem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      _id: String,
      email: String,
      tags: Array,
      Genre: String,
      title: String,
      background: String,
      representImg: String,
      Problems: [], //문제 객체의 목록
      date: new Date(),
      savedFiles: [], //현재 문제 파일 저장
      problemText: "", //현재 문제의 지문
      problemTextErrors: {},
      choiceInitialValue: "none",
      choice: [{}], //문제객체 배열  => {text:,answer:} 객체 저장
      curProblem: 0 //현재 문제 번호 0~
    };
  }
  problemTextSchema = {
    Problemtext: Joi.string().required()
  };

  componentDidMount() {}
  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  handleChange = e => {
    //문제의 지문 값 온체인지
    this.setState({
      problemText: e.target.value
    });
  };

  handleChoiceAnswer = (e, v) => {
    //답안지 별 텍스트 수정
    console.log("v", v);
    if (e.target.type === "checkbox") {
      let answer = [...this.state.choice];
      answer[v].answer = !answer[v].answer;
      this.setState({
        choice: answer
      });
    } else {
      let answer = [...this.state.choice];
      answer[v].text = e.target.value;
      this.setState({
        choice: answer
      });
    }
    console.log(this.state);
  };

  choiceHandleChange = e => {
    //보기 타입 설정
    console.log(e.target.value);
    this.setState({
      chiceValue: e.target.value
    });
  };

  formTag = (num, label) => {
    //중복되는 태그 답안별로 체크해서 띄우기

    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor="" className="htmlFor">
            {this.state.choice[1] === undefined ? "주관식" : label}
          </label>
          <span>
            <textarea
              onChange={e => {
                this.handleChoiceAnswer(e, num);
              }}
              type="text"
              className="form-control"
              defaultValue=""
            />
            정답{"                 "}
            <input
              type="checkbox"
              onChange={e => {
                this.handleChoiceAnswer(e, num);
              }}
            />
          </span>
        </div>
      </React.Fragment>
    );
  };

  selectHandleChange = event => {
    //답안 타입 선택

    let type = parseInt(event.target.value);
    let arr = [];
    for (let i = 0; i < type; i++) {
      arr.push([{ text: "", answer: false }]);
    }
    this.setState({
      choice: arr
    });
  };
  selectChoice = value => {};

  prevButton = () => {
    let prevProblem = this.state.curProblem - 1;
  };

  nextButton = () => {
    console.log(this);
    let newProblem = {
      fileLink1: this.state.files[0],
      fileLink2: this.state.files[1],
      problemText: this.state.problemText,
      choice: this.state.choice
    };
    let Problems = [...this.state.Problems];
    Problems[this.state.curProblem] = newProblem;
    this.setState({
      ...this.state,
      Problems: Problems,
      curProblem: this.state.curProblem + 1,
      date: new Date(),
      savedFiles: [],
      problemText: "",
      problemTextErrors: {},
      choiceInitialValue: "none",
      choice: [{}],
      files: []
    });

    console.log("넥스트", this.state);
  };

  removefile = () => {};
  render() {
    return (
      <div>
        <form>
          <label>
            <span>
              <div class="d-inline p-2 bg-primary text-white">
                {this.state.curProblem + 1}번
              </div>
            </span>
            문제에 사용할 파일{" "}
          </label>
          <FilePond
            ref={ref => (this.pond = ref)}
            files={this.state.files}
            allowMultiple={true}
            maxFiles={2}
            server={null}
            // onremovefile={this.removefile}
            oninit={() => this.handleInit()}
            onupdatefiles={fileItems => {
              // Set current file objects to this.state
              this.setState({
                files: fileItems.map(fileItem => fileItem.file)
              });
            }}
          ></FilePond>
          <h1>지문</h1>

          <div className="form-group">
            <label htmlFor="" className="htmlFor"></label>
            <textarea
              onChange={this.handleChange}
              type="text"
              className="form-control"
              defaultValue=""
            />
          </div>

          <h2>답안 형태</h2>
          <select
            value={this.state.choiceInitialValue}
            onChange={this.selectHandleChange}
          >
            <option value="none">선택</option>
            <option value="1">주관식</option>
            <option value="2">보기 두개</option>
            <option value="3">보기 세개</option>
            <option value="4">보기 네개</option>
            <option value="5">보기 다섯개</option>
          </select>
          {this.state.choice[0] && this.formTag(0, "1번")}
          {this.state.choice[1] && this.formTag(1, "2번")}
          {this.state.choice[2] && this.formTag(2, "3번")}
          {this.state.choice[3] && this.formTag(3, "4번")}
          {this.state.choice[4] && this.formTag(4, "5번")}

          <div
            className="btn-group btn-group-lg"
            role="group"
            aria-label="Basic example"
          >
            <button type="button" className="btn btn-secondary">
              제출
            </button>
            <button type="button" className="btn btn-secondary">
              삭제
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.prevButton}
            >
              이전문제
            </button>
            <button
              type="reset"
              className="btn btn-secondary"
              onClick={this.nextButton}
            >
              다음문제
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateProblem;
