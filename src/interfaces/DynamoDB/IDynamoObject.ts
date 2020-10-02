/* eslint-disable semi */

export interface IState {
  createdOn: string,
  updatedOn: string,
  isDeleted: boolean,
}

export default interface IDynamoObject {
  state: IState,
}
