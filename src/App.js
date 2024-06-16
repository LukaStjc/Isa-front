import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./services/auth.service";
import EventBus from "./common/EventBus";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardCompanyAdmin from "./components/board-company-admin.component";
import BoardSystemAdmin from "./components/board-system-admin.component";
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
import UpdateSystemAdminPassword from './components/UpdateSystemAdminPassword';
import ListComplaintComponent from './components/ListComplaintComponent';
import ReplyToComplaintComponent from './components/ReplyToComplaintComponent';
import CalendarViewWorkingDaysComponent from './components/CalendarViewWorkingDaysComponent';
import CreateEquipmentComponent from './components/CreateEquipmentComponent';
import UpdateEquipmentComponent from './components/UpdateEquipmentComponent';
import CreatePredefinedReservation from './components/CreatePredefinedReservation';
import CompanyAdminHomeComponent from './components/CompanyAdminHomeComponent';

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showCompanyAdminBoard: false,
      showSystemAdminBoard: false,
      showRegisteredUserBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showCompanyAdminBoard: user.roles.includes("ROLE_COMPANY_ADMIN"),
        showRegisteredUserBoard: user.roles.includes("ROLE_REGISTERED_USER"),
        showSystemAdminBoard: user.roles.includes("ROLE_SYSTEM_ADMIN"),
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showCompanyAdminBoard: false,
      showSystemAdminBoard: false,
      showRegisteredUserBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showCompanyAdminBoard, showSystemAdminBoard, showRegisteredUserBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Medical equipment service
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showSystemAdminBoard && 
            <React.Fragment>
              <li className="nav-item">
                <Link to={"/system-admin"} className="nav-link">
                  System Admin Board
                </Link>
              </li>
              <li>
                <Link to={"/api/companies"} className="nav-link">
                  Companies
                </Link>
              </li>
            </React.Fragment>
            }

            {showCompanyAdminBoard && 
            <React.Fragment>
              <li className="nav-item">
                <Link to={"/company-admin"} className="nav-link">
                  Company Admin Board
                </Link>
              </li>
              <li>
                <Link to={"/api/companies"} className="nav-link">
                  Companies
                </Link>
              </li>
            </React.Fragment>
            }

            {showRegisteredUserBoard && 
            <React.Fragment>
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  Registered user
                </Link>
              </li>
              <li>
                <Link to={"/api/companies"} className="nav-link">
                  Companies
                </Link>
              </li>
            </React.Fragment>
            }
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/signup"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/company-admin" component={BoardCompanyAdmin} />
            <Route path="/system-admin" component={BoardSystemAdmin} />
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
            <Route path="/api/system-admins/update-password" component={UpdateSystemAdminPassword} exact/>
            <Route path="/api/complaints" component={ListComplaintComponent} exact/>
            <Route path="/api/complaints/reply/:id" component={ReplyToComplaintComponent} exact />
            <Route path="/api/company-admins/company-working-days" component={CalendarViewWorkingDaysComponent} exact/>
            <Route path="/api/equipment/create/:id" component={CreateEquipmentComponent} exact />
            <Route path="/api/equipment/update/:id" component={UpdateEquipmentComponent} exact />
            <Route path="/api/companies/:id/create-reservation" component={CreatePredefinedReservation} exact />
            <Route path="/api/company-admins/:id" component={CompanyAdminHomeComponent} exact />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;



// import React from 'react'
// //import logo from './logo.svg';
// import './App.css';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


// import ListCompaniesComponent from './components/ListCompaniesComponent';
// import CreateCompanyComponent from './components/CreateCompanyComponent';
// import ListCompanyEquipmentComponent from './components/ListCompanyEquipmentComponent';
// import ListEquipmentComponent from './components/ListEquipmentComponent';
// import CreateCompanyAdminComponent from './components/CreateCompanyAdminComponent';
// import ViewCompanyComponent from './components/ViewCompanyComponent';
// import ActivateAccountComponent from './components/ActivateAccountComponent'; 
// import CreateUserComponent from './components/CreateUserComponent';
// import EquipmentOrderingComponent from './components/EquipmentOrderingComponent'
// import UpdateCompanyComponent from './components/UpdateCompanyComponent';
// import UpdateCompanyAdminComponent from './components/UpdateCompanyAdminComponent';
// import SysAdminHomePageComponent from './components/SysAdminHomePageComponent';
// import CreateSystemAdminComponent from './components/CreateSystemAdminComponent';
// import UpdateSystemAdminPassword from './components/UpdateSystemAdminPassword';
// import ListComplaintComponent from './components/ListComplaintComponent';
// import ReplyToComplaintComponent from './components/ReplyToComplaintComponent';
// import CalendarViewWorkingDaysComponent from './components/CalendarViewWorkingDaysComponent';
// import CreateEquipmentComponent from './components/CreateEquipmentComponent';
// import UpdateEquipmentComponent from './components/UpdateEquipmentComponent';
// import CreatePredefinedReservation from './components/CreatePredefinedReservation';
// import CompanyAdminHomeComponent from './components/CompanyAdminHomeComponent';
// function App() {
//   return (
//     <div className = "container">

//     <Router>
//       <Switch>
//         <Route path="/api/companies" component={ListCompaniesComponent} exact/>
//         <Route path="/api/companies/update/:id" component={UpdateCompanyComponent} exact/>
//         <Route path="/api/companies/create" component={CreateCompanyComponent} exact/>
//         <Route path="/api/equipment/company/:id"  component={ListCompanyEquipmentComponent} exact />
//         <Route path="/api/equipment" component={ListEquipmentComponent} exact />
//         <Route path="/api/companies/:id" component={ViewCompanyComponent} exact/>
//         <Route path="/activate" component={ActivateAccountComponent} exact/>
//         <Route path="/signup" component={CreateUserComponent} exact/>
//         <Route path="/api/company-admins/create" component={CreateCompanyAdminComponent} exact/>
//         <Route path="/api/company-admins/update/:id" component={UpdateCompanyAdminComponent} exact/>
//         <Route path="/api/equipment/ordering" component={EquipmentOrderingComponent} exact/>
//         <Route path="/api/home-page/system-admin" component={SysAdminHomePageComponent} exact/>
//         <Route path="/api/system-admins/create" component={CreateSystemAdminComponent} exact/>
//         <Route path="/api/system-admins/update-password" component={UpdateSystemAdminPassword} exact/>
//         <Route path="/api/complaints" component={ListComplaintComponent} exact/>
//         <Route path="/api/complaints/reply/:id" component={ReplyToComplaintComponent} exact />
//         <Route path="/api/company-admins/company-working-days" component={CalendarViewWorkingDaysComponent} exact/>
//         <Route path="/api/equipment/create/:id" component={CreateEquipmentComponent} exact />
//         <Route path="/api/equipment/update/:id" component={UpdateEquipmentComponent} exact />
//         <Route path="/api/companies/:id/create-reservation" component={CreatePredefinedReservation} exact />
//         <Route path="/api/company-admins/:id" component={CompanyAdminHomeComponent} exact />
        
        
        
//       </Switch>
//     </Router>

//     </div>
//   );
// }

// export default App;
