import { CreateLinkForm } from '@/widgets/create-link-form/ui/CreateLinkForm';

export function CreateLinkPage(): JSX.Element {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">URL Shortener</h1>
        <p className="text-gray-600 mt-2">
          Создавайте короткие ссылки для удобного обмена
        </p>
      </div>
      
      <CreateLinkForm />
    </div>
  );
}
