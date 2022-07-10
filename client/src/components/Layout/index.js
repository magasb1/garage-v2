import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children, payload }) => {
  return (
    <>
      <div className="flex flex-col w-full">
        <Navbar payload={payload} />
        {children}
      </div>
    </>
  );
};

export default Layout;
