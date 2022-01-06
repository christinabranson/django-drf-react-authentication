import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./Layout/PublicLayout";
import PrivateLayout from "./Layout/PrivateLayout";
import Login from "./Login";
import Stub from "./Stub";

const PrivateRoute = ({ children }) => {
  const auth = true; // TODO will implement user context auth in the next commit
  if (!auth) {
    return <Navigate to="/" />;
  }

  return <PrivateLayout>{children}</PrivateLayout>;
};

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/stub"
        element={
          <PrivateRoute>
            <Stub />
          </PrivateRoute>
        }
      />
      <Route render={() => <h1>Page not found</h1>} />
    </Routes>
  </BrowserRouter>
);

export default Router;
