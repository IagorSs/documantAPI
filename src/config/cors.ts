import { successfulCodes } from '../utils/httpCodes';

export default {
  origin: process.env.FRONT_APP_URL || '*',
  optionsSuccessStatus: successfulCodes.OK,
  methods: ['GET', 'PUT', 'POST'],
};
