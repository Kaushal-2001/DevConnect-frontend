import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/login";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path="/login" element={<Login />} />
            <Route path="/Profile" element={ <Profile/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
