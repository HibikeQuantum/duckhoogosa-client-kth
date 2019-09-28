import React from "react";
import axios from "axios";
import { config } from "../config";
import { fakeData } from "../fakeData";
import { Route, Switch, Link, Redirect } from "react-router-dom";
import "./Main.css";
let mainApi = "http://localhost:8000/problem/main";
let searchApi = "http://localhost:8000/problem/search";
let genreApi = "http://localhost:8000/problem/genre";
class Main extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { // 실제로 사용할 state
    //   problems: null,
    //   currentOption: "",
    //   input: ""
    // };
    this.state = {
      // 서버가 완성되기 전까지 가짜데이터로 임시로 설정
      problems: [],
      searchProblems: [],
      numberLoadingSearchProblem: 5, //
      countSearchLoading: 0,
      search: false,
      currentOption: "",
      input: "",
      numberLoadingProblem: 5, //한번에 로딩 되는 문제 수
      countLoading: 0, //문제 받아온 횟수
      genreOn: false
    };
  }
  componentDidMount = async () => {
    let countLoading = 0;
    this.state.search
      ? (countLoading = this.state.countSearchLoading)
      : (countLoading = this.state.countLoading);

    console.log("카운트로딩", countLoading);
    if (countLoading === 0 && this.state.search === false) {
      console.log("초기검색어", this.state.input);
      const { data } = await axios.post(
        this.state.search ? searchApi : mainApi,
        {
          next_problem: 0,
          word: this.state.input
        }
      );
      console.log("데이타", JSON.parse(data));
      this.state.search
        ? this.setState({ searchProblems: JSON.parse(data) })
        : this.setState({ problems: JSON.parse(data) });
    }
    window.addEventListener("scroll", this.handleScroll);
  };
  componentWillUnmount() {
    // 언마운트 될때에, 스크롤링 이벤트 제거
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = async () => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body;

    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    if (scrollHeight - innerHeight - scrollTop < 30) {
      let countLoading = 0;
      let loadingProblem = 0;
      if (this.state.search) {
        countLoading = this.state.countSearchLoading + 1;
        loadingProblem = this.state.numberLoadingSearchProblem;
      } else {
        countLoading = this.state.countLoading + 1;
        loadingProblem = this.state.numberLoadingProblem;
      }
      if (!this.state.genreOn) {
        let { data } = await axios.post(
          this.state.search ? searchApi : mainApi,
          {
            next_problem: loadingProblem * countLoading,
            word: this.state.input
          }
        );

        data = JSON.parse(data);
        let origin = [];
        this.state.search
          ? (origin = this.state.searchProblems.map(v => JSON.stringify(v)))
          : (origin = this.state.problems.map(v => JSON.stringify(v)));

        let newData = data.filter(v => {
          if (!origin.includes(JSON.stringify(v))) {
            return v;
          }
        });

        if (!this.state.search) {
          let problems = [...this.state.problems, ...newData];

          this.setState({
            problems: problems,
            countLoading: countLoading
          });
        } else {
          let problems = [...this.state.searchProblems, ...newData];

          this.setState({
            searchProblems: problems,
            countSearchLoading: countLoading
          });
        }
      } else {
        let { data } = await axios.post(genreApi, {
          next_problem: loadingProblem * countLoading,
          genre: this.state.currentOption
        });

        data = JSON.parse(data);
        let origin = [];
        this.state.search
          ? (origin = this.state.searchProblems.map(v => JSON.stringify(v)))
          : (origin = this.state.problems.map(v => JSON.stringify(v)));

        let newData = data.filter(v => {
          if (!origin.includes(JSON.stringify(v))) {
            return v;
          }
        });

        if (!this.state.search) {
          let problems = [...this.state.problems, ...newData];

          this.setState({
            problems: problems,
            countLoading: countLoading
          });
        } else {
          let problems = [...this.state.searchProblems, ...newData];

          this.setState({
            searchProblems: problems,
            countSearchLoading: countLoading
          });
        }
      }
    }
  };

  handleSelect = async e => {
    // if(this.state.)////
    if (e.target.value !== "") {
      let curr = document.getElementById("currentGenre");
      let choiceOpt =
        curr.options[document.getElementById("currentGenre").selectedIndex]
          .value;
      // console.log(choiceOpt);
      this.setState(
        {
          currentOption: choiceOpt
        },
        async () => {
          let { data } = await axios.post(genreApi, {
            next_problem: 4,
            genre: this.state.currentOption
          });

          data = JSON.parse(data);

          let origin = [];
          this.state.search
            ? (origin = this.state.searchProblems.map(v => JSON.stringify(v)))
            : (origin = this.state.problems.map(v => JSON.stringify(v)));

          let newData = data.filter(v => {
            if (!origin.includes(JSON.stringify(v))) {
              return v;
            }
          });

          this.setState({
            problems: [...this.state.problems, ...newData],
            genreOn: true
          });
        }
      );
    } else {
      let problems = [...this.state.problems];
      this.setState({
        genreOn: false,
        problems: problems,
        currentOption: ""
      });
    }
  };

  handleInput(e) {
    this.setState({
      input: e.target.value
    });
  }
  search() {
    if (this.state.input.length < 2) {
      alert("두글자 이상 입력해주세요");
    } else {
      this.setState(
        {
          search: true,
          countSearchLoading: 0
        },
        async () => {
          window.addEventListener("scroll", this.handleScroll);
          let countLoading = 0;
          this.state.search
            ? (countLoading = this.state.countSearchLoading)
            : (countLoading = this.state.countLoading);

          console.log("카운트로딩", countLoading);
          if (countLoading === 0) {
            console.log("초기검색어", this.state.input);
            const { data } = await axios.post(searchApi, {
              next_problem: 0,
              word: this.state.input
            });
            console.log("데이타", JSON.parse(data));
            this.state.search
              ? this.setState({
                  searchProblems: JSON.parse(data),
                  countSearchLoading: 0
                })
              : this.setState({ problems: JSON.parse(data) });
          }
        }
      );
    }
  }
  solvedProblem(e, id) {
    e.preventDefault();
    this.props.history.push(`/SolvingProblem/${id}`);
    // alert("해당문제 id:" + id);
    // axios
    //   .get(`http://localhost:8000/problem?id=${id}`)
    //   .then(item => this.props.history.push("/SolvedProblem"))
    //   .catch(err => console.log(err));
  }
  render() {
    // const { img, title, problem_id } = this.state.problems;
    const problems = this.state.search
      ? this.state.searchProblems
      : this.state.problems;
    return (
      <div className="container">
        <div className="top-search-bar">
          장르(검색시에는 적용되지않음)
          <select
            id="currentGenre"
            className="form-control"
            onChange={e => {
              this.handleSelect(e);
            }}
          >
            <option value="">모두</option>
            <option value="movie">영화</option>
            <option value="animation">애니메이션</option>
            <option value="game">게임</option>
            <option value="sports">스포츠</option>
            <option value="entertain">연예</option>
            <option value="military">군사</option>
          </select>
          <input
            type="text"
            id="inputTag"
            className="form-control"
            placeholder="제목 검색"
            value={this.state.input}
            size="40"
            onChange={e => this.handleInput(e)}
          ></input>
          <button onClick={() => this.search()}>찾기</button>
        </div>
        <hr></hr>
        <div className="problem-list">
          문제 모음집
          {problems.map((item, i) =>
            this.state.currentOption === "" ? (
              <div key={i} className="problems">
                <a href="/#">
                  <img
                    src={item.representImg}
                    alt="Responsive"
                    height="200"
                    width="300"
                    onClick={e => this.solvedProblem(e, item._id)}
                  />
                </a>
                <br></br>
                <a href="/#" onClick={e => this.solvedProblem(e, item._id)}>
                  {item.title}
                </a>
              </div>
            ) : this.state.currentOption === item.genre ? (
              <div key={item._id} className="problems">
                <a href="/#">
                  <img
                    src={item.representImg}
                    alt="Responsive"
                    height="200"
                    width="300"
                    onClick={e => this.solvedProblem(e, item._id)}
                  />
                </a>
                <br></br>
                <a href="/#" onClick={e => this.solvedProblem(e, item._id)}>
                  {item.title}
                  <br></br>
                  {/* {item.tags} */}
                </a>
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  }
}

export default Main;
