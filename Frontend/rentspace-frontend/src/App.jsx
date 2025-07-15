import Homepage from './routes/homepage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Listpage from './routes/listpage';
import Layout from './layout/layout';
import SinglePage from './routes/singlepage';
import ProfilePage from './routes/profilePage';
import LandlordPage from './dashboard/landlordPage';
import Login from "./auth/Login";
import Register from './auth/Register';
import Landlord from './dashboard/Landlord';
import Tenants from './dashboard/Tenants';
import Property from './dashboard/Property';
import Profile from './dashboard/Profile';
import CreateProperty from './dashboard/components/CreateProperty';
import PropertyView from './dashboard/components/PropertyView';
import PropertyEdit from './dashboard/components/PropertyEdit';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Homepage /> },
        { path: "list", element: <Listpage /> },
        { path: "property/:id", element: <SinglePage /> },
        { path: "profile", element: <ProfilePage /> },
        {
          path: "landlord",
          element: (
            <PrivateRoute allowedRoles={["landlord"]}>
              <LandlordPage />
            </PrivateRoute>
          ),
          children: [
            { index: true, element: <Landlord /> },
            {
              path: "property",
              element: <Property />,
              children: [
                { path: "add", element: <CreateProperty /> },
                { path: "view/:id", element: <PropertyView /> },
                { path: "edit/:id", element: <PropertyEdit /> },
              ],
            },
            { path: "tenant", element: <Tenants /> },
            { path: "profile", element: <Profile /> },
          ],
        },
        { path: "*", element: <div>404 Not Found</div> }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
