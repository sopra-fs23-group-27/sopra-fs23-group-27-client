const dev = {
    apiUrl: 'http://localhost:8080',
  };
  
const prod = {
  apiUrl: 'https://sopra-fs23-group-27-server.oa.r.appspot.com',
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;