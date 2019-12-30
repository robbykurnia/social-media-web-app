import React, { Component } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../config.json";

const urlEndPoint = apiUrl;
const tokenKey = "token";

class Login extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
  }

  handleSubmit = event => {
    event.preventDefault();
    const email = this.email.current.value;
    const password = this.password.current.value;

    // Update Soon
    if (email.trim().length === 0 || password.trim().length === 0) return;

    console.log(`email: ${email} \npassword: ${password}`);

    const requestBody = {
      query: `
        mutation{
          login(input:{email:"${email}", password:"${password}"})
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
        if (user.errors) {
          return alert(JSON.stringify(user.errors[0].message));
        } else {
          localStorage.setItem(tokenKey, JSON.stringify(user.data.login));
          return (window.location = "/");
        }
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            ref={this.email}
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            ref={this.password}
            autoComplete="current-password"
          />
        </div>
        <div className="mb-3">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    );
  }
}
export default Login;
