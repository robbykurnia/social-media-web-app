import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

class NavBar extends Component {
  // state = {};
  handleSearch = () => {
    console.log("Search");
  };
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            E-Talk
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/posts">
                  Posts
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/other">
                  Other
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-link ml-auto" to="/login">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-link ml-auto" to="/register">
                  Register
                </NavLink>
              </li>
            </ul>
            <form className="form-inline my-2 ml-auto">
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                className="btn btn-outline-success my-10 my-sm-0"
                type="submit"
                onClick={this.handleSearch}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
