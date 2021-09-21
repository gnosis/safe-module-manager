const REACT_APP_ETHERSCAN_KEY = process.env.REACT_APP_ETHERSCAN_KEY;

export enum ETHEREUM_NETWORK {
  MAINNET = 1,
  RINKEBY = 4,
  XDAI = 100,
  POLYGON = 137,
}

interface ExplorerData {
  networkExplorerName: string;
  networkExplorerUrl: string;
  networkExplorerApiUrl: string;
  safeTransactionApi: string;
  safeUrl: string;
  explorerApiKey?: string;
  verifyContractUrl: string;
}

export const EXPLORERS_CONFIG: Record<ETHEREUM_NETWORK, ExplorerData> = {
  [ETHEREUM_NETWORK.MAINNET]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://etherscan.io",
    networkExplorerApiUrl: "https://api.etherscan.io/api",
    safeTransactionApi: "https://safe-transaction.gnosis.io/",
    safeUrl: "https://gnosis-safe.io/",
    verifyContractUrl: "https://etherscan.io/verifyContract",
    explorerApiKey: REACT_APP_ETHERSCAN_KEY,
  },
  [ETHEREUM_NETWORK.RINKEBY]: {
    networkExplorerName: "Etherscan",
    networkExplorerUrl: "https://rinkeby.etherscan.io",
    networkExplorerApiUrl: "https://api-rinkeby.etherscan.io/api",
    safeTransactionApi: "https://safe-transaction.rinkeby.gnosis.io/",
    safeUrl: "https://rinkeby.gnosis-safe.io/",
    verifyContractUrl: "https://rinkeby.etherscan.io/verifyContract",
    explorerApiKey: REACT_APP_ETHERSCAN_KEY,
  },
  [ETHEREUM_NETWORK.XDAI]: {
    networkExplorerName: "Blockscout",
    networkExplorerUrl: "https://blockscout.com/poa/xdai",
    networkExplorerApiUrl: "https://blockscout.com/xdai/mainnet/api",
    safeUrl: "https://xdai.gnosis-safe.io/",
    safeTransactionApi: "https://safe-transaction.xdai.gnosis.io/",
    verifyContractUrl:
      "https://docs.blockscout.com/for-users/smart-contract-interaction/verifying-a-smart-contract",
  },
  [ETHEREUM_NETWORK.POLYGON]: {
    networkExplorerName: "Polygonscan",
    networkExplorerUrl: "https://polygonscan.com",
    networkExplorerApiUrl: "https://api.polygonscan.com/api",
    safeUrl: "https://polygon.gnosis-safe.io/",
    safeTransactionApi: "https://safe-transaction.polygon.gnosis.io/",
    verifyContractUrl: "https://polygonscan.com/verifyContract",
    explorerApiKey: REACT_APP_ETHERSCAN_KEY,
  },
};

export const getNetworkExplorerInfo = (chainId: number) => {
  const networkBaseConfig = EXPLORERS_CONFIG[chainId as ETHEREUM_NETWORK];
  if (!networkBaseConfig) return;
  return {
    name: networkBaseConfig.networkExplorerName,
    url: networkBaseConfig.networkExplorerUrl,
    apiUrl: networkBaseConfig.networkExplorerApiUrl,
    apiKey: networkBaseConfig.explorerApiKey,
    safeTransactionApi: networkBaseConfig.safeTransactionApi,
    safeUrl: networkBaseConfig.safeUrl,
    verifyUrl: networkBaseConfig.verifyContractUrl,
  };
};

export const getExplorerInfo = (chainId: number, hash: string) => {
  const explorerData = getNetworkExplorerInfo(chainId);
  if (!explorerData) return;
  const type = hash.length > 42 ? "tx" : "address";
  return () => ({
    url: `${explorerData.url}/${type}/${hash}`,
    alt: explorerData.name,
  });
};
