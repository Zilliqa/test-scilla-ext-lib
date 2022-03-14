const { bytes, BN, Long, units } = require('@zilliqa-js/util');
const {
    toBech32Address,
    getAddressFromPrivateKey,
  } = require('@zilliqa-js/crypto');
const { Zilliqa } = require('@zilliqa-js/zilliqa');


async function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 4) {
        console.error("Wrong arguments\n");
        console.log("node call-add-num-ext-lib.js [private_key] [testnet / mainnet] [contract1_address] [contract_2 address]");
        return;
    }

    let api = 'https://dev-api.zilliqa.com';

    const privateKey = myArgs[0];
    const network = myArgs[1];
    api = myArgs[1];
    const addressContract1 = myArgs[2];
    const addressContract2 = myArgs[3];

    if (network === 'mainnet') {
        api = 'https://api.zilliqa.com';
    }

    console.log("network: ", api);
    console.log("calling contract: ", addressContract1);
    console.log("called contract: ", addressContract2);

    const zilliqa = new Zilliqa(api);
    zilliqa.wallet.addByPrivateKey(privateKey);
    const myGasPrice = units.toQa('2000', units.Units.Li);

    try {
        const networkId = await zilliqa.network.GetNetworkId();
        console.log("networkid: %o", networkId.result);

        const VERSION = bytes.pack(parseInt(networkId.result), 1);

        const contract = zilliqa.contracts.at(addressContract1);

        const callTx = await contract.call(
            'Sending',
            [{
                vname: "c2",
                type : "ByStr20",
                value: `${addressContract2}`
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