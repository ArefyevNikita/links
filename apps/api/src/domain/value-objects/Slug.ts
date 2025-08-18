export class Slug {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValidSlug(value)) {
      throw new Error('Invalid slug format');
    }
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  private isValidSlug(value: string): boolean {
    const slugRegex = /^[a-zA-Z0-9_-]{7,10}$/;
    return slugRegex.test(value);
  }

  public equals(other: Slug): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
