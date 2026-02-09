import Mailjet from "node-mailjet";

export function getMailjetClient() {
  const publicKey = process.env.MJ_APIKEY_PUBLIC;
  const privateKey = process.env.MJ_APIKEY_PRIVATE;

  if (!publicKey || !privateKey) {
    throw new Error("Mailjet keys missing. Set MJ_APIKEY_PUBLIC & MJ_APIKEY_PRIVATE in .env");
  }

  return Mailjet.apiConnect(publicKey, privateKey);
}
