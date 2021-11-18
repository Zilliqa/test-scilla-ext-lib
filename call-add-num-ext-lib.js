const { bytes, BN, Long, units } = require('@zilliqa-js/util');
const {
    toBech32Address,
    getAddressFromPrivateKey,
  } = require('@zilliqa-js/crypto');
const { Zilliqa } = require('@zilliqa-js/zilliqa');


async function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 5) {
        console.error("Wrong arguments\n");
        console.log("node call-add-num-ext-lib.js [private_key] [testnet / mainnet] [add_num_contract_address] [number_a] [number_b]");
        return;
    }

    let api = 'https://dev-api.zilliqa.com';

    const privateKey = myArgs[0];
    const network = myArgs[1];
    const addNumContract = myArgs[2];
    const numA = myArgs[3];
    const numB = myArgs[4];

    if (network === 'mainnet') {
        api = 'https://api.zilliqa.com';
    }

    console.log("network: ", api);
    console.log("contract: ", addNumContract);
    console.log("Number a: ", numA);
    console.log("Number b: ", numB);

    const zilliqa = new Zilliqa(api);
    zilliqa.wallet.addByPrivateKey(privateKey);
    const myGasPrice = units.toQa('2000', units.Units.Li);

    try {
        const networkId = await zilliqa.network.GetNetworkId();
        console.log("networkid: %o", networkId.result);

        const VERSION = bytes.pack(parseInt(networkId.result), 1);

        const contract = zilliqa.contracts.at(addNumContract);

        const callTx = await contract.call(
            'addNumWithExtLib',
            [
                {
                    vname: "a",
                    type: "Uint128",
                    value: `${numA}`,
                },
                {
                    vname: "b",
                    type: "Uint128",
                    value: `${numB}`,
                },
            ],
            {
                version: VERSION,
                amount: new BN(0),
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(10000),
            },
            33,
            1000,
            false
        );
        console.log(JSON.stringify(callTx, null, 4));
    } catch (err) {
        console.error(err);
    }

}

main()