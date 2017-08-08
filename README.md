# btc_wallet

> BTC Wallet

## Setup
- `docker-compose build`
- `docker-compose run wallet npm install`

## Run
-  `docker-compose up -d`

## Plan for lesson 2

### fee
- bitcore estimate fee
- better satoshi/byte
- child fee for parent
- replace by fee
- https://slack-redir.net/link?url=https%3A%2F%2Fen.bitcoin.it%2Fwiki%2FRunning_Bitcoin%23Bitcoin.conf_Configuration_File
- fee and vout should be more than (min relay tx fee * 3)

### hd wallets
- bip32 https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
- check 20 for external 20 for internal, until 1 account empty
- some funds on a3580f8f87e6b59b80df424d63e137ff884866d8866737d3ef8a8b149bfe9749f88876e3366e7409831067239be2667eed60d70f3a3818756baf9444350a3bba seed in real net
- mnemonic phrase for seed
