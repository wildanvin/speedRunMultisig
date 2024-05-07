// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./MetaMultiSigWallet.sol";

contract FactoryMultiSig {
    MetaMultiSigWallet[] public mmswArray;
    
    // change this variable in the deployment script to your favorite chain id
    uint256 public immutable CHAIN_ID;

    event MultiSigWalletCreated(address indexed walletAddress, address indexed creator);
    error CantFund();

    constructor(uint256 _chainId ){
        CHAIN_ID = _chainId;
    }

    function createMultiSig(address[] memory _owners, uint _signaturesRequired) public returns (address) {
        require(_owners.length > 0, "createMultiSig: min one owner");
        require(_signaturesRequired > 0 && _signaturesRequired <= _owners.length, "createMultiSig: invalid # of signatures");
        
        MetaMultiSigWallet mmsw = new MetaMultiSigWallet(CHAIN_ID, _owners, _signaturesRequired);
        mmswArray.push(mmsw);
        fund(address(mmsw));
        
        emit MultiSigWalletCreated(address(mmsw), msg.sender);
        return address(mmsw);
    }

    function fund (address _wallet) private {
        if (address(this).balance >= 0.1 ether){
            (bool sent,) = _wallet.call{value: 0.1 ether}("");
            if (!sent) revert CantFund();
        }
    }

    // 
    function getOwnedMultiSigs(address _owner) public view returns (address[] memory) {
        address[] memory ownedMS = new address[](mmswArray.length);
        uint count = 0;
        
        for (uint i = 0; i < mmswArray.length; ++i) {
            if (mmswArray[i].isOwner(_owner)){
                ownedMS[count++] = address(mmswArray[i]);
            }
        }
        
        // Resize the memory array to fit the actual number of owned multisigs
        address[] memory result = new address[](count);
        for (uint i = 0; i < count; ++i) {
            result[i] = ownedMS[i];
        }
        return result;
    }
}
