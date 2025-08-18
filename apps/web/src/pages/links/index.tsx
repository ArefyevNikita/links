import { LinksTable } from '@/widgets/links-table/ui/LinksTable';

export function LinksPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Мои ссылки</h1>
        <p className="text-gray-600 mt-1">
          Управляйте созданными короткими ссылками
        </p>
      </div>
      
      <LinksTable />
    </div>
  );
}
