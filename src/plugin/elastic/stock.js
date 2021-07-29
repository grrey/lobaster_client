
/**

 

 }

 */
import base from './base';

export default  class Stock extends base {
    constructor() {
        super()
        // index ;
        this.indexName = 'st'
        // type ; 
        this.defaultTypeName = 'st_'

        // 查询是每页条数;
        this.pageSize = 20

        // stock 基本字段;
        this.baseField = ['_id', 'market', 'code', 'name', 'marketCode','latestHis']
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

