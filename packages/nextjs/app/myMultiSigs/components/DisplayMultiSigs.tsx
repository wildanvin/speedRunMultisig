import React, { useState } from "react";
import { getAccount } from "@wagmi/core";
import { useLocalStorage } from "usehooks-ts";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const DisplayMultiSigs: React.FC = () => {
  // const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [selectedMS, setSelectedMS] = useLocalStorage<string | null>("selectedMS", null);

  const account = getAccount();

  const handleSelectionChange = (address: string): void => {
    // setSelectedWallet(prevSelectedWallet => (prevSelectedWallet === address ? null : address));
    setSelectedMS(prevSelectedWallet => (prevSelectedWallet === address ? null : address));
  };

  const { data: ownedMS } = useScaffoldContractRead({
    contractName: "FactoryMultiSig",
    functionName: "getOwnedMultiSigs",
    args: [account?.address],
  });

  return (
    <div className="flex flex-col flex-1 items-center mb-20 mt-12 gap-8">
      <div className="flex items-center flex-col flex-grow w-full max-w-lg">
        Your Multi Sigs:
        <div className="flex flex-col bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl w-full p-6">
          {ownedMS && ownedMS.length > 0 ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-2">
                {ownedMS.map((address, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="inline-flex items-center">
                      <label
                        className="relative flex items-center p-3 rounded-full cursor-pointer"
                        htmlFor={`check-${index}`}
                      >
                        <input
                          type="checkbox"
                          className="peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-200 transition-all before:absolute before:top-1/2 before:left-1/2 before:block before:h-12 before:w-12 before:-translate-y-1/2 before:-translate-x-1/2 before:rounded-full before:bg-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                          id={`check-${index}`}
                          checked={selectedMS === address}
                          onChange={() => handleSelectionChange(address)}
                        />
                        <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 peer-checked:opacity-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </label>
                      <label
                        className="mt-px font-light text-gray-700 cursor-pointer select-none"
                        htmlFor={`check-${index}`}
                      >
                        <Address address={address} format="short" />
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-lg font-medium text-center text-gray-600">No Multi Sigs for you yet</div>
          )}
        </div>
      </div>
    </div>
  );
};
