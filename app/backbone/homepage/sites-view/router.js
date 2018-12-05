import List  from "./list";
import New  from "./list";

var view = false;

/**
 * Controller function.  Pass this
 */
export default  {
    index(){
        var ContentPage = new List();
        if (ContentPage) {
            Mediakron.controller.goToPage(ContentPage);
        }
    },
    new(){
        var ContentPage = new New();
        if (ContentPage) {
            Mediakron.controller.goToPage(ContentPage);
        }
    }
}
