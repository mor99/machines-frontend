import React, {Component,} from "react";
import {hot,} from "react-hot-loader";
import {Route, withRouter, Switch, Redirect,} from "react-router-dom";
import Login from "app/login";
import Home from "app/home";
import Cookies from "js-cookie";

@withRouter
class App extends Component {
  render() {
    const Token = Cookies.get("SystemToken");
    return (
      <div className="index">
        <Switch>
          <Route
            path="/login"
            render={
              () => {
                return Token ? <Redirect to="/home" /> : <Login />;
              }
            }
          />
          <Route
            path="/"
            render={
              () => {
                return Token ? <Home />: (
                  <Redirect to="/login" />
                );
              }
            }
          />
          <Route render={
            () => {
              return Token ? (<Redirect to="/" />) : (
                <Redirect to="/login" />
              );
            }
          }
          />
        </Switch>
      </div>
    );
  }
}

export default hot(module)(App);
