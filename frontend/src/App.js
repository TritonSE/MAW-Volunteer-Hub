/* eslint no-restricted-globals: "off" */
import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import has_auth_token from "./auth";
import { SITE_PAGES, SIDENAV_STEPS, SIDENAV_ROUTES } from "./constants/links";
import PageLayout from "./components/PageLayout";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import WishGrantingPage from "./pages/WishGrantingPage";
import Custom404Page from "./pages/Custom404Page";
import ManagePage from "./pages/ManagePage";
import WishStep from "./components/WishStep";

function ProtectedRoute({ isAuth, setIsAuth }) {
  const [hasFired, setHasFired] = useState(false);

  useEffect(async () => {
    if (localStorage.getItem("token")) {
      const res = await has_auth_token();
      setIsAuth(res && res.valid);
    }

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
    localStorage.removeItem("token");
    setIsAuth(false);
  }, []);

  return <Navigate to={SITE_PAGES.LOGIN} />;
}

function App() {
  const [isAuth, setIsAuth] = useState(false);

  function redirect_helper(base, to) {
    if (!isAuth) return;

    const paths = location.pathname.split("/");
    if (paths[paths.length - 1].trim() !== "" && base.indexOf(paths[paths.length - 1]) > -1) {
      location.pathname = `${base}/${to}`;
    }
  }

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
        />
        {/* Redirect to Manage Page, only when authenticated */}
        <Route exact path="/" element={<Navigate to={SITE_PAGES.MANAGE} />} />
        {/* Wish Granting Page */}
        <Route
          path={SITE_PAGES.WISH_GRANTING}
          element={
            <PageLayout>
              {redirect_helper(SITE_PAGES.WISH_GRANTING, SIDENAV_ROUTES[0])}
              <WishGrantingPage />
            </PageLayout>
          }
        >
          {SIDENAV_STEPS.map((name, ind) => (
            <Route
              key={name}
              path={ind === 0 ? "*" : SIDENAV_ROUTES[ind]}
              element={<WishStep stepName={`Step ${ind + 1}: ${name}`} />}
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
