import React from "react";
import { Link } from "react-router-dom";
import "../shared/App.css";

class FooterMenubar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <nav id="footer-menubar1">
        <ul>
          <li className="menuLink1">
            <Link className="menuLink">전적</Link>
          </li>
          <li className="menuLink2">
            <Link className="menuLink">추천</Link>
          </li>
          <li className="menuLink3">
            <Link className="menuLink" to="/main">
              홈
            </Link>
          </li>
          <li className="menuLink4">
            <Link className="menuLink" to="/createProblem">
              만들기
            </Link>
          </li>
          <li className="menuLink5">
            <Link className="menuLink" to="/profile">
              프로필
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
export default FooterMenubar;