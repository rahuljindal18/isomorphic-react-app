import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import routes from "./routes";
import NoMatch from "./NoMatch";
import Navbar from "./Navbar";

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          {routes.map(({ path, exact, component: C, ...rest }) => (
            <Route
              key={path}
              path={path}
              exact={exact}
              render={(props) => <C {...props} {...rest} />}
            />
          ))}
          <Route render={(props) => <NoMatch {...props} />} />
        </Switch>
      </div>
    );
  }
}
