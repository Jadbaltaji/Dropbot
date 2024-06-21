/* eslint-disable @typescript-eslint/no-var-requires */
const Vault = require('hashi-vault-js');
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VaultService extends Vault {
  private readonly logger = new Logger(VaultService.name);

  constructor() {
    super({
      https: process.env.VAULT_URL.startsWith('https'),
      baseUrl: process.env.VAULT_URL,
      timeout: 2000,
      proxy: false,
    });
  }

  async deleteSecret(name: string) {
    const token = await this.getToken();
    this.logger.log(`VAULT Delete: ${name}`);
    return await this.eliminateKVSecret(token, name);
  }

  async getAll() {
    const token = await this.getToken();
    return await this.listKVSecrets(token);
  }

  private async getToken() {
    const token = await this.loginWithAppRole(
      process.env.VAULT_ROLE_ID,
      process.env.VAULT_SECRET_ID,
    );

    if ('client_token' in token) return token.client_token;

    throw new Error('Unable to login.');
  }

  async getSecret<T extends Record<string, string> = Record<string, string>>(
    name: string,
  ): Promise<T> {
    this.logger.log(`VAULT GET: ${name}`);
    const token = await this.getToken();
    const secrets = await this.readKVSecret(token, name);

    if ('data' in secrets) return secrets.data as T;

    throw new Error(`Unable to get secret for ${name}.`);
  }

  async createSecret(name: string, data: Record<string, string>) {
    this.logger.log(`VAULT CREATE: ${name}`);
    const token = await this.getToken();
    return await this.createKVSecret(token, name, data);
  }
}
