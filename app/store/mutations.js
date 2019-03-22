import { MutationTree } from 'vuex';
import api from '@/store/utils/api';
import { getInitialState } from '@/store/modules/users';

export const mutations = {
    progress: (state, progress) => {
        // current total
        state.progress = progress;
    }
}
export default mutations;