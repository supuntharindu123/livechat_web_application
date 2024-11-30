import React from "react";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const loggout = () => {
    localStorage.removeItem("user:detail");
    localStorage.removeItem("user:token");
    navigate("/login");
  };
  return (
    <div className="w-full h-16 mr-auto rounded-sm bg-zinc-500">
      <button
        onClick={loggout}
        className=" hover:bg-gray-300 rounded shadow bg-white ml-10 my-3 py-1 text-center font-semibold text-xl px-5 border-2 border-gray-100 hover:{shadow-xl border-2}"
      >
        LogOut
      </button>
      {/* <button className=" hover:bg-gray-300 rounded shadow bg-white ml-10 my-3 py-1 text-center font-semibold text-xl px-5 border-2 border-gray-100 hover:{shadow-xl border-2}">
        Live Chat
      </button> */}
    </div>
  );
}

export default NavBar;
