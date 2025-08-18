export class Link {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly originalUrl: string,
    public readonly createdAt: Date,
    public readonly expiresAt: Date | null = null,
    public readonly clicks: number = 0,
  ) {}

  public isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }
    return new Date() > this.expiresAt;
  }

  public incrementClicks(): Link {
    return new Link(
      this.id,
      this.slug,
      this.originalUrl,
      this.createdAt,
      this.expiresAt,
      this.clicks + 1,
    );
  }

  public static create(
    id: string,
    slug: string,
    originalUrl: string,
    expiresAt?: Date,
  ): Link {
    return new Link(id, slug, originalUrl, new Date(), expiresAt ?? null, 0);
  }
}
