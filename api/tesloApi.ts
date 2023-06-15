import axios from "axios";

const tesloApi = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

export default tesloApi;