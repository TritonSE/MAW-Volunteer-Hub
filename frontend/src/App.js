import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { token_clear, api_validtoken } from "./auth";
import {
  SITE_PAGES,
  SIDENAV_STEPS,
  SIDENAV_ROUTES,
  MANAGE_STEPS,
  MANAGE_ROUTES,
} from "./constants/links";
import PageLayout from "./components/PageLayout";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import WishGrantingPage from "./pages/WishGrantingPage";
import Custom404Page from "./pages/Custom404Page";
import ManagePage from "./pages/ManagePage";
import WishStep from "./components/WishStep";

import "./App.css";

import UserManage from "./components/UserManage";

const MANAGE_COMPONENTS = [<UserManage />, <div>Message</div>, <div>Wish Wednesday</div>];

function ProtectedRoute({ isAuth, setIsAuth }) {
  const [hasFired, setHasFired] = useState(false);

  useEffect(async () => {
    setIsAuth(await api_validtoken());
    setHasFired(true);
  }, []);

  if (!isAuth) {
    if (hasFired) return <Navigate to={SITE_PAGES.LOGIN} />;
    return null;
  }
  return <Outlet />;
}

function SignoutHelper({ setIsAuth }) {
  useEffect(() => {
    token_clear();
    setIsAuth(false);
  }, []);

  return <Navigate to={SITE_PAGES.LOGIN} />;
}

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <Routes>
      {/* Log In Page */}
      <Route exact path={SITE_PAGES.LOGIN} element={<LoginPage setIsAuth={setIsAuth} />} />

      <Route exact path="/" element={<ProtectedRoute isAuth={isAuth} setIsAuth={setIsAuth} />}>
        {/* Profile Page */}
        <Route
          exact
          path={SITE_PAGES.PROFILE}
          element={
            <PageLayout>
              <ProfilePage />
            </PageLayout>
          }
        />
        {/* Manage Page */}
        <Route
          exact
          path={SITE_PAGES.MANAGE}
          element={
            <PageLayout>
              <ManagePage />
            </PageLayout>
          }
        >
          <Route
            exact
            path={SITE_PAGES.MANAGE}
            element={<Navigate to={`${SITE_PAGES.MANAGE}/${MANAGE_ROUTES[0]}`} />}
          />
          {MANAGE_STEPS.map((name, ind) => (
            <Route exact key={name} path={MANAGE_ROUTES[ind]} element={MANAGE_COMPONENTS[ind]} />
          ))}
        </Route>
        {/* Redirect to Manage Page, only when authenticated */}
        <Route exact path="/" element={<Navigate to={SITE_PAGES.MANAGE} />} />
        {/* Wish Granting Page */}
        <Route
          path={SITE_PAGES.WISH_GRANTING}
          element={
            <PageLayout>
              <WishGrantingPage />
            </PageLayout>
          }
        >
          <Route
            exact
            path={SITE_PAGES.WISH_GRANTING}
            element={<Navigate to={`${SITE_PAGES.WISH_GRANTING}/${SIDENAV_ROUTES[0]}`} />}
          />
          {SIDENAV_STEPS.map((name, ind) => (
            <Route
              exact
              key={name}
              path={SIDENAV_ROUTES[ind]}
              element={<WishStep index={ind + 1} stepName={name} />}
            />
          ))}
        </Route>

        {/* Sign out */}
        <Route exact path={SITE_PAGES.SIGNOUT} element={<SignoutHelper setIsAuth={setIsAuth} />} />

        {/* Any other URL is automatically matched to 404 Page */}
        <Route
          path="*"
          element={
            <PageLayout>
              <Custom404Page />
            </PageLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
