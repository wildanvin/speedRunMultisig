"use client";

import { type FC } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useReadLocalStorage } from "usehooks-ts";
import { TransactionEventItem } from "~~/components/TransactionEventItem";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldEventHistory, useScaffoldEventHistoryCustom } from "~~/hooks/scaffold-eth";

const Multisig: FC = () => {
  //const { data: contractInfo } = useDeployedContractInfo("MetaMultiSigWallet");

  const selectedMS = useReadLocalStorage("selectedMS")?.toString();

  if (!selectedMS) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Select a Multi Sig or create one</h1>
      </div>
    );
  }

  // const contractAddress = contractInfo?.address;

  // const { data: executeTransactionEvents } = useScaffoldEventHistory({
  //   contractName: "MetaMultiSigWallet",
  //   eventName: "ExecuteTransaction",
  //   fromBlock: 0n,
  // });

  const { data: executeTransactionEvents } = useScaffoldEventHistoryCustom({
    contractName: "MetaMultiSigWallet",
    contractAddress: selectedMS,
    eventName: "ExecuteTransaction",
    fromBlock: 5852713n,
  });

  return (
    <div className="flex items-center flex-col flex-grow w-full my-20 gap-8">
      <div className="flex flex-col gap-4 items-center bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 w-full max-w-lg">
        <Balance address={selectedMS} />
        <QRCodeSVG value={selectedMS || ""} size={256} />
        <Address address={selectedMS} />
      </div>

      <div className="flex flex-col mt-10 items-center bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 w-full max-w-3xl">
        <div className="text-xl font-bold my-2">Events:</div>
        {executeTransactionEvents?.map(txEvent => (
          <TransactionEventItem key={txEvent.args.hash} {...txEvent.args} />
        ))}
      </div>
    </div>
  );
};

export default Multisig;
