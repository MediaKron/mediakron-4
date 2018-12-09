// Reusable size/crop imgix parameters

export const imageSizeMixin = {
    methods: {
      imageThumbnail(url) {
        return url + '?fit=facearea&facepad=10&w=150&h=150'; 
      },
      imageSmall(url) {
        return url + '?fit=facearea&w=800&h=400&facepad=10&q=20'; 
      },
      imageMedium(url) {
        return url + '?fit=crop&w=800&h=400&q=20'; 
      },
      imageLarge(url) {
        return url + '?fit=facearea&facepad=3&w=150&h=150'; 
      },
      imageDouble(url) {
        return url + '?w=480&h=660&fit=crop&crop=focalpoint&fp-x=0&fp-y=0';
      },
      imageSquareSmall(url) {
        return url + '?w=480&h=660&fit=crop&crop=focalpoint&fp-x=0&fp-y=0';
      },
      imageSquareLarge(url) {
        return url + '?w=480&h=660&fit=crop&crop=focalpoint&fp-x=0&fp-y=0';
      },
    }
  };
  
  export default imageSizeMixin;