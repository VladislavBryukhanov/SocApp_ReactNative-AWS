import { Message } from '@models/message';

export interface ListMessages {
  listMessages: {
    items: Message[]
  }
}

export interface QueryListMessages {
  filter: {
    chatId: {
      eq?: string;
    }
  }
}