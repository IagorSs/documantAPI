export default function checkENV() {
  const acessENV = process.env;

  if (acessENV.AWS_ACESS_KEY
    && acessENV.AWS_SECRET_ACESS_KEY
    && acessENV.AWS_DEFAULT_REGION
    && acessENV.DYNAMO_ENDPOINT
    && acessENV.S3_ENDPOINT
    && acessENV.FRONT_APP_URL
    && acessENV.USER_TABLE_NAME
    && acessENV.DOCUMENT_TABLE_NAME
    && acessENV.TODO_TABLE_NAME
    && acessENV.TOKEN_TABLE_NAME
    && acessENV.DOCUMANT_BUCKET_NAME
    && acessENV.AUTH_SECRET
    && acessENV.AUTH_REFRESH_SECRET
    && acessENV.AUTH_EXPIRE
    && acessENV.MAX_FILE_TAM) return;

  console.error("Some or multiple ENV variables are not setted");
}
