import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { LinksTable } from '../ui/LinksTable';
import { linksApi } from '@/shared/api/links';

vi.mock('@/shared/api/links');

const mockLinksApi = vi.mocked(linksApi);

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

const mockLinks = {
  links: [
    {
      id: '1',
      slug: 'abc123',
      shortUrl: 'http://localhost:3001/r/abc123',
      originalUrl: 'https://example.com/test',
      clicks: 5,
      createdAt: '2023-12-19T10:00:00.000Z',
      expiresAt: null,
    },
    {
      id: '2',
      slug: 'def456',
      shortUrl: 'http://localhost:3001/r/def456',
      originalUrl: 'https://example.com/another',
      clicks: 10,
      createdAt: '2023-12-18T15:30:00.000Z',
      expiresAt: '2024-12-31T23:59:59.000Z',
    },
  ],
};

describe('LinksTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    mockLinksApi.getLinks.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<LinksTable />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows error state', async () => {
    const errorMessage = 'API Error';
    mockLinksApi.getLinks.mockRejectedValue(new Error(errorMessage));

    renderWithProviders(<LinksTable />);

    await waitFor(() => {
      expect(screen.getByText('Ошибка при загрузке ссылок')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows empty state when no links', async () => {
    mockLinksApi.getLinks.mockResolvedValue({ links: [] });

    renderWithProviders(<LinksTable />);

    await waitFor(() => {
      expect(screen.getByText('Ссылки пока не созданы')).toBeInTheDocument();
      expect(screen.getByText('Создайте свою первую короткую ссылку')).toBeInTheDocument();
    });
  });

  it('renders links table with data', async () => {
    mockLinksApi.getLinks.mockResolvedValue(mockLinks);

    renderWithProviders(<LinksTable />);

    await waitFor(() => {
      expect(screen.getByText('Ваши ссылки')).toBeInTheDocument();
    });

    expect(screen.getByText('Ссылка')).toBeInTheDocument();
    expect(screen.getByText('Оригинальный URL')).toBeInTheDocument();
    expect(screen.getByText('Клики')).toBeInTheDocument();
    expect(screen.getByText('Создано')).toBeInTheDocument();
    expect(screen.getByText('Действия')).toBeInTheDocument();

    expect(screen.getByText('abc123')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/test')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('def456')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/another')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows external link buttons', async () => {
    mockLinksApi.getLinks.mockResolvedValue(mockLinks);

    renderWithProviders(<LinksTable />);

    await waitFor(() => {
      expect(screen.getByText('Ваши ссылки')).toBeInTheDocument();
    });

    const externalLinkButtons = screen.getAllByRole('button');
    const firstExternalButton = externalLinkButtons.find(button => 
      button.querySelector('svg') && !button.textContent?.includes('Копировать')
    );

    expect(firstExternalButton).toBeInTheDocument();
  });

  it('shows copy and delete buttons for each link', async () => {
    mockLinksApi.getLinks.mockResolvedValue(mockLinks);

    renderWithProviders(<LinksTable />);

    await waitFor(() => {
      expect(screen.getByText('Ваши ссылки')).toBeInTheDocument();
    });

    const copyButtons = screen.getAllByText('Копировать');
    expect(copyButtons).toHaveLength(2);

    const deleteButtons = screen.getAllByRole('button').filter(button =>
      button.querySelector('svg') && button.className.includes('text-red-600')
    );
    expect(deleteButtons).toHaveLength(2);
  });

  it('marks expired links', async () => {
    const expiredLink = {
      links: [
        {
          id: '3',
          slug: 'expired',
          shortUrl: 'http://localhost:3001/r/expired',
          originalUrl: 'https://example.com/expired',
          clicks: 0,
          createdAt: '2023-12-19T10:00:00.000Z',
          expiresAt: '2020-01-01T00:00:00.000Z',
        },
      ],
    };

    mockLinksApi.getLinks.mockResolvedValue(expiredLink);

    renderWithProviders(<LinksTable />);

    await waitFor(() => {
      expect(screen.getByText('Истекла')).toBeInTheDocument();
    });
  });
});
