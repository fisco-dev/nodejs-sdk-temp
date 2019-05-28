# 本工具仅仅限于fisco-bcos 1.3版本

## 环境依赖
0. 工具可以运行在macos，泛linux内核(如archlinux, ubuntu, fedora, centos)
1. 需要提前安装好的: truffle [用于编译合约, 不能编译国密版的], abigen [编译成golang版合约的工具, 通过官方go-ethereum编译获得]
2. fisco-bcos 1.3 节点可运行

## 使用方法
### 1
  将编写好的合约放入contracts目录(目录里有实例合约)

  工程目录初始化
  ```
  make init 
  ```
  配置好合约名, 修改truffle-config.js, 此文件配置了编译合约的编译器版本，需要编译的合约名，及节点的运行位置

  开始编译
  ```
  make deps
  ```

### 2
  部署合约
  ```
  node operations.js 1
  ```

  查看合约是否部署成功(必须), 此步骤会将合约地址写入文件
  ```
  node operations.js 3 第一步获得的交易哈希值
  ```
  
  调用合约的get()方法
  ```
  node operations.js 2
  ```

  调用合约的set()方法
  ```
  node operations.js 4
  ```

  再次调用get()方法，查看新写入合约的值
  
  **若出现**
  ```
  txHash: {
  detail_info: 'callback eth_sendRawTransaction ' +
    'exceptioned, error msg:BlockLimit Check ' +
    'Fail.',
  ret_code: -1
  }
  ```
  表明opertions.js里的blocklimit没有设置好，按需进行设置即可

### 若是自己编写的合约，可以参照operations.js进行修改，使用自己的方法进行调用
