
const { bytes, validation, BN, Long, units } = require('@zilliqa-js/util');
const {
    toBech32Address,
    getAddressFromPrivateKey,
  } = require('@zilliqa-js/crypto');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const fs = require('fs');

async function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 3) {
        console.error("Wrong arguments");
        console.log("node deploy-contract.js [private_key] [testnet / mainnet] [mutual_ext_lib_addr]");
        return;
    }

    let api = 'https://dev-api.zilliqa.com';
    const privateKey = myArgs[0];
    const network = myArgs[1];
    api = myArgs[1];
    const extLibContract = myArgs[2];

    if (network === 'mainnet') {
        api = 'https://api.zilliqa.com';
    }

    console.log("network: ", api);
    console.log("mutual lib : ", extLibContract);

    const zilliqa = new Zilliqa(api);
    zilliqa.wallet.addByPrivateKey(privateKey);
    const address = getAddressFromPrivateKey(privateKey);
    const myGasPrice = units.toQa('2000', units.Units.Li);

    try {
        const networkId = await zilliqa.network.GetNetworkId();
        console.log("networkid: %o", networkId.result);

        const VERSION = bytes.pack(parseInt(networkId.result), 1);

        // deploy impl
        const implCode = fs.readFileSync(__dirname + '/contracts/TestContract2.scilla', 'utf-8');
        const init = [
            {
                vname: '_scilla_version',
                type: 'Uint32',
                value: '0',
            },
            {
                vname: '_extlibs',
                type: 'List(Pair String ByStr20)',
                value: [
                    {
                        "constructor": "Pair",
                        "argtypes": ["String", "ByStr20"],
                        "arguments": ["MutualLib", `${extLibContract}`],
                    }
                ],
            },
        ];
        const implContract = zilliqa.contracts.new(implCode, init);
        const [deployedTx, implState] = await implContract.deploy(
            {
                version: VERSION,
                gasPrice: myGasPrice,
                gasLimit: Long.fromNumber(30000),
            },
            33,
            1000,
            false,
        );
        console.log(JSON.stringify(deployedTx, null, 4))
        console.log("contract address: %o", implState.address);
    } catch (err) {
        console.error(err);
    }
}

main();