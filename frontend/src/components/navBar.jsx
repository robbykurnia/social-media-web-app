import React, { Component } from "react";
import { Link, NavLink, Redirect } from "react-router-dom";
// import e from "express";
import { getUser } from "./../services/service";
import SearchTypehead from "./common/searchTypehead";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      persons: [
        // { id: 1, username: "robby" },
        // { id: 2, username: "robby" },
        // { id: 3, username: "robby" }
      ]
    };
  }
  onClick = () => {
    this.setState({ searchInput: "", persons: [] });
  };

  onSubmit = e => {
    e.preventDefault();
    // this.setState({ redirect: true });
    const move =
      this.state.persons.length !== 0
        ? (window.location = `/profile/${this.state.persons[0].username}`)
        : (window.location = `/search/${this.state.searchInput}`);
  };

  // renderRedirect = () => {
  //   if (this.state.redirect && this.state.persons.length > 0) {
  //     return <Redirect to={`profile/${this.state.persons[0].username}`} />;
  //   }
  // };

  onChange = e => {
    const searchInput = e.currentTarget.value;
    const onlyWhiteSpace = !searchInput || !searchInput.match(/[\S]/);
    this.setState({ searchInput });

    if (searchInput.match(/[^a-zA-Z0-9]/)) return;
    if (onlyWhiteSpace) return this.setState({ persons: [] });

    getUser(searchInput).then(data => {
      try {
        const substring = data.data.s1;
        // const regex = data.data.s2;
        const bankPerson = [];
        const identify = [];
        const persons = [];

        const addSubtring =
          substring.length > 0
            ? substring.map(item => bankPerson.push(item))
            : null;
        // const addRegex =
        //   regex.length > 0 ? regex.map(item => bankPerson.push(item)) : null;

        for (let i = 0; i < bankPerson.length; i++) {
          const find = identify.indexOf(bankPerson[i].id);
          if (find < 0) {
            identify.push(bankPerson[i].id);
            persons.push(bankPerson[i]);
          }
        }

        this.setState({ persons });
      } catch (error) {
        // CHANGE WITH TOASTIFT
        // console.log(error);
        // console.log("User invalid");
        throw new Error("data not found");
      }
    });
  };

  render() {
    // const backdropStyle = {
    //   backgroundSize: "cover",
    //   backgroundColor: "blue"
    // };
    const { user } = this.props;

    return (
      <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top p-0">
        <div className="container pr-3 pl-3">
          {/* Hidden only on xs */}
          <Link className="navbar-brand d-none d-sm-block" to="/">
            EXPOSE
          </Link>
          {/* Visible only on xs */}
          <Link className="navbar-brand d-sm-none" to="/">
            EXPOSE
          </Link>

          <form
            onSubmit={this.onSubmit}
            className="form-inline ml-auto d-md-none d-lg-none"
          >
            <div className="" id="search-bar-xs">
              <div className="dropdown show">
                <input
                  className="form-control form-control-sm mr-2 dropdown-toggle"
                  type="text"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="false"
                  aria-expanded="true"
                  autoComplete="off"
                  value={this.state.searchInput}
                  onChange={this.onChange}
                />

                <SearchTypehead
                  persons={this.state.persons}
                  onClick={this.onClick}
                />

                {/* {this.state.persons.length > 0 && (
                  <React.Fragment>
                    <div
                      className="dropdown-menu show"
                      aria-labelledby="dropdownMenuButton"
                    >
                      {this.state.persons.map(item => (
                        <Link
                          key={item.id}
                          className="dropdown-item pr-2 pl-2"
                          to={`/profile/${item.username}`}
                          onClick={this.onClick}
                        >
                          <img
                            className="comment-photo mr-2"
                            src={`https://i.picsum.photos/id/${item.id}/300/300.jpg`}
                            alt="Profile"
                          />
                          {item.username}
                        </Link>
                      ))}
                    </div>
                  </React.Fragment>
                )} */}
              </div>
            </div>
          </form>
          <button
            className="navbar-toggler ml-2"
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
              {user && (
                <React.Fragment>
                  <NavLink className="nav-link nav-item" to="/feed">
                    Home
                  </NavLink>
                  <NavLink
                    className="nav-link nav-item"
                    to={`/profile/${user.user.username}`}
                  >
                    Profile
                  </NavLink>
                </React.Fragment>
              )}
            </div>
            <div className="navbar-nav ml-auto">
              {user && (
                <React.Fragment>
                  <form className="form-inline ">
                    <div className="collapse" id="collapseExample">
                      <input
                        className="form-control form-control-sm mr-2 ml-2 d-none d-md-block"
                        id="collapseExample"
                        type="text"
                        placeholder="Search Person"
                        aria-label="Search"
                        onChange={this.handleSearch}
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

                  <NavLink
                    className="nav-link nav-item"
                    to={`/profile/${user.user.username}`}
                  >
                    {user.user.username}
                  </NavLink>
                  <NavLink className="nav-link nav-item" to="/logout">
                    Logout
                  </NavLink>
                </React.Fragment>
              )}
              {!user && (
                <React.Fragment>
                  <NavLink className="nav-link nav-item" to="/login">
                    Login
                  </NavLink>
                  <NavLink className="nav-link nav-item" to="/register">
                    Register
                  </NavLink>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
