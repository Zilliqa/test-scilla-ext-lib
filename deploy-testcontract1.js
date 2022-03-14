
const { bytes, validation, BN, Long, units } = require('@zilliqa-js/util');
const {
    toBech32Address,
    getAddressFromPrivateKey,
  } = require('@zilliqa-js/crypto');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const fs = require('fs');

async function main() {
    const myArgs = process.argv.slice(2);

    if (myArgs.length < 4) {
        console.error("Wrong arguments");
        console.log("node deploy-testcontract1.js [private_key] [testnet / mainnet] [mutual_lib_addr] [addition_lib]");
        return;
    }

    let api = 'https://dev-api.zilliqa.com';
    const privateKey = myArgs[0];
    const network = myArgs[1];
    api = myArgs[1];
    const mutualLibContract = myArgs[2].toLowerCase();
    const additionLibContract = myArgs[3].toLowerCase();

    if (network === 'mainnet') {
        api = 'https://api.zilliqa.com';
    }

    console.log("network: ", api);
    console.log("MutualLib contract: ", mutualLibContract);
    console.log("AdditionLib contract: ", additionLibContract);

    const zilliqa = new Zilliqa(api);
    zilliqa.wallet.addByPrivateKey(privateKey);
    const address = getAddressFromPrivateKey(privateKey);
    const myGasPrice = units.toQa('2000', units.Units.Li);

    try {
        const networkId = await zilliqa.network.GetNetworkId();
        console.log("networkid: %o", networkId.result);

        const VERSION = bytes.pack(parseInt(networkId.result), 1);

        // deploy impl
        const implCode = fs.readFileSync(__dirname + '/contracts/TestContract1.scilla', 'utf-8');
        /*
        const init = [
            {
                "vname": "_scilla_version",
                "type": "Uint32",
                "value": "0"
            },
            {
                "vname": "_extlibs",
                "type": "List(Pair String ByStr20)",
                "value": [
                    {
                        "constructor": "Pair",
                        "argtypes": ["String", "ByStr20"],
                        "arguments": ["AdditionLib", "0x56d0c609846c3443b9fb4d6c41fc3952b121935b"]
                    },
                    {
                        "constructor": "Pair",
                        "argtypes": ["String", "ByStr20"],
                        "arguments": ["MutualLib", "0xfb61b0ae5e10f3880b75a1d4cea451c296d761f9"]
                    }
                ]
            }
        ];
        */
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
                        "arguments": ["AdditionLib", `${additionLibContract}`]
                    },
                    {
                        "constructor": "Pair",
                        "argtypes": ["String", "ByStr20"],
                        "arguments": ["MutualLib", `${mutualLibContract}`],
                    }
                ]
            }
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
