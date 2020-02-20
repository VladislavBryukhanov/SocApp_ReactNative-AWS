import { mediaResources } from './s3-configs';
import awsconfig from '../../../aws-exports';
import Amplify, { Storage, Auth } from 'aws-amplify';

// Amplify.configure(awsconfig);

// Storage.configure({
//   bucket: mediaResources.bucket
// });

// Storage.configure({
//   AWSS3: {
//       bucket: mediaResources.bucket,
//       region: awsconfig.aws_user_files_s3_bucket_region
//   }
// });

// Storage.configure({
//   bucket: '',
//   region: ''
// })

class s3 {
  constructor() {
  }

  async upload(data: any) {
    // Amplify.configure(awsconfig);
    await Auth.currentCredentials();
    Storage.configure({ Auth });

    console.log(data);
    Storage.put('staticKey.jpg', data, {
      level: 'protected',
      ContentEncoding: 'base64',
      ContentType: 'image/jpg'
    })
      .then(res => console.log(res))
      .catch(e => console.log(e));
  }

  async read() {
    // Amplify.configure(awsconfig);
    await Auth.currentCredentials();
    Storage.configure({ Auth });

    Storage.get('picture.jpg')
      .then(res => console.log(res))
      .catch(e => console.log(e));
  }
}

export default new s3();