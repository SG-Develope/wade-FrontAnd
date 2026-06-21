import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '@/App';
import Dashboard from '@/pages/Dashboard';
import Trends from '@/pages/Trends';
import Leisure from '@/pages/Leisure';
import Weather from '@/pages/Weather';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'weather',   element: <Weather /> },
      { path: 'trends',    element: <Trends /> },
      { path: 'leisure',   element: <Leisure /> },
    ],
  },
]);

export default router;
