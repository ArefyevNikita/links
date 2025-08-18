import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router-dom';
import { Layout } from '@/app/ui/Layout';
import { CreateLinkPage } from '@/pages/create-link';
import { LinksPage } from '@/pages/links';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CreateLinkPage />,
      },
      {
        path: '/links',
        element: <LinksPage />,
      },
    ],
  },
]);

export function RouterProvider(): JSX.Element {
  return <ReactRouterProvider router={router} />;
}
