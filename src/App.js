import React from 'react';
import UserLoginPage from './pages/login/LogIn';
import {Route, Switch} from "react-router-dom";
import Console from './pages/console/index';

function App() {
  return (
      <Switch>
        <Route exact path={"/login"} component={UserLoginPage}/>
        <Route exact path={"/console/overview"} component={Console}/>
      </Switch>
  );
}

export default App;