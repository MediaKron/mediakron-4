import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faArrowUp,
    faAsterisk,
    faPaintBrush, /* Appearance */
    faHome, /* Home */
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
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
    faUserEdit,
    faInfoCircle,
    faWindowClose /* close square */ 
} from '@fortawesome/free-solid-svg-icons'

export default function initializeIcons(){
    library.add(
        faArrowDown,
        faArrowLeft,
        faArrowRight,
        faArrowUp,
        faAsterisk,
        faPaintBrush, /* Appearance */
        faHome, /* Home */
        faChevronDown,
        faChevronLeft,
        faChevronRight,
        faChevronUp,
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
        faUserEdit,
        faWindowClose, /* close square */ 
        faInfoCircle
    );
}