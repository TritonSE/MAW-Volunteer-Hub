import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { api_validtoken, api_signout } from "./api";
import {
  SITE_PAGES,
  SIDENAV_STEPS,
  SIDENAV_ROUTES,
  MANAGE_STEPS,
  MANAGE_ROUTES,
  RESOURCES_SIDENAV_ROUTES,
  RESOURCES_SIDENAV_STEPS,
  CONTACT_SIDENAV_ROUTES,
  CONTACT_SIDENAV_STEPS,
} from "./constants/links";
import PageLayout from "./components/PageLayout";
import LoginPage from "./pages/LoginPage";
import ResetPage from "./pages/ResetPage";
import ProfilePage from "./pages/ProfilePage";
import WishGrantingPage from "./pages/WishGrantingPage";
import Custom404Page from "./pages/Custom404Page";
import ManagePage from "./pages/ManagePage";
import CalendarPage from "./pages/CalendarPage";
import HomePage from "./pages/HomePage";
import ContactUsPage from "./pages/ContactUsPage";
import BoardMembersPage from "./pages/BoardMembersPage";
import ContactPointsPage from "./pages/ContactPointsPage";
import Message from "./components/Message";
import WishWednesday from "./components/WishWednesday";
import WishStep from "./components/WishStep";
import AdditionalResourcesPage from "./pages/AdditionalResourcesPage";
import { CurrentUser } from "./components/Contexts";

import "./App.css";

import UserManage from "./components/UserManage";

const MANAGE_COMPONENTS = [<UserManage />, <Message />, <WishWednesday />];

const CONTACT_COMPONENTS = [<BoardMembersPage />, <ContactPointsPage />];

function ProtectedRoute({
  needsPrimaryAdmin = false,
  dest = SITE_PAGES.LOGIN,
  children = null,
  useChildren = false,
  doCheck = true,
} = {}) {
  const [hasFired, setHasFired] = useState(false);
  const [currentUser, setCurrentUser] = useContext(CurrentUser);

  if (doCheck) {
    useEffect(() => {
      async function handleValidation() {
        const res = await api_validtoken();
        setCurrentUser(res ? res.user : null);
        setHasFired(true);
      }
      handleValidation();
    }, []);
  } else {
    useEffect(() => {
      setHasFired(true);
    }, [currentUser]);
  }

  if (!currentUser || (currentUser.admin !== 2 && needsPrimaryAdmin)) {
    if (hasFired) return <Navigate to={dest} />;
    return null;
  }
  return useChildren ? children : <Outlet />;
}

function SignoutHelper() {
  const [_currentUser, setCurrentUser] = useContext(CurrentUser);

  useEffect(() => {
    async function handleSignOut() {
      await api_signout();
      setCurrentUser();
    }
    handleSignOut();
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

        {/* Password Reset Page */}
        <Route path={`${SITE_PAGES.RESET}/:code`} element={<ResetPage />} />

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
                needsPrimaryAdmin
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
          <Route
            exact
            path={SITE_PAGES.HOME}
            element={
              <ProtectedRoute needsAdmin={false} dest={SITE_PAGES.HOME} useChildren doCheck={false}>
                <PageLayout>
                  <HomePage />
                </PageLayout>
              </ProtectedRoute>
            }
          />
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
          {/* Calendar Page */}
          <Route
            path={SITE_PAGES.CALENDAR}
            element={
              <PageLayout>
                <CalendarPage />
              </PageLayout>
            }
          />

          {/* Additional Resource Page */}
          <Route
            path={SITE_PAGES.RESOURCES}
            element={
              <PageLayout>
                <AdditionalResourcesPage />
              </PageLayout>
            }
          >
            <Route
              exact
              path={SITE_PAGES.RESOURCES}
              element={<Navigate to={`${SITE_PAGES.RESOURCES}/${RESOURCES_SIDENAV_ROUTES[0]}`} />}
            />
            {RESOURCES_SIDENAV_STEPS.map((name, ind) => (
              <Route
                exact
                key={name}
                path={RESOURCES_SIDENAV_ROUTES[ind]}
                element={<WishStep index={ind + 1} stepName={name} isResources />}
              />
            ))}
          </Route>

          {/* Contact Us Page */}
          <Route
            path={SITE_PAGES.CONTACT}
            element={
              <PageLayout>
                <ContactUsPage />
              </PageLayout>
            }
          >
            <Route
              exact
              path={SITE_PAGES.CONTACT}
              element={<Navigate to={`${SITE_PAGES.CONTACT}/${CONTACT_SIDENAV_ROUTES[0]}`} />}
            />
            {MANAGE_STEPS.map((name, ind) => (
              <Route
                exact
                key={name}
                path={CONTACT_SIDENAV_ROUTES[ind]}
                element={CONTACT_COMPONENTS[ind]}
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
