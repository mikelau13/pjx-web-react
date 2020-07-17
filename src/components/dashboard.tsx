import React, { Component } from "react";

export class Dashboard extends Component {
    render() {
      return (
        <div>
          <h1>Dashboard</h1>
          <ul>
            <li><a href="/cities">See All Cities</a></li>
            <li><a href="/logout">Sign Out</a></li>
        </ul>
        </div>
      );
    }
  }
