import Model from "@/store/utils/model";
class Tag extends Model {
    
    /**
     * 
     * @param {*} data 
     * @param {*} site 
     */
    constructor(data) {
        super(data)
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
export default Tag;