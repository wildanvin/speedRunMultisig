import React, { useState } from "react";
import { Address } from "~~/components/scaffold-eth";

const walletAddresses: string[] = [
  "0x93496ef70EA5A1635B52CdEcbB73cc0360619cE7",
  "0x92496ef70EA5A1635B52CdEcbB73cc0360619cE7",
];

export const DisplayMultiSigs: React.FC = () => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleSelectionChange = (address: string): void => {
    setSelectedWallet(prevSelectedWallet => (prevSelectedWallet === address ? null : address));
  };

  return (
    <div className="flex flex-col flex-1 items-center mb-20 mt-12 gap-8">
      <div className="flex items-center flex-col flex-grow w-full max-w-lg">
        Your Multisigs:
        <div className="flex flex-col bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl w-full p-6">
          <div className="flex flex-col gap-4">
            <ul className="space-y-2">
              {walletAddresses.map((address, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedWallet === address}
                    onChange={() => handleSelectionChange(address)}
                    className="w-8 h-8 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Address address={address} format="long" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
