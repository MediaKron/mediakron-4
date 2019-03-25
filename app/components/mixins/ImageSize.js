// Reusable size/crop imgix parameters
let baseurl = "http://localhost:81/storage/"
export const imageSizeMixin = {
    methods: {
      imageThumbnail(site, url) {
        return site + '/thumbnail/' + url; 
      },
      imageSmall(url) {
        return site + '/small/' + url; 
      },
      imageMedium(url) {
        return site + '/medium/' + url; 
      },
      imageLarge(url) {
        return site + '/large/' + url; 
      },
      imageDouble(url) {
        return site + '/double/' + url; 
      }
    }
  };
  
  export default imageSizeMixin;