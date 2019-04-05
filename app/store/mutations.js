import { MutationTree } from 'vuex';
import api from '@/store/utils/api';
import { getInitialState } from '@/store/modules/users';
import Event from './Event';

export const mutations = {
    progress: (state, progress) => {
        // current total
        state.progress = progress;
    },
    event: (state, event) => {
        // make event and add it to the events que
        var eventObj = new Event(event);
        var index = state.events.push(eventObj).length - 1;
        if(eventObj.expires){
            setTimeout(() => {
                delete state.events[index];
            }, eventObj.expires);
        }
    }
}
export default mutations;