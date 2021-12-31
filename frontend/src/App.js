import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SITE_PAGES } from "./constants/links";

import PageLayout from "./components/PageLayout";
import LoginPage from "./pages/LoginPage";
import PeoplePage from "./pages/PeoplePage";
import ProfilePage from "./pages/ProfilePage";
import WishGrantingPage from "./pages/WishGrantingPage";
import Custom404Page from "./pages/Custom404Page";
 
function App() {
  return (
   <Router>
        {/* Switch gurantees that a URL can match to only one route */}
        <Switch>
            {/* Log In Page */}
            <Route exact path={[SITE_PAGES.LOGIN]}>
                <LoginPage />
            </Route>
            {/* People Page */}
            <Route exact path={SITE_PAGES.PEOPLE}>
                <PageLayout>
                    <PeoplePage />
                </PageLayout>
            </Route>
            {/* Profile Page */}
            <Route exact path={SITE_PAGES.PROFILE}>
                <PageLayout>
                    <ProfilePage />
                </PageLayout>
            </Route>
            {/* Wish Granting Page */}
            <Route exact path={SITE_PAGES.WISH_GRANTING}>
                <PageLayout>
                    <WishGrantingPage />
                </PageLayout>
            </Route>

            {/* Any other URL is automatically matched to 404 Page */}
            <Route path="/">
                <PageLayout>
                    <Custom404Page />
                </PageLayout>
            </Route>
        </Switch>
    </Router>
  );
}

export default App;