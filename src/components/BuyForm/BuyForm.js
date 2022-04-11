import React from "react";
import { useWeb3React } from "@web3-react/core";

import { useDispatch, useSelector } from "react-redux";
import {
  buyToken,
  resetPurchasing,
  selectLoadingPurchase,
  selectErrorPurchasing,
  selectSuccessPurchasing,
} from "../../redux/contractSlice";
import { fromWei } from "../../utils/utils";

function BuyForm({ name, latestPrice, currentPhase, symbol }) {
  const { account } = useWeb3React();
  const dispatch = useDispatch();

  const bnbPrice = fromWei(latestPrice);
  const currentPhasePrice = fromWei(currentPhase.price.toString());
  const tokenPrice = currentPhasePrice / bnbPrice;

  const loadingPurchase = useSelector(selectLoadingPurchase);
  const errorPurchasing = useSelector(selectErrorPurchasing);
  const successPurchasing = useSelector(selectSuccessPurchasing);

  const [quantity, setQuantity] = React.useState("");
  const [bnb, setBNB] = React.useState("");
  const [txError, setTxError] = React.useState("");

  const onChangeBNB = (e) => {
    console.log(tokenPrice, "token");
    setQuantity(e.target.value / tokenPrice);
    setBNB(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!account || quantity === "" || bnb === "") return;
    try {
      /* {quantity} # of tokens */
      const res = await dispatch(
        buyToken({ account, quantity: quantity.toString() })
      );
      if (res) {
        console.log(res);
        if (res?.error?.message) {
          setTxError(res.error.message);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const reset = () => {
    dispatch(resetPurchasing());
    setQuantity("");
    setBNB("");
    setTxError("");
  };

  return (
    <div className="meta-b flex aic jc flex-col">
      {/* LOADING */}
      {loadingPurchase && !errorPurchasing && !successPurchasing && (
        <>
          <p>BNB</p>
          <input
            type="text"
            className="cleanbtn txt-box s13"
            placeholder="Enter amount of BNB"
            disabled={true}
            value={bnb}
            onChange={onChangeBNB}
          />
          <p>{symbol}</p>
          <input
            type="text"
            className="cleanbtn txt-box s13"
            placeholder="Amount of tokens"
            disabled={true}
            value={quantity}
          />
          <button
            onClick={reset}
            className="cleanbtn btn cfff button s15 b3 loading"
          >
            Loading...
          </button>
          <div className="lbl s12 b4">Processing transaction...</div>
        </>
      )}
      {/* ERROR */}
      {!loadingPurchase && errorPurchasing && !successPurchasing && (
        <>
          <p>BNB</p>
          <input
            type="text"
            className="cleanbtn txt-box s13"
            placeholder="Enter amount of BNB"
            disabled={true}
            value={bnb}
            onChange={onChangeBNB}
          />
          <p>{symbol}</p>
          <input
            type="text"
            className="cleanbtn txt-box s13"
            placeholder="Amount of tokens"
            disabled={true}
            value={quantity}
          />
          <button
            onClick={reset}
            className="cleanbtn btn cfff button s15 b3 error"
          >
            Try again
          </button>
          <div className="lbl s12 b4">
            {!!txError ? txError : "Transaction failed!"}
          </div>
        </>
      )}
      {/* SUCCESS */}
      {!loadingPurchase && !errorPurchasing && successPurchasing && (
        <>
          <p>BNB</p>
          <input
            type="text"
            className="cleanbtn txt-box s13"
            placeholder="Enter amount of BNB"
            disabled={true}
            value={bnb}
            onChange={onChangeBNB}
          />
          <p>{symbol}</p>
          <input
            type="text"
            className="cleanbtn txt-box s13"
            placeholder="Amount of tokens"
            disabled={true}
            value={quantity}
          />
          <button
            onClick={reset}
            className="cleanbtn btn cfff button s15 b3 success"
          >
            Buy again
          </button>
          <div className="lbl s12 b4">Transaction success!</div>
        </>
      )}
      {/* FORM */}
      {!loadingPurchase && !errorPurchasing && !successPurchasing && (
        <>
          <p>BNB</p>
          <input
            type="text"
            className="cleanbtn txt-box s13"
            placeholder="Enter amount of BNB"
            disabled={!account}
            value={bnb}
            onChange={onChangeBNB}
          />
          <p>{symbol}</p>
          <input
            type="text"
            className="cleanbtn txt-box s13"
            placeholder="Amount of tokens"
            disabled={true}
            value={quantity}
          />
          <button
            onClick={onSubmit}
            disabled={!account}
            className="cleanbtn btn cfff button s15 b3 primary"
          >
            Buy {name}
          </button>
          <div className="lbl s12 b4">&nbsp;</div>
        </>
      )}
    </div>
  );
}

export default BuyForm;
