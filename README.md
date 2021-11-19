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

## Possible Bug?
Transitions cannot be executed when we import an external library. I suspect it is due to the declaration `_library` = `True` when we deploy a contract that imports an external library. The declaration is requried but at the same time it seems to treat the entire contract as a library and as a result, tranisitons cannot be executed?

### Reproduce

1. Change directory to `bug` folder.

2. Deploy this contract2 which imports an ext library but doesn't use it.

```
node deploy-contract2.js [private_key] [testnet] [ext_lib_addr]
```

Note this contract address.

3. Execute the `addNum` transition

```
node call-add-num-ext-lib.js [private_key] [testnet] [contract_address_from_(2)] [num_a] [num_b]
```

Observe that the transition seem to be stuck.

## Sample Contracts
Ext lib address: [0xcb73b4952aebc1e2b4c1ed599147475a74c687ce](https://viewblock.io/zilliqa/address/0xcb73b4952aebc1e2b4c1ed599147475a74c687ce?network=testnet)

Contract (import ext lib and used it): [0xf9b28ac19636656646b2938895665850649219e8](https://viewblock.io/zilliqa/address/0xf9b28ac19636656646b2938895665850649219e8=testnet)

Contract2 (import ext lib but don't used it): [0x7a3b96d79b628ede9cac04d186983b992a385801](https://viewblock.io/zilliqa/address/0x7a3b96d79b628ede9cac04d186983b992a385801=testnet)