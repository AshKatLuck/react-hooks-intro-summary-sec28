import React, { useContext } from "react";

import Ingredients from "./components/Ingredients/Ingredients";

import { AuthContext } from "./components/context/auth-context";
import Auth from "./components/Auth";

const App = (props) => {
  const authCtx = useContext(AuthContext);
  let content = <Auth />;

  if (authCtx.isAuth) {
    content = <Ingredients />;
  }

  return content;
};

export default App;
