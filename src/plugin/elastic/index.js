import Stock from './stock';
import His from './his';
import stquery from './stquery';
import sttag from './sttag';


export default {
    stock: new Stock(),
    his: new His(),
    stquery: new stquery(),
    sttag: new sttag(),
}


let  h = new His();

 
// h.esClient.indices.getMapping( {
//     index: h.indexName 
// } )

// 字段建立索引;
// h.esClient.indices.putMapping({
//     index: h.indexName ,
//     type: h.defaultTypeName , 
//     include_type_name : true ,
//     body:{
//         "properties": { 
//           "hy": {
//             "type":"text" , //  "text",
//             // "fielddata": true,
//             "fields": {
//                       "keyword": {
//                         "type": "keyword",
//                         "ignore_above": 256
//                       }
//                     }
//           }
//         }
//     }
// })
 
// var body = h.$bodybuilder()
//         .query('match','date' , '2021-07-29' , )
//         // .aggregation('sum' , 'k.value') 
//         // .aggregation('terms' , 'hy.keyword' , {
//         //     size:100
//         // }, (agg) => {
//         //    return agg.aggregation( 'sum' , 'k.value' )
//         // }) 
//         .aggregation( 'terms' , 'date' , 'date' ,{ size:100 },(agg) => {
//             return agg.aggregation( 'terms' , 'hy.keyword' , 'hy', { size: 100 }, (agg) => {
//                 return agg.aggregation( 'sum' , 'k.value'  , )
//             })
//         }) 
//         .build();   
//  h.queryBody( body ).then((result) => {
//      console.log( 'result == ' , result )
//  })

// h.hyData('2021-07-27').then((result) => {
//     console.log( 'result ==1 ' , result )
// })

// h.hyData( 20 ).then((result) => {
//     console.log( 'result ==2 ' , result )
// })


//  , (agg) => {
//     agg.aggregation('sum' , 'k.value')
// }