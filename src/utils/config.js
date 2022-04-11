import { TOKEN_ABI } from "../modules/admin/constants/tokenABI";
import { SALE_ABI } from "../modules/admin/constants/saleABI";

const CHAIN_ID_BSC = 56;
const CHAIN_ID_BSC_TESTNET = 97;

export const CONFIG = {
  CHAIN_IDS: [CHAIN_ID_BSC, CHAIN_ID_BSC_TESTNET],
  SALE_ADDRESS: "0x76272E22CB2BB90418D04f23746E1a3127Bd2f55",
  TOKEN_ADDRESS: "0x81fEd2e2d0d1Ea3838ada0F1B5B195482DbCe7B4",
  SALE_ABI,
  TOKEN_ABI,
};
