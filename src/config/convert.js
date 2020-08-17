import keys from '../keys.json';

const convertapi = require('convertapi')(keys.convertAPI.key);

async function convertApi() {
  try {
    return await convertapi
      .convert('compress', { File: 'C:/Users/iagor/Downloads/Plano_Didtico-Clculo_III_-_ERE_-_Preliminar.pdf' }, 'pdf');
    // .then((result) => result);
    // result.saveFiles('C:/Users/iagor/Downloads/teste/');
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default convertApi;
