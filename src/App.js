import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

import Login from './Components/Login';
import Main from './Components/Trello';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Login} />
        <Route path="/trello" component={Main} />
      </Router>
    </div>
  );
}

export default App;
