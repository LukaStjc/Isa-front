import React from 'react'
//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ListCompaniesComponent from './components/ListCompaniesComponent';
import CreateCompanyComponent from './components/CreateCompanyComponent';
import ListCompanyEquipmentComponent from './components/ListCompanyEquipmentComponent';
import ListEquipmentComponent from './components/ListEquipmentComponent';
import CreateCompanyAdminComponent from './components/CreateCompanyAdminComponent';

function App() {
  return (
    <div className = "container">

    <Router>
      <Switch>
        <Route path="/api/companies" component={ListCompaniesComponent} exact/>
        <Route path="/api/companies/create" component={CreateCompanyComponent} exact/>
        <Route path="/api/equipment/company/:id" component={ListCompanyEquipmentComponent} exact />
        <Route path="/api/equipment" component={ListEquipmentComponent} exact />
        <Route path="/api/company-admins/create" component={CreateCompanyAdminComponent} exactv/>
      </Switch>
    </Router>

    </div>
    

  );
}

export default App;
