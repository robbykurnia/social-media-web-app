import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

// Note:
// 1. Perbaiki searchBar dan navbar-brand ketika ukuran extra-small.
// 2. Perbaiki lebar container navbar dengan CONTENT yang tidak sama.

class NavBar extends Component {
  state = {};

  handleSearchBar = () => {
    // searchBar = this.state.searchBar === "collapse";
  };

  handleSearch = () => {
    console.log("Search");
  };
  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <div className="container">
          {/* Hidden only on xs */}
          <Link className="navbar-brand d-none d-sm-block" to="/">
            EXPOSE
          </Link>
          {/* Visible only on xs */}
          <Link className="navbar-brand d-sm-none" to="/">
            EXPOSE
          </Link>

          <form className="form-inline ml-auto d-md-none d-lg-none">
            <div className="collapse" id="search-bar-xs">
              <input
                className="form-control form-control-sm mr-2"
                id="search-bar-xs"
                type="text"
                placeholder="Search Person"
                aria-label="Search"
              />
            </div>
            <i
              className="fa fa-search m-2"
              data-toggle="collapse"
              data-target="#search-bar-xs"
              aria-expanded="false"
              aria-controls="collapseExample"
            ></i>
          </form>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav mr-auto">
              <NavLink className="nav-link nav-item" to="/feed">
                Home
              </NavLink>
              <NavLink className="nav-link nav-item" to="/profile/?">
                Profile
              </NavLink>
            </div>
            <div className="navbar-nav ml-auto">
              <form className="form-inline ">
                <div className="collapse" id="collapseExample">
                  <input
                    className="form-control form-control-sm mr-2 ml-2 d-none d-md-block"
                    id="collapseExample"
                    type="text"
                    placeholder="Search Person"
                    aria-label="Search"
                  />
                </div>
                <i
                  className="fa fa-search m-2 d-none d-md-block"
                  data-toggle="collapse"
                  data-target="#collapseExample"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                ></i>
              </form>
              <NavLink className="nav-link nav-item" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-link nav-item" to="/register">
                Register
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
