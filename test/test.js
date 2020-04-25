const util = require('util');
const utils = require('../utils');
const mysqls = require('../pool');
let str = "NodeKS";

let map = utils.makeMap('name', 'hong');
util.log("map>>>>>>", map.get('name'));

return;

util.log(utils.encryptSha2(str, 'aaa'));

return;

let url = "https://naver.com";

utils.ogsinfo(url, (err, let) =>{
    util.log(err, let);
});