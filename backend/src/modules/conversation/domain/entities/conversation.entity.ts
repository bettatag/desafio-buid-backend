export class ConversationEntity {
  constructor(
    public readonly id: string,
    public readonly userId: number,
    public title: string | null,
    public context: any | null,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public totalMessages: number = 0,
    public lastMessageAt: Date | null = null,
  ) {}

  // Métodos de negócio
  public updateTitle(newTitle: string): void {
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  public updateContext(newContext: any): void {
    this.context = newContext;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public incrementMessageCount(): void {
    this.totalMessages += 1;
    this.lastMessageAt = new Date();
    this.updatedAt = new Date();
  }

  public canReceiveMessages(): boolean {
    return this.isActive;
  }

  public isOwnedBy(userId: number): boolean {
    return this.userId === userId;
  }

  // Métodos adicionais para os testes
  public hasMessages(): boolean {
    return this.totalMessages > 0;
  }

  public canAddMessages(): boolean {
    return this.isActive;
  }

  public getAge(): number {
    return Date.now() - this.createdAt.getTime();
  }

  public getTimeSinceLastMessage(): number | null {
    if (!this.lastMessageAt) return null;
    return Date.now() - this.lastMessageAt.getTime();
  }

  public isRecentlyActive(thresholdMs: number = 60 * 60 * 1000): boolean {
    if (!this.lastMessageAt) return false;
    const timeSince = this.getTimeSinceLastMessage();
    return timeSince !== null && timeSince <= thresholdMs;
  }

  public getDisplayTitle(defaultTitle: string = 'Conversa sem título'): string {
    if (!this.title || this.title.trim() === '') {
      return defaultTitle;
    }
    return this.title;
  }

  // Factory method
  public static create(input: {
    userId: number;
    title?: string;
    context?: any;
    isActive?: boolean;
  }): ConversationEntity {
    const now = new Date();
    const id = require('uuid').v4();
    return new ConversationEntity(
      id,
      input.userId,
      input.title || null,
      input.context || null,
      input.isActive !== undefined ? input.isActive : true,
      now,  // createdAt
      now,  // updatedAt
      0,    // totalMessages
      null, // lastMessageAt
    );
  }
}
