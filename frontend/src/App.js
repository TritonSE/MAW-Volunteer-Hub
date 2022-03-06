import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";
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
import UserList from "./components/UserList";
import UserCardList from "./components/UserCardList";
import AssignBtn from "./components/AssignBtn";

import "./App.css";

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
  useEffect(async () => {
    await api_signout();
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
  const [isAdmin, setIsAdmin] = useState(false);
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
          path={SITE_PAGES.PROFILE}
          element={
            <PageLayout>
              <Outlet />
            </PageLayout>
          }
        >
          <Route path=":id" element={<ProfilePage isAdmin={isAdmin} />} />
          <Route path={SITE_PAGES.PROFILE} element={<ProfilePage isAdmin={isAdmin} />} />
        </Route>
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
