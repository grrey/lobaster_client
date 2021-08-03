import base from './base';
import _ from 'lodash';

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

    /**
     * 行业历史 数据;  hy 共61个,这里传100 
     * days ="2021-07-28" 当天的数据 
     * days = 12 ; 最近12天的数据; 
     *  */  
    async hyData( days = "1" ){ 
        var body = this.$bodybuilder();
        let size = 1 ;
        if(  days.length > 6 ){
            body.query('match','date' ,  days ); 
        } else{
            size = days ;
        }
        
        body =  body.aggregation( 'terms' , 'date' , 'date' ,{ size: size },(agg) => {
            return agg.aggregation( 'terms' , 'hy.keyword' , 'hy', { size: 100 }, (agg) => {
                return agg.aggregation( 'sum' , 'k.value'  , 'value')
            })
        }).build();
  
        let  result = await  this.queryBody( body ) 

        let bucket = _.get( result , 'aggregations.date.buckets' , []);

        let HyHisData = bucket.map((hyagg) => {
            return  {
                date: hyagg.key_as_string ,
                hylist : _.get( hyagg , "hy.buckets", []).map((hy) => {
                    return {
                        name: hy.key,  
                        // name: hy.key[0] ,
                        doc_count: hy.doc_count ,
                        value:   + ( hy.value.value.toFixed(2) ) 
                    }
                })
            }
        })

         return HyHisData
    }


}