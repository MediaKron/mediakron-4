import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faArrowUp,
    faAsterisk,
    faCheck,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faCog,
    faCogs, /* Manage */
    faEllipsisV,
    faExpandArrowsAlt,
    faHome, /* Home */
    faInfoCircle,
    faList,
    faPaintBrush, /* Appearance */
    faPlusSquare,
    faQuestionCircle,
    faSearch,
    faSignInAlt,
    faSignOutAlt,
    faSitemap,
    faSlidersH,
    faSpinner,
    faTag,
    faTags,
    faThLarge,
    faTimes,
    faUser,
    faUserCircle,
    faUserCog,
    faUserEdit,
    faUserPlus,
    faUsers,
    faWindowClose /* close square */ 
} from '@fortawesome/free-solid-svg-icons'

export default function initializeIcons(){
    library.add(
        faArrowDown,
        faArrowLeft,
        faArrowRight,
        faArrowUp,
        faAsterisk,
        faCheck,
        faChevronDown,
        faChevronLeft,
        faChevronRight,
        faChevronUp,
        faCog, 
        faCogs, /* Manage */
        faEllipsisV,
        faExpandArrowsAlt,
        faHome, /* Home */
        faInfoCircle,
        faList,
        faPaintBrush, /* Appearance */
        faPlusSquare, 
        faQuestionCircle,
        faSearch, 
        faSignInAlt,
        faSignOutAlt,
        faSitemap,
        faSlidersH,
        faSpinner,
        faTag,
        faTags,
        faThLarge,
        faTimes,
        faUser,
        faUserCircle,
        faUserCog,
        faUserEdit,
        faUserPlus,
        faUsers,
        faWindowClose, /* close square */ 
    );
}