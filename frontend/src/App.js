import React from "react";
import { Routes, Route } from "react-router-dom";
import { SITE_PAGES, SIDENAV_STEPS } from "./constants/links";
import PageLayout from "./components/PageLayout";
import LoginPage from "./pages/LoginPage";
import PeoplePage from "./pages/PeoplePage";
import ProfilePage from "./pages/ProfilePage";
import WishGrantingPage from "./pages/WishGrantingPage";
import Custom404Page from "./pages/Custom404Page";
import WishStep from "./components/WishStep";

function App() {
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
            <WishGrantingPage />
          </PageLayout>
        }
      >
        {SIDENAV_STEPS.map((name, ind) => (
          <Route
            key={name}
            path={name.toLowerCase().replace(/ |&/g, "-")}
            element={<WishStep stepName={`Step ${ind + 1}: ${name}`} />}
          />
        ))}
        <Route
          path="*"
          element={
            <PageLayout>
              <Custom404Page />
            </PageLayout>
          }
        />
      </Route>

      {/* Any other URL is automatically matched to 404 Page */}
      <Route
        path="/"
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
