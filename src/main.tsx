import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';
import MainScreenContainer from './screens/main_screen/MainScreenContainer.tsx';

// const Page1 = lazy(() =>
//   wait(1300).then(() => import("./screens/page1.tsx"))
// );

// const Page2 = lazy(() =>
//   wait(1300).then(() => import("./screens/page2.tsx"))
// );

const MainPage = lazy(() =>
  wait(1300).then(() => import("./screens/main_screen/MainScreenContainer.tsx"))
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainScreenContainer />,

    children: [
      {
        path: "/",
        element: <Navigate to="/dswd-counter/dashboard" />,
      },
      {
        path: "/dswd-counter/dashboard",
        element: <>
          <Suspense fallback={<Loader />}>
            <MainPage />
          </Suspense>
        </>,
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
