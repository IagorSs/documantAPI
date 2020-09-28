/* eslint-disable semi */
import IDynamoObject from './IDynamoObject';
import IS3 from './IS3Document';
import IUserItem from './IUser';

export default interface ITodoTemplate extends IDynamoObject{
  title: string,
  titleID: string,
  description: string,
  createdBy: string, // Name or email of User
  documents: string[], // Id of Documents
}
