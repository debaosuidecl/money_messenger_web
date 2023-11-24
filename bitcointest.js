let axios = require("axios");
const sdk = require("api")("@blockdaemon/v1.0#2skca2tlkwraztf");
const bitcore = require("bitcore-lib");

async function checkBalance() {
  try {
    // const sochain_network = "BTC"
    const rand_buffer = bitcore.crypto.Random.getRandomBuffer(32);
    const rand_number = bitcore.crypto.BN.fromBuffer(rand_buffer);
    const PrivateKey = new bitcore.PrivateKey(rand_number);

    const address = PrivateKey.toAddress();

    console.log(address.toString(), PrivateKey.toWIF());

    sdk.auth("2go1YqUcuAr4WZ2-3WgSD3c7qpatZqQuNWhTVBldKZnTSUtw");
    sdk.server("https://svc.blockdaemon.com/universal/v1");
    const addressData = await sdk.getListOfBalancesByAddress({
      protocol: "bitcoin",
      network: "mainnet",
      address: address.toString(),
    });

    console.log({ addressData: addressData.data });
    /**
         * expects:
         * [
                {
                currency: [Object],
                confirmed_balance: '0',
                pending_balance: '0',
                confirmed_block: 801695
                }
  ]
         */
  } catch (error) {
    console.log(error);
  }
}

function generateNewAddress() {
  const rand_buffer = bitcore.crypto.Random.getRandomBuffer(32);
  const rand_number = bitcore.crypto.BN.fromBuffer(rand_buffer);
  const PrivateKey = new bitcore.PrivateKey(rand_number);

  const address = PrivateKey.toAddress();

  console.log(address.toString(), PrivateKey.toWIF());
  return {
    address: address.toString(),
    privateKey: PrivateKey.toWIF(),
  };
}

async function estimateGasFee() {
  try {
    // const sochain_network = "BTC"
    const sdk = require("api")("@blockdaemon/v1.0#2skca2tlkwraztf");

    sdk.auth("2go1YqUcuAr4WZ2-3WgSD3c7qpatZqQuNWhTVBldKZnTSUtw");
    sdk.server("https://svc.blockdaemon.com/universal/v1");
    res = await sdk.getFeeEstimate({ protocol: "bitcoin", network: "testnet" });

    return res;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function getListOfUnspentOutput(
  address = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  network = "mainnet"
) {
  try {
    const sdk = require("api")("@blockdaemon/v1.0#2skca2tlkwraztf");

    sdk.auth("2go1YqUcuAr4WZ2-3WgSD3c7qpatZqQuNWhTVBldKZnTSUtw");
    sdk.server("https://svc.blockdaemon.com/universal/v1");
    const res = await sdk.getUTXOByAccount({
      spent: false,
      order: "desc",
      page_size: "1000",
      protocol: "bitcoin",
      network,
      // address
      address,
    });

    /**
         * 
         *    utxo.satoshis = Math.floor(Number(element.value) * 100000000);
            utxo.script = element.script_hex;
            utxo.address = utxos.data.data.address;
            utxo.txId = element.txid;
            utxo.outputIndex = element.output_no;
            totalAmountAvailable += utxo.satoshis;
            inputCount += 1;
         */
    return {
      utxos: res.data.data.map((element) => ({
        satoshis: element.value,
        address,
        txId: element.mined.tx_id,
        outputIndex: element.mined.index,
        totalAmountAvailable: res.data.data.reduce((prev, curr) => {
          return prev + curr.value;
        }, 0),
        inputCount: res.data.data.length,
      })),
      totalAmountAvailable: res.data.data.reduce((prev, curr) => {
        return prev + curr.value;
      }, 0),
      inputCount: res.data.data.length,
    };
  } catch (error) {
    console.log(error);
    return false;
  }
}

// console.log(getListOfUnspentOutput());

// checkBalance()
// estimateGasFee();

async function main(satoshiToSend) {
  // let satoshiToSend
  const transaction = new bitcore.Transaction();

  const { address, privateKey } = generateNewAddress();
  const outputCount = 2;
  let fee = 0;
  const unspentData = await getListOfUnspentOutput(address, "mainnet");
  if (!unspentData)
    return console.log(
      "an error occured when trying to retrieve unspent data: ",
      unspentData
    );

  const { utxos, totalAmountAvailable, inputCount } = unspentData;

  /**
   *
   * if there is no
   */
  console.log(utxos, "unpsent outputs ");
  let transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount;
  fee = transactionSize * 20;
  console.log(transactionSize, "transaction size :)");
  console.log(fee, "Fee :)");

  // if (totalAmountAvailable - satoshiToSend - fee < 0) {
  //     throw new Error("Balance is too low for this transaction");
  // }
  const inputs = [...utxos];
  const recieverAddress = "1A9jRJt99vfu2Eyio7NRZSBSKY9m39PncN";
  const sourceAddress = address;
  transaction.from(inputs);

  // set the recieving address and the amount to send
  transaction.to(recieverAddress, satoshiToSend);

  // Set change address - Address to receive the left over funds after transfer
  transaction.change(sourceAddress);

  //manually set transaction fees: 20 satoshis per byte
  transaction.fee(fee);

  // Sign transaction with your private key
  transaction.sign(privateKey);

  // serialize Transactions
  const serializedTransaction = transaction.serialize();

  console.log(serializedTransaction, "serialized");
}
// generateNewAddress()
main(1000);
