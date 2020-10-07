export default {
  secret: process.env.AUTH_SECRET || '',
  refreshSecret: process.env.AUTH_REFRESH_SECRET || '',
  expire: parseInt(process.env.AUTH_EXPIRE || '0', 10),
};
