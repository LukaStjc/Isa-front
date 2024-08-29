import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { Redirect } from 'react-router-dom';

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      user: JSON.parse(localStorage.getItem('user')) || {},
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    const { user } = this.state; 

    if ((user && user.roles && (user.roles.includes('ROLE_REGISTERED_USER'))))
    {
      return (
        <div className="container">
          <header className="jumbotron">
            <h3>User profile</h3>
          </header>
        </div>
      );
    }
    else {
      return <Redirect to="/api/companies" />;
    }
  }
}
