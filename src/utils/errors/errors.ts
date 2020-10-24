import httpCodes from '../httpCodes';

class TreatableError extends Error {
  readonly httpCode:number;

  constructor(message:string, httpCode:number) {
    super(message);
    this.httpCode = httpCode;
  }
}

export class InternalError extends TreatableError {
  constructor(message:string) {
    super(message, httpCodes.INTERNAL_SERVER);
  }
}

export class NotFoundError extends TreatableError {
  constructor(message:string) {
    super(message, httpCodes.NOT_FOUND);
  }
}

export class BadRequest extends TreatableError {
  constructor(message:string) {
    super(message, httpCodes.BAD_REQUEST);
  }
}

export default {
  InternalError,
  NotFoundError,
  BadRequest,
};
