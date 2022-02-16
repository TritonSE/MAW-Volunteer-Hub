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
import UserLink from "./components/UserLink";
import AssignBtn from "./components/AssignBtn";

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
  return [
    {
      Name: "Admin 1 (Carly)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: true,
      // Completed: 3,
      // Start: "May 2017",
    },
    {
      Name: "Admin 2 (Gibson)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: true,
      // Roles: [<ButtonContainer btnLabels={["Airport Greeter", "Wish Granter"]} />],
      // Completed: 1,
      // Start: "Feb 2019",
    },
    {
      Name: "Admin 3 (Freddie)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: true,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Meeter"]} />],
      // Completed: 2,
      // Start: "June 2016",
    },
    {
      Name: "Admin 4 (Bob)",
      Admin: true,
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      // Roles: [<ButtonContainer btnLabels={["Wish Granter"]} />],
      // Completed: 2,
      // Start: "May 2020",
    },
    {
      Name: "Volunteer 1 (Bob)",
      Admin: false,
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 2 (Rob)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 3 (Freddie)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 4 (Rib)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 5 (Pete)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 6 (Alice)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 7 (Carlos)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 8 (David)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 9 (Erin)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 10 (Frank)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 11 (Grace)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
    {
      Name: "Volunteer 12 (Hank)",
      Roles: [<ButtonContainer btnLabels={["Allow Access"]} />],
      Admin: false,
      // Roles: [<ButtonContainer btnLabels={["Wish Granter", "Airport Greeter"]} />],
      // Completed: 2,
      // Start: "June 2020",
    },
  ];
}

const userData = getUserData();

const headers = [
  {
    Header: "Name",
    accessor: "Name",
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
  {
    Header: "",
    accessor: "empty1",
  },
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
              element={<UserList tableHeaders={headers} userData={userData} />}
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
