export default class Model {

    constructor(data){
        var target = this,
            defaultData = this.defaults();

        // TODO: Can these be merged?  Iterating over both is ineffecient
        // Possibly we can trust the local defaults to be authoritative 

        // Instantiate defaults
        Object.keys(defaultData).map((key) => {
            target[key] = defaultData[key];
        });

        // Load data from parent
        Object.keys(data).map((key) => {
            target[key] = data[key];
        });
    }

    defaults(){
        return {};
    }
}