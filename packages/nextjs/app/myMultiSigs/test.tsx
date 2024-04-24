import { type FC, useEffect, useState } from "react";
import { getAccount } from "@wagmi/core";
import { useIsMounted } from "usehooks-ts";
import { useWalletClient } from "wagmi";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";

const MyMultiSigs: FC = () => {
  const isMounted = useIsMounted();
  const account = getAccount();
  const [addresses, setAddresses] = useState<string[]>([]);

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

  return isMounted() ? (
    <div className="flex flex-col flex-1 items-center my-20 gap-8">
      <div className="flex items-center flex-col flex-grow w-full max-w-lg">
        <div className="flex flex-col bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl w-full p-6">
          <div>
            <label className="label">
              <span className="label-text">Signatures required</span>
            </label>
            <IntegerInput value="1" onChange={() => null} placeholder={"loading..."} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="mt-6 w-full">
              <label className="label">
                <span className="label-text">Owners:</span>
              </label>
            </div>

            {addresses.map((address, index) => (
              <div key={index} className="flex gap-2">
                <AddressInput
                  disabled={index === 0}
                  placeholder="Enter signer address"
                  value={address}
                  onChange={e => updateAddress(index, e)}
                />
                <button
                  className="btn btn-error"
                  onClick={() => removeAddressInput(index)}
                  disabled={addresses.length === 1} // **Added: Disable if only one input**
                >
                  -
                </button>
              </div>
            ))}

            <button className="btn btn-primary" onClick={addAddressInput}>
              +
            </button>

            <button className="btn btn-secondary btn-sm" disabled={!walletClient} onClick={() => null}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default MyMultiSigs;
