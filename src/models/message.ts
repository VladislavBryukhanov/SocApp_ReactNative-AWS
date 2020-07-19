export interface Message {
  id: string;
  chatId: string;
  senderKey: SenderCredentials;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface SenderCredentials {
  id: string;
  username: string;
}
