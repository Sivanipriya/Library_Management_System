import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default Layout;
