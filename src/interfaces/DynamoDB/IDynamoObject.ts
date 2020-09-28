/* eslint-disable semi */

export interface IState {
  cretedOn: string,
  updatedOn: string,
  isDeleted: boolean,
}

export default interface IDynamoObject {
  state: IState,
}
