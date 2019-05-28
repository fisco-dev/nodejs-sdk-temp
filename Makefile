.PHONY: init deps

CONTRACT = "HelloWorld"
GOPKG = "hello"


init:
	rm -rf ./node_modules && npm install
	rm -rf ./node_modules/ethereumjs-tx && tar -xzvf ethereumjs-tx.tar.gz && mv -f ethereumjs-tx ./node_modules/

deps:
	rm -rf build && mkdir -p ./build/$(GOPKG)
	truffle compile && node ./js/readbin.js

