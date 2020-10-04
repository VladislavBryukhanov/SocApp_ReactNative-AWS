import { User } from "./user";
import { Message } from "./message";

export interface ChatRoom {
    id: string;
    name: string;
    ownerId: string,
    avatar?: string;
    chatOwner?: User;
    members?: User[];
    lastMessage: Message;
}

export interface CreateChatRoom {
    interlocutorId: string;
    // interlocutors: string;
    name?: string;
    avatar?: string;
}