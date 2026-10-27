import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthorLayout from '../components/layout/AuthorLayout.jsx';
import MyBooksPage from '../features/books/MyBooksPage.jsx';
import MyTicketsPage from '../features/tickets/MyTicketsPage.jsx';
import SubmitQueryPage from '../features/tickets/SubmitQueryPage.jsx';
import AdminLayout from '../components/layout/AdminLayout.jsx';
import TicketQueuePage from '../features/admin/TicketQueuePage.jsx';
import LoginPage from '../features/auth/LoginPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute requiredRole="author">
        <AuthorLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/books" replace />,
      },
      {
        path: 'books',
        element: <MyBooksPage />,
      },
      {
        path: 'tickets',
        element: <MyTicketsPage />,
      },
      {
        path: 'tickets/new',
        element: <SubmitQueryPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <TicketQueuePage />,
      },
      {
        path: 'queue',
        element: <TicketQueuePage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/books" replace />,
  },
]);
