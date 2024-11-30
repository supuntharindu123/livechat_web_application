import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Wall from "../images/wall1.png";
import Swal from "sweetalert2";

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlelogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 200) {
        Swal.fire({
          title: "Logging Successfully!",
          icon: "success",
        });
        navigate("/Chat");
        const resdata = await res.json();
        if (resdata) {
          console.log;
          localStorage.setItem("user:token", resdata.token);
          localStorage.setItem("user:detail", JSON.stringify(resdata.user));
        }
      } else if (res.status === 400) {
        const result = await res.json();
        Swal.fire({
          title: result.message,
          icon: "warning",
        });
      } else {
        Swal.fire({
          title: "An unexpected error occurred",
          icon: "warning",
        });
      }
    } catch (e) {
      Swal.fire({
        title: "Could not connect to the server.",
        icon: "warning",
      });
    }
  };

  return (
    <diV
      className="flex items-center justify-center bg-slate-100 h-[100%]"
      style={{ backgroundImage: `url(${Wall})` }}
    >
      <div className=" w-[35%] from-transparent border-spacing-2 border-black h-[50%] shadow-slate-700 shadow-lg rounded-md items-center justify-center p-6 my-16">
        <h1 className="text-3xl font-extrabold text-center underline">
          Sign Up
        </h1>
        <form class="w-full" onSubmit={handlelogin}>
          <div class="mb-4">
            <label
              for="email"
              class="block mb-2 text-lg font-medium text-gray-600"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full p-2 border rounded-md shadow-md shadow-slate-500 bg-amber-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div class="mb-4">
            <label
              for="password"
              class="block mb-2 text-lg font-medium text-gray-600"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              class="w-full p-2 border rounded-md shadow-md shadow-slate-500 bg-amber-50"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <button
            type="submit"
            class="px-8 py-2 mt-4 text-gray-800 font-semibold bg-amber-100 rounded-md hover:bg-amber-200 shadow-md shadow-slate-700 text-lg"
          >
            Login
          </button>
          <div className="flex m-3">
            <p className="text-xs font-normal text-gray-900">
              Donot Have An Account{" "}
              <span
                className="text-sky-900 hover:text-sky-600 hover:cursor-pointer hover:font-medium0"
                onClick={() => navigate("/")}
              >
                SignUp
              </span>
            </p>
          </div>
        </form>
      </div>
    </diV>
  );
}

export default Signin;
