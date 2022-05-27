import Vue from "vue";
import Vuex from "vuex";
import tab from './tab'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: localStorage.getItem("token"),
        userInfo: JSON.parse(localStorage.getItem("userInfo")),
    },
    mutations: {
        // set
        SET_TOKEN: (state, token) => {
            state.token = token;
            localStorage.setItem("token", token);
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo;
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
        },
        REMOVE_INFO: (state) => {
            (state.token = ""),
            (state.userInfo = {}),
            localStorage.removeItem("token", ""),
                localStorage.removeItem("userInfo", "");
        },
    },
    getters: {
        // get
        getUser: (state) => {
            return state.userInfo;
        },
    },
    actions: {},
    modules: {
        tab
    },
});