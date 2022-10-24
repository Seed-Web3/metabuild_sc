## Prerequisites

* [Node.js](/develop/prerequisites#nodejs)
* [NEAR Wallet Account](wallet.testnet.near.org)
* [NEAR-CLI](https://docs.near.org/tools/near-cli#setup)
* [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable)

## Install dependencies

```=bash
yarn install
```

## NFT METADATA Architecture
#### GLORY BADGE
{
    title, 
    description, 
    media, 
    mediaHash, 
    copies, 
    issuedAt, 
    expiresAt, 
    startsAt, 
    updatedAt, 
    extra, 
    reference, 
    referenceHash
}
#### ENDORSEMENT BADGE
{   title, 
    description, 
    text,
    media, 
    mediaHash, 
    copies, 
    issuedAt, 
    expiresAt, 
    startsAt, 
    updatedAt, 
    extra, 
    reference, 
    referenceHash
}

## Prepare workspace

Build the smart contracts
```=bash
yarn build
```

Once you've created your near wallet go ahead and login to your wallet with your cli and follow the on-screen prompts

```=bash
near login
```

Once your logged in you have to deploy the contract. Make a subaccount with the name of your choosing 

```=bash 
near create-account nft-example.your-account.testnet --masterAccount your-account.testnet --initialBalance 10
```

After you've created your sub account deploy the contract to that sub account, set this variable to your sub account name

```=bash
NFT_CONTRACT_ID=nft-example.your-account.testnet

MAIN_ACCOUNT=your-account.testnet
```

Verify your new variable has the correct value
```=bash
echo $NFT_CONTRACT_ID

echo $MAIN_ACCOUNT
```


### Deploy Your Contract
Glory Badge
```=bash
near deploy --accountId $NFT_CONTRACT_ID --wasmFile build/glory.wasm
```
Endorsement
```=bash
near deploy --accountId $NFT_CONTRACT_ID --wasmFile build/endorsement.wasm
```

### Initialize Your Contract 

```=bash
near call $NFT_CONTRACT_ID init '{"owner_id": "'$NFT_CONTRACT_ID'"}' --accountId $NFT_CONTRACT_ID
```

### View Contracts Meta Data

```=bash
near view $NFT_CONTRACT_ID nft_metadata
```
### Minting Token
Glory Badge
```bash=
near call $NFT_CONTRACT_ID nft_mint '{"token_id": "token-1", "metadata": {"title": "TEST-NFT", "description": "This is a drill", "media": "https://media.giphy.com/media/6SZ5iwN70lJyOdLZZH/giphy.gif"}, "receiver_id": "'$NFT_CONTRACT_ID'"}' --accountId $NFT_CONTRACT_ID --amount 0.1
```

Endorsement
```bash=
near call $NFT_CONTRACT_ID nft_mint '{"token_id": "token-1", "metadata": {"title": "TEST-ENDORSEMENT", "description": "This is a drill", "text": "This is the first endorsement test"}, "receiver_id": "'$NFT_CONTRACT_ID'"}' --accountId $NFT_CONTRACT_ID --amount 0.1
```

After you've minted the token go to wallet.testnet.near.org to `your-account.testnet` and look in the collections tab and check out your new sample NFT! 

## View NFT Information

After you've minted your NFT you can make a view call to get a response containing the `token_id` `owner_id` and the `metadata`

```bash=
near view $NFT_CONTRACT_ID nft_token '{"token_id": "token-1"}'
```

