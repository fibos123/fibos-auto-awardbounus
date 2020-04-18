var FIBOS = require('fibos.js');
var config = require('./config');
var http = require('http');
require('ssl').loadRootCerts();

var httpClient = new http.Client();
var fibos = FIBOS({
  chainId: config.chainId,
  keyProvider: config.privateKey,
  httpEndpoint: config.httpEndPoint,
});

main()
setInterval(main, 1 * 60 * 60 * 1000); // ever 1 hours do it

function main() {
  const producer = config.producerName
  const backAccount = config.backAccount
  const memo = config.memo
  const percentDefault = config.percentDefault
  const ownerFixList = config.ownerFixList
  const percentFixList = config.percentFixList

  // 取得余额
  const account = fibos.getTableRowsSync({
    "json": true
    , "code": "eosio.token"
    , "scope": producer
    , "table": "accounts"
    , "table_key": ""
    , "lower_bound": ""
    , "upper_bound": ""
    , "limit": 100
  })

  let balance = 0
  if (account.rows && account.rows.length) {
    account.rows.map(a => {
      if (a.balance.quantity.substr(-2) === 'FO' && a.balance.contract === 'eosio') {
        balance = parseFloat(a.balance.quantity)
      }
    })
  }
  console.log({ balance })
  
  if (balance < 10) {
    return
  }

  // 取得投票者
  var voters = []
  let totleStaked = 0;
  let page = 0;
  do {
    var res = httpClient.get("https://api.see.fo/voter?producer=" + producer + "&page=" + page).json()
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
