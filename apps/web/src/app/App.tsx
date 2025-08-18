import { Toaster } from 'react-hot-toast';
import { QueryProvider } from './providers/QueryProvider';
import { RouterProvider } from './providers/RouterProvider';

export function App(): JSX.Element {
  return (
    <QueryProvider>
      <RouterProvider />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryProvider>
  );
}
