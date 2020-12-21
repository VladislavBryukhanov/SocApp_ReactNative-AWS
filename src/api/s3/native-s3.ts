import uuidv4 from 'uuid/v4';
import AWS from 'aws-sdk';
import { mediaResources } from './s3-configs';
import { Buffer } from 'buffer';

class s3 {
  private _storage?: AWS.S3;

  // create s3 instance in runtime as AWS.config.update set authenthicated credentials only in runtime after invoking of auth action
  get s3Instance() {
    if (!this._storage) {
      this._storage = new AWS.S3({
        signatureVersion: 'v4',
        correctClockSkew: true,
        params: { Bucket: mediaResources.bucket }
      });
    }

    return this._storage;
  }

  getSignedUrl(resourceKey: string) {
    return this.s3Instance.getSignedUrlPromise('getObject', {
      Expires: 10 * 60 * 1000,
      Key: resourceKey
    });
  }

  upload(data: any, fileType: string, extension: string) {
    const buff = Buffer.from(data, 'base64');
    const objectKey = uuidv4();

    const options = {
      Bucket: mediaResources.bucket,
      Key: `${objectKey}.${extension}`,
      Body: buff,
      ContentType: `image/${fileType}`
    };

    return this.s3Instance.putObject(options).promise();
  }
}

export default new s3();