
// The contract address deployed on Bsc tesnet
// https://testnet.bscscan.com 
// Neopuyo42 token creation contract address
export function getNeopuyo42ContractAddress(): string {
  return "0xd3bc037d57c93ad8ab1d8519049d52a7510cc5fa";
}

/**
 * The Contract `A`pplication `B`inary `I`nterface
 * is the standard way to interact with contracts in the Ethereum ecosystem
 */
export async function getNeopuyo42ContractABI(): Promise<any[]> {
  let ABI: any[] = [];

  await fetch("./abi/Neopuyo42.json", {
    headers : {
      'Accept': 'application.json',
      'Content-Type': 'application.json',
    }
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Error fetching ABI (Neopuyo42.json)');
    }
  }).then((data) => {
    ABI = data.abi;
  }).catch((error) => {
    throw new Error(error);
  });

  if (Array.isArray(ABI) && ABI.length > 0) {
    return ABI;
  } else {
    throw new Error('Invalid ABI format.');
  }
}
