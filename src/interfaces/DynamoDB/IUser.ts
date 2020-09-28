/* eslint-disable semi */
import IDynamoObject from './IDynamoObject';
import ITodoTemplate from './ITodoTemplate';
import IExternDocument from './IExternDocument';

export default interface IUserItem extends IDynamoObject{
  name: string,
  emailID: string,
  companyName: string,
  CPF: string,
  password: string,
  myTodoTemplates: string[],
  myDocuments: string[],
  documents: IExternDocument[],
  todoTemplates: IExternDocument[]
}
