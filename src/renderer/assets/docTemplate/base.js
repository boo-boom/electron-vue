const paramStr = (param) => {
    let str = '';
    if(param && param.length) {
        param.forEach(item => {
            str += 
                `
                * @apiParam {${item.paramType}} ${item.paramName} ${item.paramDesc}
                `
        })
    }
    return str
}

const docStr = (base, param) => {
    // console.log(paramStr(param))
    let baseStr = 
        `
        /**
         * @api {post} ${base.apiName} ${base.apiName.split('.')[1]}
         * 
         * @apiDescription
         * "title":"${base.title}",
         *
         * "groupOwner":"${base.groupOwner}",
         *
         * "methodOwner":"${base.methodOwner}",
         *
         * "securityLevel":"${base.securityLevel}",
         *
         * "returnType":"Api_AESTHETICSLAB_ReviewDetailResp_Node",
         *
         * "state":"${base.state}",
         *
         * "detail":null,
         *
         * "encryptionOnly":false,
         *
         * "needVerify":false
         *
         * @apiGroup ${base.apiName.split('.')[0]}
         * 
         * ${paramStr(param)}
         **/
        `
    baseStr = baseStr.replace(/^\s+/ig, '')
    baseStr = baseStr.replace(/\s+\*/ig, '\n *')
    return baseStr
}

export default docStr;