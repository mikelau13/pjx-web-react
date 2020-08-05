import React, {Component} from "react";
import { Link } from 'react-router-dom';

export default class Landing extends Component {
  render() {
    return (
      <div>
        <h1>Hello World</h1>
        <ul>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </div>
    );
  }
}
