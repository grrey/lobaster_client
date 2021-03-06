
/**

 

 }

 */
import base from './base';

export default  class Stock extends base {
    constructor() {
        super()
        // index ;
        this.indexName = 'stock'
        // type ;
        // this.stockType = "stock_";
        this.defaultTypeName = 'stock_'

        // 查询是每页条数;
        this.pageSize = 20

        // stock 基本字段;
        this.baseField = ['_id', 'market', 'code', 'name', 'marketCode']
        this.forHisField = ['_id', 'market', 'code', 'latestHis']

        // luceneStr 查询 短语;
        this.lucene_gp = 'code:/[0,3,6]{1}.{5}/'

        // this.lucene_gp = "code:/[0,3,6]{1}.{5}/"

        this.FIELDS = {
            latestHis: 'latestHis',
            SSBK: 'SSBK',
            zycp: 'zycp',
            zyhy: 'zyhy'
        }
    }

   
}

