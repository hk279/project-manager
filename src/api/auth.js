import axios from "axios";
import { URLroot } from "./config";

const authAPIroot = URLroot + "/auth";
let url;

const authAPI = {
    login(body) {
        url = `${authAPIroot}/login`;
        return axios.post(url, body);
    },
    signup(body) {
        url = `${authAPIroot}/signup`;
        return axios.post(url, body);
    },
};

export default authAPI;
