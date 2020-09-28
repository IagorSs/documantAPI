export default {
  origin: process.env.FRONT_APP_URL || '*',
  optionsSucessStatus: 200,
  methods: ['GET', 'PUT', 'POST'],
};
