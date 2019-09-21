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
          <li>
            <Link className="menuLink">전적</Link>
          </li>
          <li>
            <Link className="menuLink">추천</Link>
          </li>
          <li>
            <Link className="menuLink" to="/main">
              홈
            </Link>
          </li>
          <li>
            <Link className="menuLink" to="/CreateProblem">
              만들기
            </Link>
          </li>
          <li>
            <Link className="menuLink" to="/Profile">
              프로필
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
export default FooterMenubar;
