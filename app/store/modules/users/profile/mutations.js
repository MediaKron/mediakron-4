import { MutationTree } from 'vuex';
import api from '@/store/utils/api';
import { getInitialState } from '@/store/modules/users';

export const mutations = {
    /**
     * Called while user is logging in
     * @param {*} state 
     */
    loginPending(state){
        state.loginPending = true;
        state.loginSuccess = false;
        state.loginFailed = false;
    },

    /**
     * Set the token on the authentication request
     * @param {*} state 
     * @param {*} token 
     */
    setToken(state, token){
        if (token) {
            localStorage.setItem('user-token', token);
            api.setToken(token);
        } else {
            localStorage.removeItem('user-token');
            api.removeToken();
        }
        state.currentToken = token;
    },
    /**
     * Called while user is logging in
     * @param {*} state 
     */
    loginSuccess(state){
        state.loginPending = false;
        state.loginSuccess = true;
        state.loginFailed = false;
    },

    /**
     * Called while user is logging in
     * @param {*} state 
     */
    loginError(state, error){
        state.loginPending = false;
        state.loginSuccess = false;
        state.loginFailed = true;
    },

    /**
     * Called while user is logging in
     * @param {*} state 
     */
    login(state, data){
        console.log(data);
        state.user = data.user.map(user => new User(user));
    },
}
export default mutations;