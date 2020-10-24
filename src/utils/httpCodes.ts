export const informationCodes = {
  PROCESSING: 102,
};

export const successfulCodes = {
  // For DELETE request
  OK: 200,

  // For POST request
  CREATED: 201,

  // For PUT request
  ACCEPTED: 202,

  // For GET request
  IM_USED: 226,
};

export const clientErrorCodes = {
  BAD_REQUEST: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

export const serverErrorCodes = {
  INTERNAL_SERVER: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

export const errorCodes = {
  ...clientErrorCodes,
  ...serverErrorCodes,
};

export const commonCodes = {
  ...informationCodes,
  ...successfulCodes,
};

export default {
  ...commonCodes,
  ...errorCodes,
};
