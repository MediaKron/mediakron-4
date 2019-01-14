import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faPaintBrush, /* Appearance */
    faHome, /* Home */
    faCog,
    faCogs, /* Manage */
    faPlusSquare,
    faEllipsisV,
    faList,
    faSearch,
    faUser,
    faUserCircle,
    faExpandArrowsAlt,
    faSignInAlt,
    faSignOutAlt,
    faThLarge,
    faSpinner,
    faCheck,
    faSlidersH,
    faSitemap,
    faTimes,
    faQuestionCircle,
    faTag,
    faTags,
    faUserCog,
    faUserPlus,
    faUsers,
    faInfoCircle,
    faWindowClose /* close square */ 
} from '@fortawesome/free-solid-svg-icons'

export default function initializeIcons(){
    library.add(
        faPaintBrush, /* Appearance */
        faHome, /* Home */
        faSearch, 
        faPlusSquare, 
        faCog, 
        faCogs, /* Manage */
        faList,
        faEllipsisV,
        faUser,
        faUserCircle,
        faExpandArrowsAlt,
        faSignInAlt,
        faSignOutAlt,
        faThLarge,
        faSpinner,
        faSlidersH,
        faCheck,
        faSitemap,
        faTimes,
        faTag,
        faTags,
        faQuestionCircle,
        faUserCog,
        faUserPlus,
        faUsers,
        faWindowClose, /* close square */ 
        faInfoCircle
    );
}