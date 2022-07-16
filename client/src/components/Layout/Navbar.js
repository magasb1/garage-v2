import React from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/reducers/authSlice";


const Navbar = () => {
  const auth = useSelector(selectAuth);
  return (
    <>
      <nav className="inline-flex items-center justify-between py-2 px-6 bg-white border-b shadow-lg w-full">
        <div className="mb-2 sm:mb-0">
          <a
            href="/"
            className="text-2xl no-underline text-grey-darkest hover:text-blue-dark"
          >
            Garage
          </a>
        </div>
        <div className="gap-4">
          <span className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2 capitalize">
            {auth?.user?.username}
          </span>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
