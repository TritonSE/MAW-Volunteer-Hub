import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";
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

import UserList from "./components/UserList";
import UserCardList from "./components/UserCardList";
import AssignBtn from "./components/AssignBtn";

import "./App.css";

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

function ButtonContainer({ btnLabels }) {
  return (
    <ScrollContainer className="assign_btn_container" vertical={false}>
      {btnLabels.map((label) => (
        <AssignBtn label={label} key={Math.random()} />
      ))}
    </ScrollContainer>
  );
}

// NOTE: This is just a temporary implementation for the MVP
function getUserData() {
  const adminNames = ["Carly", "Gibson", "Freddie", "Bob"];
  const volunteerNames = [
    "Bob",
    "Rob",
    "Freddie",
    "Rib",
    "Pete",
    "Alice",
    "Carlos",
    "David",
    "Erin",
    "Frank",
    "Hank",
    "Grace",
  ];
  const users = [];

  adminNames.map((name, ind) =>
    users.push({
      Name: "Admin " + (ind + 1) + " (" + name + ")",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: true,
      Completed: ind,
      Start: "May 2017",
    })
  );

  volunteerNames.map((name, ind) =>
    users.push({
      Name: "Volunteer " + (ind + 1) + " (" + name + ")",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      Completed: ind,
      Start: "May 2017",
    })
  );
  return users;
}

const userData = getUserData();

const headers = [
  {
    Header: "Name",
    accessor: "Name",
    Cell: (e) => (
      <a className="user_link" href="/">
        {e.value}
      </a>
    ),
  },
  // Replace the following three rows with the commented out rows for the full table
  {
    Header: "",
    accessor: "Roles",
  },
  {
    Header: "",
    accessor: "empty",
  },
  // {
  //   Header: "",
  //   accessor: "empty1",
  // },
  // {
  //   Header: "Roles",
  //   accessor: "Roles",
  // },
  // {
  //   Header: "Assignments Completed",
  //   accessor: "Completed",
  // },
  // {
  //   Header: "Volunteer Since",
  //   accessor: "Start",
  // },
];

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Updates the windowWidth variable if the window is resized
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            <Route
              exact
              key={name}
              path={MANAGE_ROUTES[ind]}
              element={
                windowWidth > 650 ? (
                  <UserList tableHeaders={headers} userData={userData} />
                ) : (
                  <UserCardList userData={userData} />
                )
              }
            />
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
