// SPDX-License-Identifier: MIT
pragma solidity >0.4.0 <= 0.8.19;

import "./Ownable.sol";
import "./Stakeable.sol";

contract FiveToken is Ownable, Stakeable {
    uint256 private _totalSupply;
    uint8 private _decimals;
    string private _symbol;
    string private _name;
    
    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory token_name, string memory ticker, uint8 token_decimals, uint256 token_totalSupply){
        uint256 _initialSupply = token_totalSupply * (10 ** token_decimals); // 5 000 000 000 * (10^18)
        
        _name = token_name;
        _symbol = ticker;
        _decimals = token_decimals;
        _totalSupply = _initialSupply;

        _balances[msg.sender] = _totalSupply;

        emit Transfer(address(0), msg.sender, _totalSupply);
    }


    /* ---------------------------internal methods---------------------------------------  */

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "FiveToken: transfer from zero address");
        require(recipient != address(0), "FiveToken: transfer to zero address");
        require(_balances[sender] >= amount, "FiveToken: cant transfer more than your account holds");

        _balances[sender] = _balances[sender] - amount;
        _balances[recipient] = _balances[recipient] + amount;

        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "FiveToken: cannot mint to zero address");

        _totalSupply = _totalSupply + amount;
        _balances[account] = _balances[account] + amount;

        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "FiveToken: cannot burn from zero address");
        require(_balances[account] >= amount, "FiveToken: Cannot burn more than the account owns");

        _balances[account] = _balances[account] - amount;
        _totalSupply = _totalSupply - amount;

        emit Transfer(account, address(0), amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "FiveToken: approve cannot be done from zero address");
        require(spender != address(0), "FiveToken: approve cannot be to zero address");

        _allowances[owner][spender] = amount;

        emit Approval(owner,spender,amount);
    }


    /* ---------------------------Getters (view)---------------------------------------  */

    function decimals() external view returns (uint8) {
        return _decimals;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function totalSupply() external view returns (uint256){
        return _totalSupply;
    }

    function getOwner() external view returns (address) {
        return owner();
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    } 

    function allowance(address owner, address spender) external view returns(uint256){
        return _allowances[owner][spender];
    }

    /* --------------------public & external Methods-------------  */
    
    // @onlyOwner
    function burn(address account, uint256 amount) public onlyOwner returns (bool) {
        _burn(account, amount);
        return true;
    }

    // @onlyOwner
    function mint(address account, uint256 amount) public onlyOwner returns (bool) {
        _mint(account, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender]+amount);
        return true;
    }
 
    function decreaseAllowance(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender]-amount);
        return true;
    }

    function withdrawStake(uint256 amount, uint256 stake_index)  public {

      uint256 amount_to_mint = _withdrawStake(amount, stake_index);
      _mint(msg.sender, amount_to_mint);
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function stake(uint256 amount) public {
        require(amount <= _balances[msg.sender], "FiveToken: Cannot stake more than you own");

        _stake(amount);
        _burn(msg.sender, amount);
    }

    function transferFrom(address spender, address recipient, uint256 amount) external returns(bool){
        require(_allowances[spender][msg.sender] >= amount, "FiveToken: You cannot spend that much on this account");
        _transfer(spender, recipient, amount);
        _approve(spender, msg.sender, _allowances[spender][msg.sender] - amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
}

/* [KEYWORDS]
     `address` : solidity base type to identify [transactions recipients] or [contract owner]
     `payable` : the address can receive ETH / BNB
     `event`   : external clients can subscribe and listen to it, [log/notification mechanism]
     `indexed` : the parameter can be used as a filter to a search
     `view`    : getter-only functions, no gas cost
     `external`: can be used ONLY from external
     `public`  : internal + external, use more gas than external
*/

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