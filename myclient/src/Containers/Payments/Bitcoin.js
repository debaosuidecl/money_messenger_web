import Layout from "../../Component/Layout/Layout";

import classes from "./Payments.module.css";
import BitcoinImg from "../images/bitcoin.png";

const Bitcoin = () => {
  return (
    <Layout>
      <div className={classes.Payments}>
        <img height={40} src={BitcoinImg} />
        <h2>Top up with Bitcoin</h2>

        <p>
          Final amount that will be added to your balance can slightly differ
          upward or downward from amount you entered due to BTC exchange rate
          changes. We use the exchange rate of binance.com at the moment of
          payment commitment
        </p>

        <p>
          This wallet address is binded to your account. To refill your balance
          you can simply send the payment directly to this wallet and funds will
          be automatically added to your balance.
        </p>
        <p>
          Funds are added to your account when the transaction has at least one
          confirmation.
        </p>
      </div>
    </Layout>
  );
};

export default Bitcoin;
