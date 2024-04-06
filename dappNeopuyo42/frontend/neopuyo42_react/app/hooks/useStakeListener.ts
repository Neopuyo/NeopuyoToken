// import { useEffect, useState } from "react"
// import { ethers } from "ethers";
// import { IWeb3Context, useWeb3Context } from "@/context/Web3Context";
// import { getNeopuyo42ContractABI, getNeopuyo42ContractAddress } from "tools/getNeopuyo42ContractDatas";
// import useNeopuyo42Contract from "./useNeopuyo42Contract";


// const useStakeListener = (contract: ethers.Contract) => {

//   const neopuyo42Contract = useNeopuyo42Contract();
//   const [stakeNeedRefresh, setStakeNeedRefresh] = useState<boolean>(false);

//   useEffect(() => {
//     if (!neopuyo42Contract) return;
//     let mounted = true;

//     async function createStakeListener(contract: ethers.Contract) {
//       try {
//           // const contract = await neopuyo42Contract;
//           if (!contract) {
//             throw new Error("neopuyo42Contract is null");
//           }
//           contract?.on("Staked", async (stakerRaw: string, amount: any) => {
//           console.log("Staked event : ", stakerRaw, amount.toString());
//           const staker = ethers.getAddress(stakerRaw).toLowerCase();
//           console.log("StakerRaw: ", stakerRaw, " => ", staker);
//           console.log("Current user: ", window.ethereum.address);
//           if (staker === window.ethereum.address) {
//             console.log("Staked event from current user, refreshing states...");
//             setStakeNeedRefresh(true);
//           }
//         });
//       } catch (error) {
//         console.error("Error listener:", (error as Error).message);
//       }
//     }

//     async function rmStakeListener(contract: ethers.Contract) {
//         await contract?.removeAllListeners("Staked");
//     }

//     if (mounted) {
//       createStakeListener(contract);
//     }

//     return () => {
//       mounted = false;
//       rmStakeListener(contract);
//     };

//   }, [neopuyo42Contract]);

//   return { stakeNeedRefresh, setStakeNeedRefresh }
// };

// export default useStakeListener;


// const useStakedEvent = (contract:) => {
//   const {
//     web3: { provider },
//   } = useWeb3Context() as IWeb3Context;

//   const [needRefreshStake, setNeedRefreshStake] = useState(false);

//   useEffect(() => {

//     let mounted = true;
//     let contract: ethers.Contract | null = null;

//     const promise = getNeopuyo42ContractABI();

//     const handleStakedEvent = async (stakerRaw: string, amount: any) => {
//       console.log("Staked event : ", stakerRaw, amount.toString());
//       const staker = ethers.getAddress(stakerRaw).toLowerCase();
//       console.log("StakerRaw: ", stakerRaw, " => ", staker);
//       if (staker === window.ethereum.address) {
//         console.log("Staked event from current user, refreshing states...");
//         setNeedRefreshStake(true);
//       }
//     };

//     const createStakeListener = async () => {
//       try {
//         const contractAddress = getNeopuyo42ContractAddress();
//         const abi = await promise;
//         const signer = await provider?.getSigner();
//         contract = new ethers.Contract(contractAddress, abi, signer);
//         contract.on("Staked", handleStakedEvent);
//       } catch (error) {
//         console.error("Error listener:", (error as Error).message);
//       }
//     };

//     if (mounted) {
//       createStakeListener();
//     }

//     return () => {
//       mounted = false;
//       contract?.off("Staked", handleStakedEvent);

//     };
//   }, []);

//   return { needRefreshStake, setNeedRefreshStake };
// };

// export default useStakedEvent;