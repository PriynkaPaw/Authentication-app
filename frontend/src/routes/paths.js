import { lazy } from "react";

const RouterPaths = {
  Signup: lazy(() => import("../pages/signup/Signup")),
  Login: lazy(() => import("../pages/login/Login")),
};

export default RouterPaths;
