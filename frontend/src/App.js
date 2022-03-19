import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { api_validtoken, api_signout } from "./auth";
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
import { CurrentUser } from "./components/Contexts";

import "./App.css";

import UserManage from "./components/UserManage";

const MANAGE_COMPONENTS = [<UserManage />, <div>Message</div>, <div>Wish Wednesday</div>];

function ProtectedRoute({
  needsAdmin = false,
  dest = SITE_PAGES.LOGIN,
  children = null,
  useChildren = false,
  doCheck = true,
} = {}) {
  const [hasFired, setHasFired] = useState(false);
  const [currentUser, setCurrentUser] = useContext(CurrentUser);

  if (doCheck) {
    useEffect(async () => {
      const res = await api_validtoken();
      setCurrentUser(res ? res.user : null);
      setHasFired(true);
    }, []);
  } else {
    useEffect(() => {
      setHasFired(true);
    }, [currentUser]);
  }

  if (!currentUser || (!currentUser.admin && needsAdmin)) {
    if (hasFired) return <Navigate to={dest} />;
    return null;
  }
  return useChildren ? children : <Outlet />;
}

function SignoutHelper() {
  const [_currentUser, setCurrentUser] = useContext(CurrentUser);

  useEffect(async () => {
    await api_signout();
    setCurrentUser();
  }, []);

  return <Navigate to={SITE_PAGES.LOGIN} />;
}

function App() {
  const currentUser = useState();

  return (
    <CurrentUser.Provider value={currentUser}>
      <Routes>
        {/* Log In Page */}
        <Route exact path={SITE_PAGES.LOGIN} element={<LoginPage />} />

        <Route exact path="/" element={<ProtectedRoute />}>
          {/* Profile Page */}
          <Route
            path={SITE_PAGES.PROFILE}
            element={
              <PageLayout>
                <Outlet />
              </PageLayout>
            }
          >
            <Route path=":id" element={<ProfilePage />} />
            <Route path={SITE_PAGES.PROFILE} element={<ProfilePage />} />
          </Route>
          {/* Manage Page */}
          <Route
            exact
            path={SITE_PAGES.MANAGE}
            element={
              <ProtectedRoute
                needsAdmin
                dest={SITE_PAGES.WISH_GRANTING}
                useChildren
                doCheck={false}
              >
                <PageLayout>
                  <ManagePage />
                </PageLayout>
              </ProtectedRoute>
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
          <Route exact path={SITE_PAGES.SIGNOUT} element={<SignoutHelper />} />

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
    </CurrentUser.Provider>
  );
}

export default App;
