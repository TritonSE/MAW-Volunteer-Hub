/* eslint no-restricted-globals: "off" */
import React from "react";
import { Routes, Route } from "react-router-dom";
import { SITE_PAGES, SIDENAV_STEPS, SIDENAV_ROUTES } from "./constants/links";
import PageLayout from "./components/PageLayout";
import LoginPage from "./pages/LoginPage";
import PeoplePage from "./pages/PeoplePage";
import ProfilePage from "./pages/ProfilePage";
import WishGrantingPage from "./pages/WishGrantingPage";
import Custom404Page from "./pages/Custom404Page";
import WishStep from "./components/WishStep";

function App() {
  function redirect_helper(base, to) {
    const paths = location.pathname.split("/");
    if (base.indexOf(paths[paths.length - 1]) > -1) {
      location.pathname = `${base}/${to}`;
    }
  }

  return (
    <Routes>
      {/* Log In Page */}
      <Route exact path={SITE_PAGES.LOGIN} element={<LoginPage />} />
      {/* People Page */}
      <Route
        exact
        path={SITE_PAGES.PEOPLE}
        element={
          <PageLayout>
            <PeoplePage />
          </PageLayout>
        }
      />
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

      {/* Any other URL is automatically matched to 404 Page */}
      <Route
        path="*"
        element={
          <PageLayout>
            <Custom404Page />
          </PageLayout>
        }
      />
    </Routes>
  );
}

export default App;
