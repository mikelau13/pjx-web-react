import React, {Component} from "react";

export default class Landing extends Component {
  render() {
    return (
      <div>
        <h1>Hello World</h1>
        <ul>
          <li><a href="/register">Register</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
        </ul>
      </div>
    );
  }
}
