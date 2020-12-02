import { errorCodes } from '../httpCodes';

class APIError extends Error {
  readonly httpCode:number;

  constructor(message:string, httpCode:number) {
    super(message);
    this.httpCode = httpCode;
  }
}

export class BadRequestError extends APIError {
  constructor(message?:string) {
    super(`Client Error - ${message || "Bad Request"}`, errorCodes.BAD_REQUEST);
  }
}

export class UnauthenticatedError extends APIError {
  constructor(message?:string) {
    super(`Client Error - ${message || "User is not Authenticated"}`, errorCodes.UNAUTHENTICATED);
  }
}

export class ForbiddenError extends APIError {
  constructor(message?:string) {
    super(`Client Error - ${message || "Access denied"}`, errorCodes.FORBIDDEN);
  }
}

export class NotFoundError extends APIError {
  constructor(message?:string) {
    super(`Client Error - ${message || "The research of request was not found"}`, errorCodes.NOT_FOUND);
  }
}

export class InternalServerError extends APIError {
  constructor(message?:string) {
    super(`Server Error - ${message || "Unexpected error occurred"}`, errorCodes.INTERNAL_SERVER);
  }
}

export class NotImplementedError extends APIError {
  constructor(message?:string) {
    super(`Server Error - ${message || "Functionality not implemented"}`, errorCodes.NOT_IMPLEMENTED);
  }
}

export class BadGatewayError extends APIError {
  constructor(message?:string) {
    super(`Server Error - ${message || "Cannot get necessary response from server"}`, errorCodes.BAD_GATEWAY);
  }
}

export class ServiceUnavailableError extends APIError {
  constructor(message?:string) {
    super(`Server Error - ${message || "Service temporally unavailable"}`, errorCodes.SERVICE_UNAVAILABLE);
  }
}

export class GatewayTimeOutError extends APIError {
  constructor(message?:string) {
    super(`Server Error - ${message || "Timeout for get response from server"}`, errorCodes.GATEWAY_TIMEOUT);
  }
}

export default APIError;
