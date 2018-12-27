import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faCog,
    faPlusSquare,
    faList,
    faSearch,
    faUser,
    faExpandArrowsAlt,
    faSignInAlt,
    faThLarge,
    faSpinner,
    faCheck,
    faTimes,
    faQuestionCircle,
    faUserCog
} from '@fortawesome/free-solid-svg-icons'

export default function initializeIcons(){
    library.add(
        faSearch, 
        faPlusSquare, 
        faCog, 
        faList,
        faUser,
        faExpandArrowsAlt,
        faSignInAlt,
        faThLarge,
        faSpinner,
        faCheck,
        faTimes,
        faQuestionCircle,
        faUserCog
    );
}