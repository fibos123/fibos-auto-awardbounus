var FIBOS = require('fibos.js');
var config = require('./config');
var http = require('http');
var httpClient = new http.Client();
var fibos = FIBOS({
  chainId: config.chainId,
  keyProvider: config.privateKey,
  httpEndpoint: config.httpEndPoint,
});

main()
setInterval(main, 24 * 60 * 60 * 1000); // ever 1day do it

function main() {
  // BP 用户名
  const producer = ''
  // 分红差额转入账号
  const backAccount = ''
  // 转账 MEMO
  const memo = ''
  // 分红比例
  const percentDefault = 0.6;

  const ownerFixList = {}
  const percentFixList = {}

  // 取得余额
  const account = fibos.getTableRowsSync({
    "json": true
    , "code": "eosio.token"
    , "scope": producer
    , "table": "accounts"
    , "table_key": ""
    , "lower_bound": ""
    , "upper_bound": ""
    , "limit": 1
  })
  const balance = parseFloat(account.rows[0].balance.quantity)
  if (balance < 10) {
    return
  }

  // 取得投票者
  var voters = []
  let totleStaked = 0;
  let page = 0;
  do {
    var res = httpClient.get("http://explorer.fibos.rocks/api/voter?producer=" + producer + "&page=" + page).json()
    voters = voters.concat(res)
    res.map(v => {
      totleStaked += parseInt(v.staked)
    })
    page++
  } while (res.length)

  // 分析每位投票者分红数量
  var totleBouns = 0;
  let bonus = []
  voters.map(v => {
    const percent = percentFixList[v.owner] ? percentFixList[v.owner] : percentDefault
    const quantity = v.staked / totleStaked * balance * percent
    totleBouns += quantity
    if (quantity >= 0.1) {
      bonus.push({
        owner: v.owner,
        quantity: quantity.toFixed(4)
      });
    }
  })
  bonus.unshift({ owner: backAccount, quantity: (balance - totleBouns).toFixed(4) })
  console.log(new Date().toLocaleString())

  // 分红转账操作
  bonus.map((v, index) => {
    const owner = v.owner;
    const ownerFix = ownerFixList[owner] ? ownerFixList[owner] : owner
    try {
      fibos.transferSync(
        config.producerName
        , ownerFix
        , v.quantity + ' FO'
        , memo
        , { authorization: config.producerName });
    } catch (err) {
      console.error({ err })
    }
    console.log(
      ownerFix
      , v.quantity + ' FO'
      , `${index + 1}/${bonus.length}`
    )
  })
}