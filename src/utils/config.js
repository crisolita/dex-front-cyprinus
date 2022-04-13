import { TOKEN_ABI } from "../modules/admin/constants/tokenABI";
import { SALE_ABI } from "../modules/admin/constants/saleABI";

const CHAIN_ID_BSC = 56;
const CHAIN_ID_BSC_TESTNET = 97;

export const CONFIG = {
  CHAIN_IDS: [CHAIN_ID_BSC, CHAIN_ID_BSC_TESTNET],
  SALE_ADDRESS: "0xaF30373e7684237D4515bf6Da0E8de1ea1944944",
  TOKEN_ADDRESS: "0xaE328bc06F8a763272203B9A011c355fEC15dfCf",
  SALE_ABI,
  TOKEN_ABI,
};
