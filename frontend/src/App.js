import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/home.jsx";
import SignIn from "./Pages/signin.jsx";
import SignUp from "./Pages/signup.jsx";
import { LogProvider } from "./Components/logcontext.js";

function App() {
  return (
    <>
      <LogProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </LogProvider>
    </>
  );
}
export default App;
