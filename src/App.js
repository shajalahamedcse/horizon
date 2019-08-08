import React from 'react';
import UserLoginPage from './pages/LogIn';
import {Route, Switch} from "react-router-dom";

function App() {
  return (
      <Switch>
        <Route exact path={"/login"} component={UserLoginPage}/>
      </Switch>
  );
}

export default App;