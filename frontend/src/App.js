import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navBar";
import NotFound from "./components/notFound";
import Intro from "./components/intro";
import Feed from "./components/feed";
import Profile from "./components/profile";
import Login from "./components/login";
import Register from "./components/register";

class App extends Component {
  state = {};

  getData = () => {};

  componentDidMount() {}
  render() {
    return (
      <div>
        <NavBar />
        <br />
        <div className="container">
          <Switch>
            <Route path="/profile/:username?" exact component={Profile} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/feed" exact component={Feed} />
            <Route path="/not-found" component={NotFound} />
            <Route path="/" exact component={Intro} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
