import Model from "@/store/utils/model";
class Tag extends Model {
    
    /**
     * 
     * @param {*} data 
     * @param {*} site 
     */
    constructor(data, site) {
        super(data)
        this.site = site
    }

    /**
     * Get the url to this item
     * @return string
     */
    url(){
        return '/' + this.site.uri + '/' + this.uri;
    }

    
    defaults(){
        return {
            id: null,
            site_id: 0,
            title: '',
            uri: '',
            created_at: null,
            updated_at: false
        }
    }
}