
/**

 _id =  marketCode
 stock = {
    "marketCode": "sz002455",
    "market": "sz",
    "code": "002455",
    "name": "百川股份",
    "JYFW": "危险化学品经营(按许可证所列方式和项目经营);--经营的东西, 干什么的.",
	"SSBK": [ "化工行业", "江苏板块", "锂电池"],

	business:[
		{   date:"" ,
			hy: [ { zygc:"行业类别" zysr:"主营收入" , srbl:"收入比例"}  ] ,
			cp:[ {zygc:"产品类别" ,  zysr:"主营收入" , srbl:"收入比例"} ]
		}
	],
	zyhy: [] // 最近时间 主营行业,
	zycp: [] // 最近时间 主营产品;,

	watchVal: { height , low } ,//

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

