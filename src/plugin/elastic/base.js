const esHost = 'http://localhost:9200'

import {
    Client
} from 'elasticsearch'
const client = new Client({
    node: esHost
})

export default class base {
    constructor() {
        this.esClient = client;
    }

	/**
	 * 
	 * @param {*} id 
	 */
    async isIdExist(id) {
        var isExist = await client.exists({
            index: this.indexName,
            type: this.defaultTypeName,
            id: id
        })
        return isExist
    }
	/**
	 * 
	 * @param {*} luceneStr 
	 */
    async isExist(luceneStr) {
        const arr = this.search({
            luceneStr,
            fields2return: ['_id']
        })
        return !!arr.length
    }
	/**
	 * 
	 * @param {*} id 
	 * @param {*} fields2return 
	 */
    async getById(id, fields2return = this.baseField) {
        const obj = await client.get({
            index: this.indexName,
            id: id,
            _source: fields2return
        })
        return obj
	}
	/**
	 * 
	 * @param {*} id 
	 */
	async delById(id){
		return  await client.delete({
			index: this.indexName,
			type: this.defaultTypeName ,
			id: id
		})
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

	/**
	 * 
	 * @param {*} id 
	 * @param {*} _source 
	 */
	async update( id , _source ){
		return await client.update({ 
			body:{doc: _source } , 
			id: id,
			index: this.indexName ,
			type: this.defaultTypeName,
		})
	}
	/**
	 *  不用 自己生成 id 
	 * @param {*} _source 
	 */
	async index(_source){
		return await client.index({
			body: _source ,  
			index: this.indexName ,
			type: this.defaultTypeName,
		})
	}

	/**
	 *  不用 自己生成 id 
	 * @param {*} _source 
	 */
	async create( _id,_source){
		return await client.index({
			body: _source ,  
			id:_id,
			index: this.indexName ,
			type: this.defaultTypeName,
		})
	}

	/**
	 * 
	 * @param {*} luceneStr 
	 */
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
		q='',
        fields2return,
        sort
    }={}) {
        var params = {
            index: this.indexName,
            from: (page - 1) * this.pageSize,
            size: size || this.pageSize,
        }

		if( luceneStr || q ){
			params.q = luceneStr || q ;
		}

        if (fields2return) {
            // _source: fields2return
            params._source = fields2return
        }
        if (sort) {
            params.sort = sort
        }
		if( this.indexName == 'stock'){
			let subQ = " latesHisDay:> 20201228  AND  macp:>200 "
			params.q = ( params.q ? (  params.q +" AND " ): "" ) + subQ ; // 有历史的 stock ;
		}
        console.log(' search params = ', params);

        var {
            hits = {}
        } = await client.search(params)

        return {
            total: hits.total && hits.total.value,
            data: hits.hits || []
        }
    }
}
