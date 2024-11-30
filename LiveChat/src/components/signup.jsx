import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Wall from "../images/wall1.png";
import Swal from "sweetalert2";

function Signup() {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          phonenumber: phoneNumber,
          email: email,
          password: password,
        }),
      });

      if (res.status === 400) {
        const result = await res.json();
        Swal.fire({
          title: result.message,
          icon: "warning",
        });
      } else if (res.status === 200) {
        Swal.fire({
          title: "Registation Sucussfull!",
          icon: "success",
        });
        navigate("/login");

        setUsername(""), setEmail(""), setPhoneNumber("");
        setPassword("");
      } else {
        Swal.fire({
          title: "An unexpected error occurred",
          icon: "warning",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Could not connect to the server.",
        icon: "warning",
      });
    }
  };

  const ToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <diV
        className="flex items-center justify-center bg-white h-[100%]"
        style={{ backgroundImage: `url(${Wall})` }}
      >
        <div className=" w-[35%] from-transparent border-spacing-2 border-black h-[75%] shadow-slate-700 shadow-lg rounded-md items-center justify-center p-6 my-16">
          <h1 className="text-3xl font-bold text-center text-gray-900 underline">
            Sign Up
          </h1>
          <form class="w-full" onSubmit={(e) => HandleSubmit(e)}>
            <div class="mb-4">
              <label
                for="username"
                class="block mb-2 text-lg font-medium text-gray-600"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                class="w-full p-2 border rounded-md shadow-md shadow-slate-500 bg-amber-50"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div class="mb-4">
              <label
                for="phoneNumber"
                class="block mb-2 text-lg font-medium text-gray-600"
              >
                PhoneNumber:
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                className="w-full p-2 border rounded-md shadow-md shadow-slate-500 bg-amber-50"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

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
                value={email}
                class="w-full p-2 border rounded-md shadow-md shadow-slate-500 bg-amber-50"
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
                value={password}
                class="w-full p-2 border rounded-md shadow-md shadow-slate-500 bg-amber-50"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              class="px-8 py-2 mt-4 text-gray-800 font-semibold bg-amber-100 rounded-md hover:bg-amber-200 shadow-md shadow-slate-700 text-lg"
            >
              Register
            </button>
            <div className="flex m-3">
              <p className="text-xs font-normal text-gray-900">
                Already Have An Account?{" "}
                <span
                  className=" text-sky-900 hover:text-sky-600 hover:cursor-pointer hover:font-medium"
                  onClick={ToLogin}
                >
                  Signin
                </span>
              </p>
            </div>
          </form>
        </div>
      </diV>
    </>
  );
}

export default Signup;
