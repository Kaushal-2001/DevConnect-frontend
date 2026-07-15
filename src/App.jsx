import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { Login } from "./pages/Login";
import Profile from "./pages/Profile";
import { Signup } from "./pages/Signup";
import { Provider } from "react-redux";
import { appStore } from "./utils/appStore";
import { Feed } from "./pages/Feed";
import { Toaster } from "./components/ui/sonner";

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
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}
export default App;
