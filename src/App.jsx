import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { Login } from "./pages/Login";
import Profile from "./pages/Profile";
import { Signup } from "./pages/Signup";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";
import Feed from "./pages/Feed";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Feed/>}/>
              <Route path="/Profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}
export default App;
