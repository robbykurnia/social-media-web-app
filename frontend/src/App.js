import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import NavBar from "./components/navBar";
import NotFound from "./components/notFound";
import Home from "./components/home";
import Posts from "./components/posts";
import About from "./components/about";
import Other from "./components/other";
import Login from "./components/login";
import Register from "./register";

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
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/posts" exact component={Posts} />
            <Route path="/other" exact component={Other} />
            <Route path="/about" exact component={About} />
            <Route path="/not-found" component={NotFound} />
            <Route path="/" exact component={Home} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
