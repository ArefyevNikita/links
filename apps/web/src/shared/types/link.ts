export interface Link {
  id: string;
  slug: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  expiresAt: string | null;
}

export interface CreateLinkRequest {
  originalUrl: string;
  expiresAt?: string;
}

export interface ListLinksResponse {
  links: Link[];
}
