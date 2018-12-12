export default class Model {

    constructor(data){
        var target = this;
        Object.keys(data).map((key) => {
            target[key] = data[key];
        });
    }

    defaults(){
        
    }
}