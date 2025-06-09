import "./App.css";
import Home from "./pages/Home/Home.jsx";
import CreateTest from "./pages/CreateTest/CreateTest.js";
import Test from "./pages/Test/Test.js";
import Login from "./pages/Login/Login.js";
import Register from "./pages/Register/Register.js";

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test/:id" element={<Test />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateTest />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
