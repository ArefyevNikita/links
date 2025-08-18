import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { CreateLinkForm } from '../ui/CreateLinkForm';
import { linksApi } from '@/shared/api/links';
import toast from 'react-hot-toast';

vi.mock('@/shared/api/links');
vi.mock('react-hot-toast');

const mockLinksApi = vi.mocked(linksApi);
const mockToast = vi.mocked(toast);

function renderWithProviders(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
}

describe('CreateLinkForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with all fields', () => {
    renderWithProviders(<CreateLinkForm />);

    expect(screen.getByRole('heading', { name: 'Создать короткую ссылку' })).toBeInTheDocument();
    expect(screen.getByLabelText(/URL для сокращения/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Дата истечения/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Создать короткую ссылку/ })).toBeInTheDocument();
  });

  it('shows validation error for invalid URL', async () => {
    renderWithProviders(<CreateLinkForm />);

    const urlInput = screen.getByLabelText(/URL для сокращения/);
    const submitButton = screen.getByRole('button', { name: /Создать короткую ссылку/ });

    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Введите корректный URL')).toBeInTheDocument();
    });

    expect(mockLinksApi.createLink).not.toHaveBeenCalled();
  });

  it('shows validation error for empty URL', async () => {
    renderWithProviders(<CreateLinkForm />);

    const submitButton = screen.getByRole('button', { name: /Создать короткую ссылку/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('URL обязателен')).toBeInTheDocument();
    });

    expect(mockLinksApi.createLink).not.toHaveBeenCalled();
  });

  it('shows validation error for past expiration date', async () => {
    renderWithProviders(<CreateLinkForm />);

    const urlInput = screen.getByLabelText(/URL для сокращения/);
    const expiresInput = screen.getByLabelText(/Дата истечения/);
    const submitButton = screen.getByRole('button', { name: /Создать короткую ссылку/ });

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.change(expiresInput, { target: { value: '2020-01-01T00:00' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Дата истечения должна быть в будущем')).toBeInTheDocument();
    });

    expect(mockLinksApi.createLink).not.toHaveBeenCalled();
  });

  it('successfully creates link and shows result', async () => {
    const mockLink = {
      id: '1',
      slug: 'abc123',
      shortUrl: 'http://localhost:3001/r/abc123',
      originalUrl: 'https://example.com',
      clicks: 0,
      createdAt: '2023-12-19T10:00:00.000Z',
      expiresAt: null,
    };

    mockLinksApi.createLink.mockResolvedValue(mockLink);

    renderWithProviders(<CreateLinkForm />);

    const urlInput = screen.getByLabelText(/URL для сокращения/);
    const submitButton = screen.getByRole('button', { name: /Создать короткую ссылку/ });

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Ссылка создана!')).toBeInTheDocument();
    });

    expect(screen.getByText('http://localhost:3001/r/abc123')).toBeInTheDocument();
    expect(screen.getByText('Перенаправляет на: https://example.com')).toBeInTheDocument();
    expect(mockToast.success).toHaveBeenCalledWith('Короткая ссылка создана!');
  });

  it('shows error toast on API failure', async () => {
    const errorMessage = 'API Error';
    mockLinksApi.createLink.mockRejectedValue(new Error(errorMessage));

    renderWithProviders(<CreateLinkForm />);

    const urlInput = screen.getByLabelText(/URL для сокращения/);
    const submitButton = screen.getByRole('button', { name: /Создать короткую ссылку/ });

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('allows creating another link after successful creation', async () => {
    const mockLink = {
      id: '1',
      slug: 'abc123',
      shortUrl: 'http://localhost:3001/r/abc123',
      originalUrl: 'https://example.com',
      clicks: 0,
      createdAt: '2023-12-19T10:00:00.000Z',
      expiresAt: null,
    };

    mockLinksApi.createLink.mockResolvedValue(mockLink);

    renderWithProviders(<CreateLinkForm />);

    const urlInput = screen.getByLabelText(/URL для сокращения/);
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Создать короткую ссылку/ }));

    await waitFor(() => {
      expect(screen.getByText('Ссылка создана!')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Создать ещё одну ссылку/ }));

    expect(screen.getByRole('heading', { name: 'Создать короткую ссылку' })).toBeInTheDocument();
    expect(screen.getByLabelText(/URL для сокращения/)).toBeInTheDocument();
  });
});
