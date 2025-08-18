import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { linksApi } from '@/shared/api/links';
import { formatRelativeTime } from '@/shared/lib/utils';
import { CopyButton } from '@/features/copy-link/ui/CopyButton';
import { DeleteButton } from '@/features/delete-link/ui/DeleteButton';
import type { Link } from '@/shared/types/link';

export function LinksTable(): JSX.Element {
  const { data, isLoading, error } = useQuery({
    queryKey: ['links'],
    queryFn: () => linksApi.getLinks({ limit: 50, offset: 0 }),
  });

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
            data-testid="loading-spinner"
          />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-red-600">
          <p>Ошибка при загрузке ссылок</p>
          <p className="text-sm text-gray-500 mt-1">
            {error instanceof Error ? error.message : 'Неизвестная ошибка'}
          </p>
        </div>
      </Card>
    );
  }

  if (!data?.links?.length) {
    return (
      <Card className="p-8">
        <div className="text-center text-gray-500">
          <p>Ссылки пока не созданы</p>
          <p className="text-sm mt-1">Создайте свою первую короткую ссылку</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Ваши ссылки</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ссылка
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Оригинальный URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Клики
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Создано
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.links.map((link: Link) => (
              <LinkTableRow key={link.id} link={link} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function LinkTableRow({ link }: { link: Link }): JSX.Element {
  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

  return (
    <tr className={isExpired ? 'opacity-50' : ''}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {link.slug}
            </code>
            {isExpired && (
              <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded">
                Истекла
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1 font-mono">
            {link.shortUrl}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="max-w-xs truncate text-sm text-gray-900">
            {link.originalUrl}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(link.originalUrl, '_blank')}
          >
            <ExternalLink size={14} />
          </Button>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{link.clicks}</span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-500">
          {formatRelativeTime(link.createdAt)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <CopyButton text={link.shortUrl} />
          <DeleteButton linkId={link.id} />
        </div>
      </td>
    </tr>
  );
}
