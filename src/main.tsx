import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./index.css";
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from "./components/loader/loader.tsx";

const Dashboard = lazy(() =>
  wait(1300).then(() => import("./screens/Dashboard.tsx"))
);


const router = createBrowserRouter([
  {
    path: "/dswd-counter/",
    element: <Dashboard />,

    children: [
      {
        path: "/dswd-counter/",
        element: <Navigate to="/dswd-counter/dashboard" />,
      },
      {
        path: "/dswd-counter/dashboard",
        element: (
          <>
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          </>
        ),
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
