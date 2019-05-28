CreditSol = artifacts.require("Credit");

contract('Credit', (accounts) => {
  it("Should be something wrong..", async () => {
    const creditInstance = await CreditSol.deployed();
    var contractName = await creditInstance.GetContractName();
    assert.equal("smart city", contractName.valueOf(), "the contract name isn't ok.");

    await creditInstance.SetContractName("zelda");
    var contractName = await creditInstance.GetContractName();
    assert.equal("zelda", contractName.valueOf(), "the contract name isn't ok.");
    
    var to = "0x62F8Fa0BF363b9DBb7f76c0F0b1968776d2F494e";
    var credit = 10;
    var coin = 3;
    var location = "红树湾";
    var curTime = new Date();
    var createdAt = curTime.getTime();
    var authType = 2;
    var ratio = 7; 
    var operator = "xiao";
    var admin = "xia";

    var confirm = await creditInstance.ConfirmRecord(to, credit, coin, location, createdAt, authType, ratio, operator, admin);
    console.log("========== ", confirm.tx);
    
    var check = await creditInstance.GetRecordByIdx(0);
    console.log(check.coin);
  });
});

