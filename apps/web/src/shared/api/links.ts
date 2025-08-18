import { apiClient } from './client';
import type { Link, CreateLinkRequest, ListLinksResponse } from '@/shared/types/link';

export const linksApi = {
  async createLink(data: CreateLinkRequest): Promise<Link> {
    const response = await apiClient.post<Link>('/links', data);
    return response.data;
  },

  async getLinks(params?: { limit?: number; offset?: number }): Promise<ListLinksResponse> {
    const response = await apiClient.get<ListLinksResponse>('/links', { params });
    return response.data;
  },

  async deleteLink(id: string): Promise<void> {
    await apiClient.delete(`/links/${id}`);
  },
};
