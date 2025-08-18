export interface CreateLinkResponse {
  id: string;
  slug: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
  expiresAt: Date | null;
}
