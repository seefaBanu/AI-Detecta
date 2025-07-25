import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const detectAudio = async (formData) => {
  const res = await axios.post(`${BASE_URL}/detect/audio`, formData);
  return res.data;
};

export const detectCode = async (payload) => {
  const res = await axios.post(`${BASE_URL}/detect/code`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};


export const detectImage = async (formData) => {
  const res = await axios.post(`${BASE_URL}/detect/image`, formData);
  return res.data;
};

export const detectVideo = async (formData) => {
  const res = await axios.post(`${BASE_URL}/detect/video`, formData);
  return res.data;
};
