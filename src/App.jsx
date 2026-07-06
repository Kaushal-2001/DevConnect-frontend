import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { Login } from "./pages/Login";
import Profile from "./pages/Profile";
import { Signup } from "./pages/Signup";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Layout />} >
            <Route path="/Profile" element={ <Profile/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
