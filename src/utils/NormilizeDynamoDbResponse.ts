
import { DynamoDB } from 'aws-sdk';

export default function normilizeResponse<T>(response: DynamoDB.Types.ScanOutput): Array<T> {
  return response.Items!.map(
    data => DynamoDB.Converter.unmarshall(data) as T
  );
}