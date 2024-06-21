import { BigNumber, Contract, Wallet } from 'ethers';
import { calculatePercentOfBigNumber } from '@/utils';
import { NATIVE_TOKEN_ADDRESS } from '@/lib/lifi/constants';
import { ERC20_ABI } from '@/lib/contracts/abis/ERC_20';

export async function getMaxTransferableValue(
  wallet: Wallet,
  gasLimit: BigNumber,
  fee = BigNumber.from('0'),
  minimumEthRefuelValueWei = BigNumber.from('5000000000000000'),
) {
  const balance = await wallet.getBalance();

  const gasLimitBuffered = calculatePercentOfBigNumber(gasLimit, 110);

  const feeData = await wallet.getFeeData();

  const gas = feeData.gasPrice
    .add(feeData.maxPriorityFeePerGas)
    .mul(gasLimitBuffered);

  return balance.sub(minimumEthRefuelValueWei).sub(gas).sub(fee);
}

export async function getFromWallet(
  wallet: Wallet,
  tokenAddress: string,
  percentAmount?: number,
) {
  let balance: BigNumber;

  if (tokenAddress === NATIVE_TOKEN_ADDRESS)
    balance = await wallet.getBalance();
  else {
    const contract = new Contract(tokenAddress, ERC20_ABI, wallet);
    balance = (await contract.balanceOf(wallet.address)) as BigNumber;
  }

  return percentAmount
    ? calculatePercentOfBigNumber(balance, percentAmount)
    : balance;
}
