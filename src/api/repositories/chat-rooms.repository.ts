import { ChatRoom } from "@models/chat-room";
import { API } from "aws-amplify";
import { ApiConfigs } from "@api/api-gateway/api-configs";
import { BaseRepository } from "./base.repository";

class ChatRoomsRepository extends BaseRepository {
    async list() {
        const authHeader = await this.buildAuthHeader();
        return API.get(this.apiName, '/chatRooms', { headers: authHeader });
    }

    async getRoomDetails(roomId: string) {
        const authHeader = await this.buildAuthHeader();
        return API.get(this.apiName, `/chatRooms/${roomId}`, { headers: authHeader });
    }

    async create(room: ChatRoom) {

    }

    async delete(roomId: string) {

    }
}

export default new ChatRoomsRepository(ApiConfigs.chatRooms.apiName);