import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from "./components/loader/loader.tsx";

const Dashboard = lazy(() =>
  wait(1300).then(() => import("./screens/Dashboard.tsx"))
);

const Page2 = lazy(() => wait(1300).then(() => import("./screens/page2.tsx")));

const router = createBrowserRouter([
  {
    path: "/dswd-counter/",
    element: <App />,

    children: [
      {
        path: "/dswd-counter/",
        element: <Navigate to="/dswd-counter/page1" />,
      },
      {
        path: "/dswd-counter/page1",
        element: (
          <>
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          </>
        ),
      },
      {
        path: "/dswd-counter/page2",
        element: (
          <>
            <Suspense fallback={<Loader />}>
              <Page2 />
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
