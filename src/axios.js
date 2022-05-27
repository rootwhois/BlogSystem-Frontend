import ElementUI from "element-ui";
import axios from "axios";
import router from "./router";
import store from "./store";

axios.defaults.baseURL = "http://127.0.0.1:8080/";

// 前置拦截
axios.interceptors.request.use((config) => {
    return config;
});

// 后置拦截
axios.interceptors.response.use((response) => {
    let res = response.data;
    if (res.code === 200 || res.code === 412) {
        return response;
    } else {
        ElementUI.Message.error(response.data.msg, { duration: 3 });
        return Promise.reject(response.data.msg);
    }
}, error => {
    if (error.response.data) {
        error.message = error.response.data.msg
    }

    if (error.response.status === 401) {
        store.commit("REMOVE_INFO");
        router.push("/login")
    }

    ElementUI.Message.error(error.message, { duration: 3 });
    return Promise.reject(error);
});