import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouterPathName from "./config";
import RouterPaths from "./paths";
function Router() {
  return (
    <div>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route
              path={RouterPathName.signup}
              element={<RouterPaths.Signup />}
            />
            <Route
              path={RouterPathName.login}
              element={<RouterPaths.Login />}
            />
            <Route path={RouterPathName.home} element={<RouterPaths.Home />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default Router;
