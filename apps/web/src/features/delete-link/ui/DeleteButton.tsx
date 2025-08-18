import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/ui/Button';
import { linksApi } from '@/shared/api/links';
import toast from 'react-hot-toast';

interface DeleteButtonProps {
  linkId: string;
  onDeleted?: () => void;
}

export function DeleteButton({ linkId, onDeleted }: DeleteButtonProps): JSX.Element {
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => linksApi.deleteLink(linkId),
    onSuccess: () => {
      toast.success('Ссылка удалена');
      queryClient.invalidateQueries({ queryKey: ['links'] });
      onDeleted?.();
      setShowConfirm(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Ошибка при удалении');
    },
  });

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={() => deleteMutation.mutate()}
          loading={deleteMutation.isPending}
          variant="danger"
          size="sm"
        >
          Удалить
        </Button>
        <Button
          onClick={() => setShowConfirm(false)}
          variant="ghost"
          size="sm"
        >
          Отмена
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => setShowConfirm(true)}
      variant="ghost"
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 size={16} />
    </Button>
  );
}
