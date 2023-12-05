import React from 'react'
//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


import ListCompaniesComponent from './components/ListCompaniesComponent';
import CreateCompanyComponent from './components/CreateCompanyComponent';
import ListCompanyEquipmentComponent from './components/ListCompanyEquipmentComponent';
import ListEquipmentComponent from './components/ListEquipmentComponent';
import CreateCompanyAdminComponent from './components/CreateCompanyAdminComponent';
import ViewCompanyComponent from './components/ViewCompanyComponent';
import ActivateAccountComponent from './components/ActivateAccountComponent'; 
import CreateUserComponent from './components/CreateUserComponent';
import EquipmentOrderingComponent from './components/EquipmentOrderingComponent'
import UpdateCompanyComponent from './components/UpdateCompanyComponent';
import UpdateCompanyAdminComponent from './components/UpdateCompanyAdminComponent';
import SysAdminHomePageComponent from './components/SysAdminHomePageComponent';
import CreateSystemAdminComponent from './components/CreateSystemAdminComponent';


function App() {
  return (
    <div className = "container">

    <Router>
      <Switch>
        <Route path="/api/companies" component={ListCompaniesComponent} exact/>
        <Route path="/api/companies/update/:id" component={UpdateCompanyComponent} exact/>
        <Route path="/api/companies/create" component={CreateCompanyComponent} exact/>
        <Route path="/api/equipment/company/:id"  component={ListCompanyEquipmentComponent} exact />
        <Route path="/api/equipment" component={ListEquipmentComponent} exact />
        <Route path="/api/companies/:id" component={ViewCompanyComponent} exact/>
        <Route path="/activate" component={ActivateAccountComponent} exact/>
        <Route path="/signup" component={CreateUserComponent} exact/>
        <Route path="/api/company-admins/create" component={CreateCompanyAdminComponent} exact/>
        <Route path="/api/company-admins/update/:id" component={UpdateCompanyAdminComponent} exact/>
        <Route path="/api/equipment/ordering" component={EquipmentOrderingComponent} exact/>
        <Route path="/api/home-page/system-admin" component={SysAdminHomePageComponent} exact/>
        <Route path="/api/system-admins/create" component={CreateSystemAdminComponent} exact/>
      </Switch>
    </Router>

    </div>
    

  );
}

export default App;
