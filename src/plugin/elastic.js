const esHost = 'http://localhost:9200'

import {
    Client
} from 'elasticsearch'
const client = new Client({
    node: esHost
})

class base {
    constructor() {
        this.esClient = client;
    }


    async isIdExist(id) {
        var isExist = await client.exists({
            index: this.indexName,
            type: this.defaultTypeName,
            id: id
        })
        return isExist
    }

    async isExist(luceneStr) {
        const arr = this.search({
            luceneStr,
            fields2return: ['_id']
        })
        return !!arr.length
    }

    async getById(id, fields2return = this.baseField) {
        const obj = await client.get({
            index: this.indexName,
            id: id,
            _source: fields2return
        })
        return obj
    }
    /**
     * 创建; 支持批量;
     *  entity =  { _id , _source } ||  { ... }
     * @param type
     * @param entity
     * @returns {Promise<void>}
     */
    async createOrUpdate(entity) {
        entity = entity.forEach ? entity : [entity]
        // 批量创建;
        const body = []

        for (let i = 0; i < entity.length; ++i) {
            const obj = entity[i]
            if (obj._id && obj._source) {
                body.push({
                    update: {
                        _id: obj._id
                    }
                })
                body.push({
                    doc: obj._source
                })
            } else {
                const _id = this._genId(obj)
                const isExist = await this.isIdExist(_id)
                if (isExist) {
                    body.push({
                        update: {
                            _id
                        }
                    })
                    body.push({
                        doc: obj
                    })
                } else {
                    body.push({
                        create: {
                            _id
                        }
                    })
                    body.push(obj)
                }
            }
        }
        await client.bulk({
            index: this.indexName,
            type: this.defaultTypeName,
            body
        })
    }

	async update( id , _source ){
		return await client.update({ 
			body:{doc: _source } , 
			id: id,
			index: this.indexName ,
			type: this.defaultTypeName,
		})
	}

    async remove(luceneStr) {
        if (!luceneStr) {
            return
        }
        var result = await client.deleteByQuery({
            index: this.indexName,
            type: this.defaultTypeName,
            q: luceneStr
        })
        return result
    }

    /**
     * sort :  A comma-separated list of <field>:<direction> pairs
     * demo :   { sort:"date:desc"  }  // desc , asc
     * @param type
     * @param page
     * @param fields2return
     * @param sort
     * @returns {Promise<*>}
     *
     *  sort = "date:-"
     */
    async search({
        page = 1,
        size,
        luceneStr = '',
        fields2return,
        sort
    }) {
        var params = {
            index: this.indexName,
            from: (page - 1) * this.pageSize,
            size: size || this.pageSize,
            q: luceneStr
        }

        if (fields2return) {
            // _source: fields2return
            params._source = fields2return
        }
        if (sort) {
            params.sort = sort
        }

        // console.log(' search params = ', params);

        var {
            hits = {}
        } = await client.search(params)

        return {
            total: hits.total && hits.total.value,
            data: hits.hits || []
        }
    }
}

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
class Stock extends base {
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

    // 生成id;
    _genId(entity) {
        return entity.market + entity.code
    }

    // 从es中获取所有 stock ;
    getIteratorArr({
        esFields = [],
        lucene
    }) {
        const params = {
            page: 1,
            size: 4000,
            luceneStr: lucene || this.lucene_gp,
            fields2return: [...this.baseField, ...esFields]
        }
        return this.search(params)
    }

    /**
     * esFields 需要查询stock 的字段;
     * @param funcArray
     * @param dealData
     * @param esFields
     * @returns {Promise<void>}
     */
    async Iterator({
        dealEsEntity,
        esFields,
        t = 5,
        barText = 'stock-Iterator',
        lucene
    }) {
        var allStork = await this.getIteratorArr({
            esFields,
            lucene
        })
        var length = allStork.data.length

        var bar = new ProgressBar(`   ${barText} [:bar]  :index/${length}  :percent  :elapseds`, {
            complete: '#',
            incomplete: '-',
            width: 60,
            total: length
        })

        for (var i = 0; i < length; ++i) {
            const stock = allStork.data[i]
            if (t) {
                await sleep(t)
            }
            await runWithReTry(dealEsEntity, [stock])

            await bar.tick({
                index: i + 1
            })
        }
    }
}


class His extends base {
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



var $es = {
    stock: new Stock(),
    his: new His(),
}

export default {
    install: function(Vue, opts) {
        // 3. 注入组件选项
        Vue.mixin({
            created: function() {
                this.$es = $es;
            }
        })
    }
}