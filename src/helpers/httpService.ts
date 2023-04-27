import axios from "axios";

const localURL = "http://localhost:8080";
const onlineURL = "https://sopra-fs23-group-27-server.oa.r.appspot.com";
export const mainURL = localURL;

export const httpGet = (endpoint: string, headers: Object) => {
  return axios.get(mainURL + endpoint, headers);
};

export const httpPost = (endpoint: string, body: Object, headers: Object) => {
  return axios.post(mainURL + endpoint, body, headers);
};

export const httpPut = (endpoint: string, body: Object, headers: Object) => {
  return axios.put(mainURL + endpoint, body, headers);
};

export const httpDelete = (endpoint: string, headers: Object) => {
  return axios.delete(mainURL + endpoint, headers);
};

export const handleError = (error: { response: any; message: string }) => {
  const response = error.response;

  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    let info = `\nrequest to: ${response.request.responseURL}`;

    if (response.data.status) {
      info += `\nstatus code: ${response.data.status}`;
      info += `\nerror: ${response.data.error}`;
      info += `\nerror message: ${response.data.message}`;
    } else {
      info += `\nstatus code: ${response.status}`;
      info += `\nerror message:\n${response.data}`;
    }

    console.log(
      "The request was made and answered but was unsuccessful.",
      error.response
    );
    return info;
  } else {
    if (error.message.match(/Network Error/)) {
      alert("The server cannot be reached.\nDid you start it?");
    }

    console.log("Something else happened.", error);
    return error.message;
  }
};
