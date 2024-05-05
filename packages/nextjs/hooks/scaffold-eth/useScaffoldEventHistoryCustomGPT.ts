import { useEffect, useMemo, useState } from "react";
import { Abi, AbiEvent, ExtractAbiEventNames } from "abitype";
import { useInterval } from "usehooks-ts";
import { Hash } from "viem";
import * as chains from "viem/chains";
import { usePublicClient } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { replacer } from "~~/utils/scaffold-eth/common";
import {
  ContractAbi,
  ContractName,
  UseScaffoldEventHistoryConfig,
  UseScaffoldEventHistoryData,
} from "~~/utils/scaffold-eth/contract";

export const useScaffoldEventHistoryCustom = <
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
  TBlockData extends boolean = false,
  TTransactionData extends boolean = false,
  TReceiptData extends boolean = false,
>({
  contractAddress,
  eventName,
  fromBlock,
  filters,
  blockData,
  transactionData,
  receiptData,
  watch,
  enabled = true,
}: UseScaffoldEventHistoryConfig<TContractName, TEventName, TBlockData, TTransactionData, TReceiptData> & {
  contractAddress: string;
}) => {
  const [events, setEvents] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const publicClient = usePublicClient();

  const readEvents = async () => {
    setIsLoading(true);
    try {
      if (!enabled || !contractAddress) {
        throw new Error("Hook disabled or contract address missing");
      }

      const event = {
        type: "event",
        name: eventName,
        // Define or retrieve the ABI for the event
      } as AbiEvent;

      const blockNumber = await publicClient.getBlockNumber({ cacheTime: 0 });

      const logs = await publicClient.getLogs({
        address: contractAddress,
        event,
        args: filters as any, // TODO: Adjust type casting
        fromBlock,
        toBlock: blockNumber,
      });

      const newEvents = logs.map(log => ({
        log,
        args: log.args,
        // You can add block, transaction, and receipt data based on flags
      }));

      setEvents(newEvents);
      setError(undefined);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      readEvents();
    }
  }, [
    enabled,
    contractAddress,
    eventName,
    JSON.stringify(filters),
    fromBlock,
    blockData,
    transactionData,
    receiptData,
  ]);

  useInterval(
    () => {
      if (watch && enabled) {
        readEvents();
      }
    },
    watch ? scaffoldConfig.pollingInterval : null,
  );

  return {
    data: events,
    isLoading,
    error,
  };
};
