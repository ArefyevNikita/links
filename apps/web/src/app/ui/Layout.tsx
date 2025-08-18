import { Outlet, Link, useLocation } from 'react-router-dom';
import { LinkIcon } from 'lucide-react';
import { clsx } from 'clsx';

export function Layout(): JSX.Element {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Создать ссылку' },
    { path: '/links', label: 'Мои ссылки' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <LinkIcon className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">URL Shortener</h1>
            </div>
            
            <nav className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            URL Shortener - Простой сервис для создания коротких ссылок
          </p>
        </div>
      </footer>
    </div>
  );
}
