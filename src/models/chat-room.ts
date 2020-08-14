import { User } from "./user";

export interface ChatRoom {
    id: string;
    name: string;
    ownerKey: {
        id: string;
        username: string;
    },
    avatar?: string;
    chatOwner?: User;
    members?: User[];
}
