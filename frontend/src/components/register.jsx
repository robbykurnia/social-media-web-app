import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { apiUrl } from "../config.json";
import service from "../services/service";
import SwalAlert from "../services/SwalAlert";

const urlEndPoint = apiUrl;
const tokenKey = "token";

class Register extends Component {
  state = { disabled: true };

  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.username = React.createRef();
    this.password = React.createRef();
  }

  handleChange = () => {
    const email = this.email.current.value;
    const username = this.username.current.value;
    const password = this.password.current.value;

    if (email.length !== 0 && password.length !== 0 && username.length)
      this.setState({ disabled: false });
    else this.setState({ disabled: true });
  };

  handleSubmit = event => {
    event.preventDefault();
    const email = this.email.current.value;
    const username = this.username.current.value;
    const password = this.password.current.value;
    console.log(
      `email: ${email} \nusername:${username} ${
        username.trim().split(" ").length
      } ${username.match(/[^a-zA-Z0-9]/)} \npassword: ${password}`
    );

    // Check Special Characters
    if (username.match(/[^a-zA-Z0-9]/))
      return SwalAlert.warning(
        "Username in alphabet and/or numbers",
        "warning"
      );
    console.log(`email: ${email} \npassword: ${password}`);

    const requestBody = {
      query: `
        mutation{
          register(input: {username: "${username}", email: "${email}", password: "${password}"}) {
            id
          }
          login(input: {email: "${email}", password: "${password}"})
        }
      `
    };

    fetch(urlEndPoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(user => {
        console.log("user:  ", user);
        if (user.errors) {
          const errorMessage = user.errors[0].message;
          return SwalAlert.warning(errorMessage, "warning");
        } else {
          const data = user.data.login.split(" ");
          const jwt = JSON.stringify(data[0]);
          const username = JSON.stringify(data[1]);
          const email = JSON.stringify(data[2]);
          console.log(jwt);
          console.log(username);
          console.log(email);
          localStorage.setItem(tokenKey, jwt);
          return (window.location = "/feed");
        }
      });
  };
  render() {
    if (service.getCurrentUser()) return <Redirect to="/feed" />;
    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
            ref={this.email}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Username"
            autoComplete="username"
            ref={this.username}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            ref={this.password}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={this.state.disabled}
        >
          Submit
        </button>
      </form>
    );
  }
}

export default Register;
