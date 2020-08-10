import AWS from 'aws-sdk';
import express from 'express';
// import config from './config/dev'; //wtf this

const router = express.Router();

AWS.config.update({
  region: '',
  accessKeyId: '',
  secretAccessKey: '',
});
