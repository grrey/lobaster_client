import base from './base';

export default  class His extends base {
    constructor() {
        super()
        // index ;
        this.indexName = 'his'
        // type ;
        // this.stockType = "stock_";
        this.defaultTypeName = 'his_'

        // 查询是每页条数;
        this.pageSize = 200

	}
}