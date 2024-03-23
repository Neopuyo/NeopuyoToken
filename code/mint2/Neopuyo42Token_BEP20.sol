// SPDX-License-Identifier: MIT
pragma solidity >0.4.0 <= 0.8.19; // The version of Solidity required to compile

// Defining a smart-contract with `contract` keyword
contract Token {
    /* Token basic public attributs*/
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address payable public owner;

    /* [KEYWORDS]
     `address` : solidity base type to identify [transactions recipients] or [contract owner]
     `payable` : the address can receive ETH / BNB
     `event`   : external clients can subscribe and listen to it, [log/notification mechanism]
     `indexed` : the parameter can be used as a filter to a search
     `view`    : getter-only functions, no gas cost
    */

    // map : user(key) with their sold/balance(value)
    mapping (address => uint256) public balanceOf;

    // map : user(key) who approves a certain amount of his tokens to be spent by another address 
    mapping (address => mapping (address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approve(address indexed owner, address indexed spender, uint256 value);


    constructor() {
        name = "Neopuyo42Token";
        symbol = "NEO";
        decimals = 18;
        uint256 _initialSupply = 42000000000 * (10 ** decimals); // 42 000 000 000 * (10^18)

        owner = payable(msg.sender); // cast

        balanceOf[owner] = _initialSupply;
        totalSupply = _initialSupply;

        /* [TRANSFER EVENT]
           fire Transfer event when token are created/burnt/transfered
           `msg.sender` : address of the current transaction sender (here the contract owner)
           `address(0)` : 0x0, meaning token are create, not transfered from an address
        */
        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    // pretty straightforward
    function transfer(address to, uint256 value) public returns (bool success) {
        uint256 senderBalance = balanceOf[msg.sender];
        uint256 receiverBalance = balanceOf[to];

        // throw Error(string) if false
        require(to != address(0), "Receiver address invalid");
        require(value > 0, "value can't be equal to 0");
        require(senderBalance >= value, "Sender has not enough balance to transfer");

        balanceOf[msg.sender] = senderBalance - value;
        balanceOf[to] = receiverBalance + value;

        emit Transfer(msg.sender, to, value);
        return true;
    }

    // This one using allowance map to transfer from another address than msg.sender
    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        uint256 senderBalance = balanceOf[msg.sender];
        uint256 receiverBalance = balanceOf[to];
        uint256 allowedValue = allowance[from][msg.sender];

        require(to != address(0), "Receiver address invalid");
        require(value > 0, "value can't be equal to 0");
        require(senderBalance >= value, "Sender has not enough balance to transfer");
        require(allowedValue >= value, "Exceeded the maximum allowed value");

        balanceOf[from] = senderBalance - value;
        balanceOf[to] = receiverBalance + value;
        allowance[from][msg.sender] = allowedValue - value;

        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool success) {
        require(value > 0, "value can't be equal to 0");

        allowance[msg.sender][spender] = value;

        emit Approve(msg.sender, spender, value);
        return true;
    }

    // -------------- not part of IBEP20 interface ------------------

    function mint(uint256 amount) public returns (bool success) {
        require(msg.sender == owner, "Only The token master can mint token !");

        totalSupply += amount;
        balanceOf[msg.sender] += amount;

        emit Transfer(address(0), msg.sender, amount);
        return true;
    }

    function burn(uint256 amount) public returns (bool success) {
        require(msg.sender != address(0), "Invalid burn sender !");

        uint256 senderBalance = balanceOf[msg.sender];
        require(senderBalance >= amount, "Burn amount exceed sender balance");
        require(totalSupply >= amount, "Burn amount exceed sender totalSupply, how this can be ?");

        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;

        emit Transfer(msg.sender, address(0), amount);
        return true;
    }
    

}

// Solidity v0.8 and above, public variables automatically generate getter functions
// The contract has to implements the other one from IBEP20 interface

/*
interface IBEP20 {

  function totalSupply() external view returns (uint256);
  function decimals() external view returns (uint8);
  function symbol() external view returns (string memory);
  function name() external view returns (string memory);
  function getOwner() external view returns (address);
  function balanceOf(address account) external view returns (uint256);
  function transfer(address recipient, uint256 amount) external returns (bool);
  function allowance(address _owner, address spender) external view returns (uint256);
  function approve(address spender, uint256 amount) external returns (bool);
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}
*/