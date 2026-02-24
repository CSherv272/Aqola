import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const get_bar_info = async () => {
  const response = await api.get("http://localhost:8000/lsoas/E01024135/school");
  return response.data;
};

export const getPostcodeData = async (postcode: string) => {
  const response = await api.get(`http://localhost:8000/postcodes/${postcode}`);
  return response.data;
};

// export const hola = async () => {
//     const response = await api.get("http://localhost:8000/")
//     return response;
// }
