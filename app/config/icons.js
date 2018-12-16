import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faCogs,
    faPlusSquare,
    faList,
    faSearch,
    faUser,
    faExpandArrowsAlt,
    faSignInAlt
} from '@fortawesome/free-solid-svg-icons'

export default function initializeIcons(){
    library.add(
        faSearch, 
        faPlusSquare, 
        faCogs, 
        faList,
        faUser,
        faExpandArrowsAlt,
        faSignInAlt
    );
}