import { CognitoAuth } from '@api/auth';

type RequestType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class HttpApi {
  private accessToken?: string;
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = await CognitoAuth.retreiveSessionToken();
    }
    return this.accessToken;
  }

  private async basicRequest<T>(
    type: RequestType,
    specificEndpoint?: string,
    payload?: Partial<T>
  ) {
    const token = await this.getAccessToken();

    return fetch(specificEndpoint || this.baseUrl, {
      method: type,
      headers: { Authorization: token! },
      body: JSON.stringify(payload)
    }).then(response => response.json());
  }

  async get<T>(specificEndpoint?: string): Promise<T> {
    return this.basicRequest('GET', specificEndpoint);
  }

  async post<T, K>(changes: K, specificEndpoint?: string) {
    return this.basicRequest<K>('POST', specificEndpoint, changes);
  }

  async put<T, K>(changes: K, specificEndpoint?: string) {
    return this.basicRequest<K>('PUT', specificEndpoint, changes);
  }

  async delete<T>(specificEndpoint: string): Promise<T> {
    return this.basicRequest('GET', specificEndpoint);
  }
}