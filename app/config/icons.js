import { library } from '@fortawesome/fontawesome-svg-core'
import { 
    faArchive,
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
    faEdit,
    faEllipsisV,
    faExpandArrowsAlt,
    faHome, /* Home */
    faImage,
    faInfoCircle,
    faList,
    faPaintBrush, /* Appearance */
    faPlus,
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
    faTh,
    faThList,
    faThLarge,
    faTimes,
    faTrashAlt,
    faUser,
    faUserCircle,
    faUserCog,
    faUserEdit,
    faUserPlus,
    faUsers,
    faVolumeUp,
    faWindowClose /* close square */ 
} from '@fortawesome/free-solid-svg-icons'

export default function initializeIcons(){
    library.add(
        faArchive,
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
        faEdit,
        faEllipsisV,
        faExpandArrowsAlt,
        faHome, /* Home */
        faImage,
        faInfoCircle,
        faList,
        faPaintBrush, /* Appearance */
        faPlus,
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
        faTh,
        faThList,
        faThLarge,
        faTimes,
        faTrashAlt,
        faUser,
        faUserCircle,
        faUserCog,
        faUserEdit,
        faUserPlus,
        faUsers,
        faVolumeUp,
        faWindowClose, /* close square */ 
    );
}