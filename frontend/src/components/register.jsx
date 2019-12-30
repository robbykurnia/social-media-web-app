import React, { Component } from "react";

class Register extends Component {
  // state = {  }
  render() {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
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
          />
        </div>
        <div className="form-group">
          <label htmlFor="retypePassword">Retype Password</label>
          <input
            type="password"
            className="form-control"
            id="retypePassword"
            placeholder="Retype Password"
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    );
  }
}

export default Register;
