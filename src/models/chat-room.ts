import { User } from "./user";

export interface ChatRoom {
    id: string;
    name: string;
    ownerId: string,
    avatar?: string;
    chatOwner?: User;
    members?: User[];
}

export interface CreateChatRoom {
    interlocutorId: string;
    // interlocutors: string;
    name?: string;
    avatar?: string;
}