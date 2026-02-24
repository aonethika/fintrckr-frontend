import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

import React from 'react'

function NavbarLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default NavbarLayout
