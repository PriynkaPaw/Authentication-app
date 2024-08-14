import { lazy } from "react";

const RouterPaths = {
  Signup: lazy(() => import("../pages/signup/Signup")),
  Login: lazy(() => import("../pages/login/Login")),
  Home: lazy(() => import("../pages/home/Home")),
};

export default RouterPaths;
