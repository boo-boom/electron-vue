/**
 * @api {post} node_aestheticslab.getReviewDetail getReviewDetail
 * 
 * @apiDescription
 * "title":"美学实验室心得详情",
 * "groupOwner":"王柯迪",
 * "methodOwner":"陈志祥",
 * "securityLevel":"Anonym",
 * "returnType":"Api_AESTHETICSLAB_ReviewDetailResp_Node",
 * "state":"OPEN",
 * "detail":null,
 * "encryptionOnly":false,
 * "needVerify":false
 *
 * @apiGroup node_aestheticslab
 * 
 * @apiParam {long} reviewId 讲座id
 * @apiParam {int} appID 应用id
 * @apiParam {Api_AESTHETICSLAB_PageParameter_Node} pageParameter 分页参数
 * @apiParam (Api_AESTHETICSLAB_PageParameter_Node) {int} offset 记录偏移量
 * @apiParam (Api_AESTHETICSLAB_PageParameter_Node) {int} limit 返回记录最大数量
 *
 * @apiSuccess (Api_AESTHETICSLAB_ReviewDetailResp_Node) {string} avatar 头像
 * @apiSuccess (Api_AESTHETICSLAB_ReviewDetailResp_Node) {string} nick 昵称
 * @apiSuccess (Api_AESTHETICSLAB_ReviewDetailResp_Node) {Api_AESTHETICSLAB_ReviewInfo_Node} reviewInfo 心得
 *
 * @apiSuccess (Api_AESTHETICSLAB_ReviewInfo_Node) {int} id id
 * @apiSuccess (Api_AESTHETICSLAB_ReviewInfo_Node) {int} postId 内容平台postId 评论点赞用
 * @apiSuccess (Api_AESTHETICSLAB_ReviewInfo_Node) {string} content 心得内容
 * @apiSuccess (Api_AESTHETICSLAB_ReviewInfo_Node) {List[Api_AESTHETICSLAB_ImageInfo_Node]} imageInfoList 图片列表
 * 
 * @apiSuccess (Api_AESTHETICSLAB_ImageInfo_Node) {string} url 图片地址
 * @apiSuccess (Api_AESTHETICSLAB_ImageInfo_Node) {short} height 图片高度
 * @apiSuccess (Api_AESTHETICSLAB_ImageInfo_Node) {short} width 图片宽度
 * 
 * @apiError (Error) {SYSTEM_ERROR_51800001} 51800001 系统错误
 * @apiError (Error) {PARAMETER_ERROR_51800002} 51800002 参数错误
 * 
 */
