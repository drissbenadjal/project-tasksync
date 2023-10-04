import React from "react";
import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  createRoutesFromElements,
  createHashRouter,
  Route,
  RouterProvider,
  HashRouter,
} from "react-router-dom";

import { DragBar } from "./components/DragBar/DragBar";
import { Loader } from "./components/Loader/Loader";
import AuthPage from "./AuthPage";
import { LoginPage } from "./pages/Auth/Login";
import { RegisterPage } from "./pages/Auth/Register";
import { HomePage } from "./pages/Home/Home";
import { CalendarPage } from "./pages/Calendar/Calendar";
import { PremiumPage } from "./pages/Premium/Premium";
import { SettingsPage } from "./pages/Settings/Settings";

import { AuthProvider } from "./context/AuthContext";
import { TasksProvider } from "./context/TasksContext";
import "./samples/node-api";
import "./index.scss";

const rooter = createHashRouter(
  createRoutesFromElements([
    <Route path="/" element={<AuthPage />} />,
    <Route path="/login" element={<LoginPage />} />,
    <Route path="/register" element={<RegisterPage />} />,
    <Route path="/home" element={<HomePage />} />,
    <Route path="/calendar" element={<CalendarPage />} />,
    <Route path="/premium" element={<PremiumPage />} />,
    <Route path="/settings" element={<SettingsPage />} />,
    <Route path="/settings/:page" element={<SettingsPage />} />,
    <Route path="*" element={<AuthPage />} />,
  ])
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <TasksProvider>
        <DragBar />
        <Loader />
        <RouterProvider router={rooter} />
      </TasksProvider>
    </AuthProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
