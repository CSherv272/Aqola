import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const hello = async () => {
  const response = await api.get("http://localhost:8000");
  return response.data;
};

// export const hola = async () => {
//     const response = await api.get("http://localhost:8000/")
//     return response;
// }
