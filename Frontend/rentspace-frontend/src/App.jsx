import Homepage from './routes/homepage'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Listpage from './routes/listpage';
import Layout from './layout/layout';
import SinglePage from './routes/singlepage';
import ProfilePage from './routes/profilePage';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path: "/",
          element: <Homepage />
        },
        {
          path: "/list",
          element: <Listpage />
        },
        {
          path: "/:id",
          element: < SinglePage />
        },
        {
          path: "/profile",
          element: <ProfilePage/>
        },
      ]
    },
  ]);
  return(
    <RouterProvider router={router}/>
  );
}

export default App
