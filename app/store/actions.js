import api from './utils/api';
import router from '@/router';


const actions = {
    uploadProgress({ commit, state }, progressEvent){
        let loaded = progressEvent.loaded | 1,
            total = progressEvent.total | 1;
        commit('progress', (loaded/total) * 100)
    },
    progressEvent({ commit, state }, progress){
        commit('progress', state.progress + (100 - state.progress) / 4);
    },
    progressReset({ commit, state }){
        commit('progress', 0);
    },
    progressComplete({ commit, state }){
        commit('progress', 100);
    },
    clearErrors({ commit, state }){
        console.log('clear errors')
    }
}
export default actions;