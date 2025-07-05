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

import DashboardHome from './dashboard/DashboardHome';
import PropertyLandlord from './dashboard/PropertyLandlord';
import TenantLandlord from './dashboard/TenantLandlord';
import ProfileLandlord from './dashboard/ProfileLandlord';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Homepage /> },
        { path: "list", element: <Listpage /> },
        { path: ":id", element: <SinglePage /> },
        { path: "profile", element: <ProfilePage /> },
        {
          path: "dashboard",
          element: <LandlordPage />,
          children: [
            { index: true, element: <DashboardHome /> },
            { path: "property", element: <PropertyLandlord /> },
            { path: "tenant", element: <TenantLandlord /> },
            { path: "profile", element: <ProfileLandlord /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
