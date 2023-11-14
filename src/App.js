import React from 'react'
//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ListCompaniesComponent from './components/ListCompaniesComponent';
import CreateCompanyComponent from './components/CreateCompanyComponent';

function App() {
  return (
    <div className = "container">

    <Router>
      <Switch>
        <Route path="/api/companies" component={ListCompaniesComponent} exact/>
        <Route path="/api/companies/create" component={CreateCompanyComponent} exact/>
      </Switch>
    </Router>

    </div>
    

  );
}

export default App;
