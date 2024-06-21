#!/usr/bin/env bash

# Vars
export VAULT_ADDR='http://127.0.0.1:8200'

vault login myroot

# Initialize Vault
vault auth enable approle

# Create a policy for the app
cat <<EOF | vault policy write bot -
path "secret/*" {
    capabilities = ["create", "read", "update", "delete", "list"]
}

path "auth/approle/login" {
    capabilities = ["create"]
}
EOF

# Create a role for the app
vault write auth/approle/role/bot policies=bot

# Get the role ID
vault read auth/approle/role/bot/role-id

# Get the secret ID
vault write -f auth/approle/role/bot/secret-id