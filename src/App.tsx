// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Hello World!
//         </a>
//         <a href="http://www.nba.com">Sign In</a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React, {Component} from "react";
import { AuthProvider } from "./providers/authProvider";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes/routes";

export class App extends Component {
    render() {
        return (
            <AuthProvider>
              <BrowserRouter children={Routes} basename={"/"} />
            </AuthProvider>
        );
    }
}

export default App;
