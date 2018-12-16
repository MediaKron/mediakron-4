import { MutationTree } from 'vuex';
import api from '@/store/utils/api';
import { getInitialState } from '@/store/modules/users';

export const mutations = {
    /**
     * Called while user is logging in
     * @param {*} state 
     */
    loggingIn(state){
        state.loginPending = true;
        state.loginSuccess = false;
        state.loginFailed = false;
    },

    /**
     * Called while user is logging in
     * @param {*} state 
     */
    loggedIn(state){
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
        
        state.user = data.user.map(user => new Site(user));
    },
}
export default mutations;