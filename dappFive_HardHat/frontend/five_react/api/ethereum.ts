// import axios from 'axios';

// [SEEMS TOTAL FAKE WAY]

// const HARDHAT_NODE_URL = 'http://127.0.0.1:8545';
// // url: "http://10.249.1.201:8545", // Nuc Home
//     //   url: "http://192.168.122.1:8545", // 42 z1r11p5

// interface EthereumRequest {
//   method: string;
//   params?: any[];
//   id?: number;
//   jsonrpc?: string;
// }

// interface EthereumResponse {
//   jsonrpc: string;
//   id: number | null;
//   result?: any;
//   error?: { message: string; code: number };
// }

// export default async function handler(req: any, res: any) {
//   try {
//     const requestData: EthereumRequest = req.body;
//     const response = await axios.post<EthereumResponse>(HARDHAT_NODE_URL, requestData);

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while making the request.' });
//   }
// }