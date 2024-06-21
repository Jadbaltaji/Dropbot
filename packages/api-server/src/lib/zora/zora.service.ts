import { Injectable } from '@nestjs/common';
import { ZDK, ZDKNetwork, ZDKChain } from '@zoralabs/zdk';
import { Address } from '@dethcrypto/eth-sdk';
import { sdk } from '../contracts';
import { ethers } from 'ethers';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ZoraService {
  constructor(private readonly httpService: HttpService) {}
  async getRecentMint(address: Address, network: ZDKNetwork, chain: ZDKChain) {
    const endpoint = 'https://api.zora.co/graphql';
    const networkInfo = {
      network,
      chain,
    };

    const zdk = new ZDK({ endpoint, networks: [networkInfo] });

    const { mints } = await zdk.mints({
      where: {
        minterAddresses: [address],
      },
    });

    const recentMint = mints.nodes[0].mint.collectionAddress;

    return recentMint;
  }

  async getBaseRecentMint() {
    const contract = await this.getRecentMint(
      '0x9477861457123C55cD34C608068c58af2BFF5DC8',
      ZDKNetwork.Base,
      ZDKChain.BaseMainnet,
    );

    const baseScanUrl =
      'https://api.basescan.org/api?module=contract&action=getabi&address=';

    const contractAbi = await firstValueFrom(
      this.httpService.get<Record<string, unknown>>(
        baseScanUrl + contract + '&apikey=' + process.env.BASE_SCAN_API_KEY,
      ),
    );

    return contractAbi.data;
  }

  baseMint(wallet: ethers.Wallet) {
    sdk['base'](wallet).omniChainAdventures2.mint(1);
  }
}
