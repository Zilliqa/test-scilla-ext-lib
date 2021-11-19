# Testing Scilla Ext. Libraries

This repository is for testing the user-defined libraries for Scilla. See https://scilla.readthedocs.io/en/latest/scilla-in-depth.html#user-defined-libraries-on-the-blockchain.

## How to Use

1. Install ZilliqaJS.
```
yarn
```

2. Deploy the sample external library: `AdditionLib`

```
node deploy-ext-lib.js [private_key] [testnet]
```

Note down the AdditionLib contract address.

3. Deploy the sample contract that imports `AdditionLib`

```
node deploy-contract.js [private_key] [testnet] [ext_lib_addr]
```

Note down this contract.

4. Execute the `addNumWithExtLib` transition

```
node call-add-num-ext-lib.js [private_key] [testnet] [contract_address_from_(3)] [num_a] [num_b]
```

## Sample Contracts
Ext lib address: [0xcb73b4952aebc1e2b4c1ed599147475a74c687ce](https://viewblock.io/zilliqa/address/0xcb73b4952aebc1e2b4c1ed599147475a74c687ce?network=testnet)

Contract (import ext lib and used it): [0x4e764160bba7f0ee581464119b8d6fa529651098](https://viewblock.io/zilliqa/address/0x4e764160bba7f0ee581464119b8d6fa529651098=testnet)

`addNumWithExtLib`: https://viewblock.io/zilliqa/tx/0xdb462c6153d96b5242bd876c120afac8f5a058ea65791dad77470b3a304bad9e?network=testnet