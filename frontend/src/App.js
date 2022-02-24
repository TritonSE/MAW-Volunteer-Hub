import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { token_clear, api_validtoken } from "./auth";
import { SITE_PAGES, SIDENAV_STEPS, SIDENAV_ROUTES } from "./constants/links";
import PageLayout from "./components/PageLayout";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import WishGrantingPage from "./pages/WishGrantingPage";
import Custom404Page from "./pages/Custom404Page";
import ManagePage from "./pages/ManagePage";
import WishStep from "./components/WishStep";

function ProtectedRoute({
  isAuth,
  setIsAuth,
  isAdmin,
  setIsAdmin,

  needsAdmin = false,
  dest = SITE_PAGES.LOGIN,
  children = null,
  useChildren = false,
  doCheck = true,
} = {}) {
  const [hasFired, setHasFired] = useState(false);

  if (doCheck) {
    useEffect(async () => {
      const res = (await api_validtoken()) ?? { valid: false, admin: false };
      setIsAuth(res.valid);
      setIsAdmin(res.admin);
      setHasFired(true);
    }, []);
  } else {
    useEffect(() => {
      setHasFired(true);
    }, [isAuth, isAdmin]);
  }

  if (!isAuth || (!isAdmin && needsAdmin)) {
    if (hasFired) return <Navigate to={dest} />;
    return null;
  }
  return useChildren ? children : <Outlet />;
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
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Routes>
      {/* Log In Page */}
      <Route
        exact
        path={SITE_PAGES.LOGIN}
        element={<LoginPage setIsAuth={setIsAuth} setIsAdmin={setIsAdmin} />}
      />

      <Route
        exact
        path="/"
        element={
          <ProtectedRoute
            isAuth={isAuth}
            setIsAuth={setIsAuth}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
          />
        }
      >
        {/* Profile Page */}
        <Route
          exact
          path={SITE_PAGES.PROFILE}
          element={
            <PageLayout isAdmin={isAdmin}>
              <ProfilePage />
            </PageLayout>
          }
        />
        {/* Manage Page */}
        <Route
          exact
          path={SITE_PAGES.MANAGE}
          element={
            <ProtectedRoute
              isAuth={isAuth}
              isAdmin={isAdmin}
              needsAdmin
              dest={SITE_PAGES.WISH_GRANTING}
              useChildren
              doCheck={false}
            >
              <PageLayout isAdmin={isAdmin}>
                <ManagePage />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        {/* Redirect to Manage Page, only when authenticated */}
        <Route exact path="/" element={<Navigate to={SITE_PAGES.MANAGE} />} />
        {/* Wish Granting Page */}
        <Route
          path={SITE_PAGES.WISH_GRANTING}
          element={
            <PageLayout isAdmin={isAdmin}>
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
            <PageLayout isAdmin={isAdmin}>
              <Custom404Page />
            </PageLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
