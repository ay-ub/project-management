import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Project from "./pages/Project";
import useUser from "./store/userStore";
import HomeDashboard from "./pages/HomeDashboard";
import { Loader } from "lucide-react";
import Profile from "./pages/Profile";
function App() {
  const { user, loading } = useUser();
  if (loading) {
    return <Loader className="animate-spin " />;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to={"/dashboard"} /> : <Navigate to={"/login"} />
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to={"/dashboard"} /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={"/dashboard"} /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardLayout /> : <Navigate to={"/login"} />}
        >
          <Route index element={<HomeDashboard />} />
          <Route path=":projectId" element={<Project />} />
          <Route path="profile/:user-name" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
