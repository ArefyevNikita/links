import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { copyToClipboard } from '@/shared/lib/utils';
import toast from 'react-hot-toast';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function CopyButton({ text, size = 'sm', variant = 'ghost' }: CopyButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      toast.success('Скопировано в буфер обмена');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('Не удалось скопировать');
    }
  };

  return (
    <Button
      onClick={handleCopy}
      size={size}
      variant={variant}
      className="flex items-center gap-1"
    >
      {copied ? (
        <Check size={16} className="text-green-600" />
      ) : (
        <Copy size={16} />
      )}
      {copied ? 'Скопировано' : 'Копировать'}
    </Button>
  );
}
