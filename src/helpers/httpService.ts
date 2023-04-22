import axios from "axios";


//const localURL = "https://localhost/8080";
const onlineURL = "https://sopra-fs23-group-27-server.oa.r.appspot.com";
const mainURL = localURL;

export const httpGet = (endpoint: string) => {
  return axios.get(mainURL + endpoint);
};

export const httpPost = (endpoint: string, body: Object) => {
  return axios.post(mainURL + endpoint, body);
};

