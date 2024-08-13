import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import React from "react";
import { LayoutComponent } from "../layout";
import { NotFoundComponent } from "../not-found";
import { LoginComponent } from "modules/login";
import { RegisterComponent } from "modules/register";

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
        Component: () => <Navigate to="/login" />,
      },
      {
        path: "/404",
        Component: () => <NotFoundComponent />,
      },
      { path: "*", Component: () => <Navigate to="/404" /> },
    ],
  },
]);

export const RouterComponent: React.FC = ({ children }) => (
  <RouterProvider router={router}>${children}</RouterProvider>
);
