export default {
  secret: process.env.AUTH_SECRET || '',
  refreshSecret: process.env.AUTH_REFRESH_SECRET || '',
  expire: process.env.AUTH_EXPIRE,
};
