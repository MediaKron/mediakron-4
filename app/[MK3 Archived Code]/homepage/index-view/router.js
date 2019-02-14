import Index from './index';
/**
 * Controller function.  Pass this
 */
export default  {
    index(){
        console.log('routing')
        var ContentPage = new Index();
        if (ContentPage) {
            Mediakron.controller.goToPage(ContentPage);
        }
    }
}
