const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const fs = require('fs')
const cfg = require("./truffle-config")

const web3 = new Web3("http://" + cfg.networks.development.host + ":" + cfg.networks.development.port)
const genesisAccount = web3.eth.accounts.privateKeyToAccount("0x" + cfg.privateKey)
const blockKey1 = web3.eth.accounts.privateKeyToAccount("0x" + cfg.blockKey1)
const blockKey2 = web3.eth.accounts.privateKeyToAccount("0x" + cfg.blockKey2)
const normalKey = web3.eth.accounts.privateKeyToAccount("0x" + cfg.privateKey2)

const abi = JSON.parse(fs.readFileSync("./build/" + cfg.contract + ".abi", "utf-8"))
const bin = "0x" + fs.readFileSync("./build/" + cfg.contract + ".bin", "utf-8")

function UnlockKeyJson(keystoreJsonV3, password) {
  var key = web3.eth.accounts.decrypt(keystoreJsonV3, password)
  return key
}

function DeployRaw(account) {
  let priKey = Buffer.from(account.privateKey.substr(2), 'hex')
  let fromAddr = account.address
  let myContract = new web3.eth.Contract(abi)
  let encodedABI = myContract.deploy({ data: bin, arguments: [] }).encodeABI()
  let txObject = {
    randomid: Math.ceil(Math.random()*100000000),
    gas: 100000000,
    data: encodedABI,
    to: null,
    blockLimit: 500,
    from: fromAddr
  }
  let txHash = SendSignedTx(txObject, priKey)
  console.log(txHash)
}

function testSet(account) {
  let priKey = Buffer.from(account.privateKey.substr(2), 'hex')
  let fromAddr = account.address
  let addr = fs.readFileSync("contract.address", 'utf-8')
  let deployedContract = new web3.eth.Contract(abi, addr)

  let encoded = deployedContract.methods.set(
    "test SET() function has been called.", // address to
  ).encodeABI()
  CallEncodedABI(fromAddr, priKey, encoded)
}

function SendSignedTx(txObject, privateKey) {
  let tx = new Tx(txObject)
  tx.sign(privateKey)
  let signedTx = '0x' + tx.serialize().toString('hex')
  web3.eth.sendSignedTransaction(signedTx, (err, txHash) => {
    if (err) {
      console.log(err)
      return
    }
    console.log("txHash:", txHash) 
  })
}

async function getTransactionReceipt(txHash) {
  return new Promise (function (resolve, reject) {
    web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
      if (err) {
        reject(err)
      }
      resolve(receipt)
      if (receipt != null && receipt.contractAddress != null) {
        console.log("contractAddress: ", receipt.contractAddress)
        fs.writeFile('contract.address', receipt.contractAddress, (err) => {
          if (err) {
            return
          }
        })
      }
    })
  })
}

function CallEncodedABI(fromAddr, priKey, encodedABI) {
  let contractAddr = fs.readFileSync("contract.address", 'utf-8')
  let deployedContract = new web3.eth.Contract(abi, contractAddr)
  
    let txObject = {
      randomid: Math.ceil(Math.random()*100000000),
      gas: 100000000,
      data: encodedABI,
      to: contractAddr,
      blockLimit: 500,
      from: fromAddr
    }
    let result = SendSignedTx(txObject, priKey)
}

function testGet(account) {
  let fromAddr = account.address
  let addr = fs.readFileSync("contract.address", 'utf-8')
  let deployedContract = new web3.eth.Contract(abi, addr)

  deployedContract.methods.get()
    .call({from: fromAddr}).then(console.log)
}

function makeChoice(choice) {
  if (choice.length < 1) {
    console.log("arguments length must be one!!!")
    console.log("1: DeployRaw contract")
    console.log("2: Call testGet().")
    console.log("3: Call getTransactionReceipt")
    console.log("4: Call testSet()")
    return
  }

  switch (choice[0]) {
    case "1":
      console.log("1: DeployRaw contract")
      DeployRaw(genesisAccount)
     	break 
    case "2":
      console.log("2: Call Get().")
      testGet(genesisAccount)
      break
    case "3":
      console.log("3: Call getTransactionReceipt.")
      getTransactionReceipt(choice[1])
      break
    case "4":
      console.log("4: call testSet().")
      testSet(genesisAccount)
      break
    default:
      console.log("arguments length must be one!!!")
      console.log("1: DeployRaw contract")
      console.log("2: Call testGet().")
      console.log("3: Call getTransactionReceipt")
      console.log("4: Call testSet()")
  }
}

let args = process.argv.splice(2)
makeChoice(args)
