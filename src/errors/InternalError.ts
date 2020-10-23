/* eslint-disable semi */

export default class InternalErro extends Error {
  readonly resCode:number;

  constructor(message:string, resCode:number) {
    super(message);
    this.resCode = resCode;
  }
}
