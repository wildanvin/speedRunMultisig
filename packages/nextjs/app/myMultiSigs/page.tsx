"use client";

import { type FC, useEffect, useState } from "react";
import { getAccount } from "@wagmi/core";
import { useIsMounted, useLocalStorage } from "usehooks-ts";
import { useWalletClient } from "wagmi";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const MyMultiSigs: FC = () => {
  //STATE:
  const isMounted = useIsMounted();
  const account = getAccount();

  const [addresses, setAddresses] = useState<string[]>([]);
  const [signaturesRequired, setSignaturesRequired] = useState<string | bigint>("1");

  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (account.address) {
      setAddresses([account.address]);
    } else {
      setAddresses(["Connect Wallet"]);
    }
  }, [account.address]);

  const addAddressInput = () => {
    setAddresses([...addresses, ""]);
  };

  const updateAddress = (index: number, newValue: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = newValue;
    setAddresses(newAddresses);
  };

  const removeAddressInput = (index: number) => {
    setAddresses(addresses.filter((_, idx) => idx !== index));
  };

  const handleSignaturesRequiredChange = (newValue: string | bigint) => {
    setSignaturesRequired(newValue);
  };

  //BLOCKCHAIN:
  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "FactoryMultiSig",
    functionName: "createMultiSig",
    args: [addresses, BigInt(signaturesRequired)],
    //const value = typeof newValue === 'string' ? parseInt(newValue, 10) : Number(newValue.toString());
  });

  return isMounted() ? (
    <div className="flex flex-col flex-1 items-center my-20 gap-8">
      <div className="flex items-center flex-col flex-grow w-full max-w-lg">
        <div className="flex flex-col bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl w-full p-6">
          <div>
            <label className="label">
              <span className="label-text">Signatures required</span>
            </label>
            <IntegerInput
              value={signaturesRequired.toString()}
              onChange={e => handleSignaturesRequiredChange(e)}
              placeholder={"loading..."}
              disableMultiplyBy1e18={true}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="mt-6 w-full">
              <label className="label">
                <span className="label-text">Owners:</span>
              </label>
            </div>

            {addresses.map((address, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-grow">
                  {" "}
                  {/* AddressInput container */}
                  <AddressInput
                    // Ensure AddressInput takes the full width of its parent div
                    disabled={index === 0}
                    placeholder="Enter signer address"
                    value={address}
                    onChange={e => updateAddress(index, e)}
                  />
                </div>
                <button
                  className={`flex items-center justify-center rounded-full h-6 w-6 text-xl leading-none p-0 ${
                    index === 0 ? "bg-gray-400 text-gray-200" : "bg-red-500 text-white"
                  }`} // Conditional styling for the button
                  onClick={() => removeAddressInput(index)}
                  disabled={index === 0} // Disable the first minus button
                >
                  &ndash; {/* En dash for the minus sign */}
                </button>
              </div>
            ))}

            <div className="flex justify-center">
              {" "}
              <button
                className="flex items-center justify-center rounded-full h-6 w-6 text-xl leading-none p-0 bg-green-500 text-white"
                onClick={addAddressInput}
              >
                +
              </button>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              disabled={!walletClient}
              onClick={async () => {
                try {
                  await writeAsync();
                } catch (e) {
                  console.error("Error creating MultiSig", e);
                }
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default MyMultiSigs;
