import { useState } from "react";
import "./App.css";
import Signup from "./components/signup";
import Signin from "./components/signin";
import NavBar from "./components/header";
import Chat from "./components/chat";
import { Route, Routes, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div className="h-screen">
                <Signup></Signup>
              </div>
            }
          />
          <Route
            path="/Login"
            element={
              <div className="h-screen">
                <Signin></Signin>
              </div>
            }
          />
          <Route
            path="/chat"
            element={
              <div className="h-screen">
                <NavBar></NavBar>
                <Chat></Chat>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
