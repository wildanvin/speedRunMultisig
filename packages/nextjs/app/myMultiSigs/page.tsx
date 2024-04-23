"use client";

import { type FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_TX_DATA, METHODS, Method, PredefinedTxData } from "../owners/page";
import { useIsMounted, useLocalStorage } from "usehooks-ts";
import { Address, parseEther } from "viem";
import { useChainId, useWalletClient } from "wagmi";
import * as chains from "wagmi/chains";
import { AddressInput, EtherInput, InputBase, IntegerInput } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContract, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { notification } from "~~/utils/scaffold-eth";

const MyMultiSigs: FC = () => {
  const isMounted = useIsMounted();
  const router = useRouter();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const { targetNetwork } = useTargetNetwork();

  const { data: contractInfo } = useDeployedContractInfo("MetaMultiSigWallet");

  const { data: nonce } = useScaffoldContractRead({
    contractName: "MetaMultiSigWallet",
    functionName: "nonce",
  });

  const { data: signaturesRequired } = useScaffoldContractRead({
    contractName: "MetaMultiSigWallet",
    functionName: "signaturesRequired",
  });

  const { data: metaMultiSigWallet } = useScaffoldContract({
    contractName: "MetaMultiSigWallet",
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
              value="1"
              onChange={() => {
                null;
              }}
              placeholder={"loading..."}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="mt-6 w-full">
              <label className="label">
                <span className="label-text">Owners:</span>
              </label>
            </div>

            <AddressInput
              placeholder={"Signer address"}
              value={"0x0..."}
              onChange={() => {
                null;
              }}
            />

            <button
              className="btn btn-secondary btn-sm"
              disabled={!walletClient}
              onClick={() => {
                null;
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
