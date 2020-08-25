import { CreateChatRoom } from "@models/chat-room";
import { API } from "aws-amplify";
import { ApiConfigs } from "@api/api-gateway/api-configs";
import { BaseRepository } from "./base.repository";

class ChatRoomsRepository extends BaseRepository {
    async list() {
        const authHeader = await this.buildAuthHeader();
        return API.get(this.apiName, '/chatRooms', { headers: authHeader });
    }

    async findByInterlocutorId(interlocutorId: string) {
        const authHeader = await this.buildAuthHeader();
        return API.get(this.apiName, `/directRoom/${interlocutorId}`, { headers: authHeader });
    }

    async getDetails(roomId: string) {
        const authHeader = await this.buildAuthHeader();
        return API.get(this.apiName, `/chatRooms/${roomId}`, { headers: authHeader });
    }

    async create(room: CreateChatRoom) {
        const authHeader = await this.buildAuthHeader();
        const requestParams = {
            headers: authHeader,
            body: { ...room }
        }
        return API.post(this.apiName, `/chatRooms`, requestParams);
    }

    async delete(roomId: string) {
        const authHeader = await this.buildAuthHeader();
        return API.del(this.apiName, `/chatRooms/${roomId}`, { headers: authHeader });
    }
}

export default new ChatRoomsRepository(ApiConfigs.chatRooms.apiName);