/* eslint-disable semi */
// eslint-disable-next-line no-unused-vars
import { Request } from 'express';

export default interface CustomRequest extends Request{
  token?: string,
  user?: object,
}
