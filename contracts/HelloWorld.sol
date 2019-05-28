pragma solidity ^0.4.11;

contract HelloWorld {
    string name;
    function HelloWorld() {
       name = "Hi, truffle!";
    }
    function get() constant returns(string){
        return name;
    }

    function set(string n) {
    	name = n;
    }
}
