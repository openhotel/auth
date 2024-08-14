import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import { LayoutComponent } from "../layout";
import { NotFoundComponent } from "../not-found";
import { LoginComponent } from "modules/login";
import { RegisterComponent } from "modules/register";
import { HomeComponent } from "modules/home";
import { RedirectComponent } from "shared/components";

const router = createBrowserRouter([
  {
    element: <LayoutComponent />,
    path: "/",
    children: [
      {
        path: "/login",
        Component: () => <LoginComponent />,
      },
      {
        path: "/register",
        Component: () => <RegisterComponent />,
      },
      {
        path: "/",
        Component: () => <HomeComponent />,
      },
      {
        path: "/404",
        Component: () => <NotFoundComponent />,
      },
      { path: "*", Component: () => <RedirectComponent url="/404" /> },
    ],
  },
]);

export const RouterComponent: React.FC<any> = ({ children }) => (
  <RouterProvider router={router}>${children}</RouterProvider>
);
