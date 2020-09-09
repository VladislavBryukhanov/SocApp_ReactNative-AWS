import { CognitoAuth } from "@api/auth";

export abstract class BaseRepository {
    apiName: string;

    constructor(apiName: string) {
        this.apiName = apiName;
    }

    async buildAuthHeader() {
        const token = await CognitoAuth.retreiveSessionToken();
        return { Authorization: token };
    }
}