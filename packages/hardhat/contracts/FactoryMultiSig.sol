// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./MetaMultiSigWallet.sol";

contract FactoryMultiSig {
    MetaMultiSigWallet[] public mmswArray;
    
    // change this variable in the deployment script to your favorite chain id
    uint256 public immutable CHAIN_ID;

    event MultiSigWalletCreated(address indexed walletAddress, address indexed creator);

    constructor(uint256 _chainId ){
        CHAIN_ID = _chainId;
    }

    function createMultiSig(address[] memory _owners, uint _signaturesRequired) public returns (address) {
        require(_owners.length > 0, "createMultiSig: min one owner");
        require(_signaturesRequired > 0 && _signaturesRequired <= _owners.length, "createMultiSig: invalid # of signatures");
        
        MetaMultiSigWallet mmsw = new MetaMultiSigWallet(CHAIN_ID, _owners, _signaturesRequired);
        mmswArray.push(mmsw);
        
        emit MultiSigWalletCreated(address(mmsw), msg.sender);
        return address(mmsw);
    }
}
