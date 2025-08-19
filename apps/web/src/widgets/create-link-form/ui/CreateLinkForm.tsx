import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { linksApi } from '@/shared/api/links';
import { isValidUrl } from '@/shared/lib/utils';
import { CopyButton } from '@/features/copy-link/ui/CopyButton';
import toast from 'react-hot-toast';
import type { CreateLinkRequest, Link } from '@/shared/types/link';

interface FormData {
  originalUrl: string;
  expiresAt?: string;
}

export function CreateLinkForm(): JSX.Element {
  const [createdLink, setCreatedLink] = useState<Link | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const createMutation = useMutation({
    mutationFn: (data: CreateLinkRequest) => linksApi.createLink(data),
    onSuccess: (link) => {
      setCreatedLink(link);
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Короткая ссылка создана!');
      reset();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Ошибка при создании ссылки');
    },
  });

  const onSubmit = (data: FormData): void => {
    const request: CreateLinkRequest = {
      originalUrl: data.originalUrl,
    };

    if (data.expiresAt) {
      const date = new Date(data.expiresAt);
      
      if (!isNaN(date.getTime())) {
        request.expiresAt = date.toISOString();
      }
    }

    createMutation.mutate(request);
  };

  const handleNewLink = (): void => {
    setCreatedLink(null);
  };

  if (createdLink) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ссылка создана!
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-sm text-gray-600 mb-2">Короткая ссылка:</div>
            <div className="flex items-center justify-center gap-2">
              <code className="text-primary-600 font-mono text-lg">
                {createdLink.shortUrl}
              </code>
              <CopyButton text={createdLink.shortUrl} variant="primary" />
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            Перенаправляет на: {createdLink.originalUrl}
          </div>
          
          <Button onClick={handleNewLink} variant="secondary">
            Создать ещё одну ссылку
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Создать короткую ссылку
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="URL для сокращения"
          placeholder="https://example.com/very/long/url"
          error={errors.originalUrl?.message}
          {...register('originalUrl', {
            required: 'URL обязателен',
            validate: (value) => {
              if (!isValidUrl(value)) {
                return 'Введите корректный URL';
              }
              return true;
            },
          })}
        />
        
        <Input
          label="Дата истечения (необязательно)"
          type="datetime-local"
          error={errors.expiresAt?.message}
          helperText="Если не указано, ссылка будет действовать бессрочно"
          {...register('expiresAt', {
            validate: (value) => {
              if (!value) return true;
              
              const expirationDate = new Date(value);
              
              if (isNaN(expirationDate.getTime())) {
                return 'Введите корректную дату';
              }
              
              if (expirationDate <= new Date()) {
                return 'Дата истечения должна быть в будущем';
              }
              return true;
            },
          })}
        />
        
        <Button
          type="submit"
          loading={createMutation.isPending}
          className="w-full"
        >
          Создать короткую ссылку
        </Button>
      </form>
    </Card>
  );
}
