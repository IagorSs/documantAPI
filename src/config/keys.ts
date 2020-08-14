// eslint-disable-next-line no-unused-vars
import { CDTGlobal } from './@types/global';

const keys = require('../../keys.json');

declare const global: CDTGlobal;

export default function readKeys() {
  global.acessKeyId = keys.acessKeyId;
  global.secretAcessKey = keys.secretAcessKey;
  return global;
}
