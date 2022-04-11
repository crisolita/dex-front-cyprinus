import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Contract, ethers } from "ethers";

// Component
import Header from "./components/Header";
import Home from "./screens/Home";
import PreseedPage from "./screens/PreseedPage";
import TokenPane from "./screens/TokenPage";
import { Admin } from "./modules/admin";

import {
  setContract,
  setCurrentPhase,
  setLatestPrice,
  setTokenPrice,
  selectContract,
  setPurchases,
  selectPurchases,
} from "./redux/contractSlice";
import { fromWei } from "./utils/utils";
import { CONFIG } from "./utils/config";

import "./css/App.scss";

function App() {
  const { library, active, account } = useWeb3React();
  const dispatch = useDispatch();
  const saleContract = useSelector(selectContract);
  const purchases = useSelector(selectPurchases);

  const [adminAccount, setAdminAccount] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [isClaimingSale, setIsClaimingSale] = React.useState(false);

  React.useEffect(() => {
    if (active && library) {
      initWeb3(library.getSigner());
    } else {
      let provider = new ethers.providers.JsonRpcProvider(
        "https://data-seed-prebsc-1-s1.binance.org:8545/"
      );
      if (window.ethereum) {
        provider = provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
      }
      const signer = provider.getSigner();
      initWeb3(signer);
    }
  }, [active, library]);

  React.useEffect(() => {
    if (active && account === adminAccount) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [active, account, adminAccount]);

  React.useEffect(() => {
    if (account) {
      getUserTokens(account);
    } else {
      dispatch(
        setPurchases({
          totalAmount: 0,
          totalRemain: 0,
          history: [],
        })
      );
    }
  }, [account]);

  const initWeb3 = async (signer) => {
    const saleContract = new Contract(
      CONFIG.SALE_ADDRESS,
      CONFIG.SALE_ABI,
      signer
    );
    const tokenContract = new Contract(
      CONFIG.TOKEN_ADDRESS,
      CONFIG.TOKEN_ABI,
      signer
    );
    dispatch(setContract(saleContract));
    getContractData(saleContract, tokenContract);
  };

  const getContractData = async (saleContract, tokenContract) => {
    console.log("------saleContract------");
    console.log(saleContract);
    console.log("---------------------------------");
    console.log("------tokenContract------");
    console.log(tokenContract);
    console.log("---------------------------------");
    try {
      const currentPhase = await saleContract.getcurrentPhase();
      const phase = await saleContract.currentPhase();
      const latestPrice = await saleContract.getLatestPrice();
      const admin = await saleContract.dispatcher();
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();

      console.log("------getcurrentPhase------");
      console.log({ ...currentPhase, phase, name, symbol });
      console.log("---------------------------------");

      setAdminAccount(admin);
      dispatch(setCurrentPhase({ ...currentPhase, phase, name, symbol }));
      dispatch(setLatestPrice(latestPrice));
      dispatch(setTokenPrice(currentPhase.price / latestPrice));
    } catch (e) {
      console.log(e);
    }
  };

  const getUserTokens = async (account) => {
    try {
      setHistoryLoading(true);
      const salesIds = await saleContract.getIDs(account);
      if (!!salesIds && Array.isArray(salesIds) && salesIds?.length > 0) {
        const salesIdsArray = salesIds.map((sale) => sale?.toString());
        getTokenLocksForSale(salesIdsArray);
      }
    } catch (e) {
      console.log(e);
      setHistoryLoading(false);
    }
  };

  const getTokenLocksForSale = (salesIdsArray) => {
    Promise.all(
      salesIdsArray.map((saleId) => saleContract.tokenLocksForSale(saleId))
    )
      .then((res) => {
        // console.log('------getTokenLocksForSale------')
        // console.log(res)
        // console.log('---------------------------------')
        if (res && Array.isArray(res)) {
          let totalTokensPurchased = 0;
          let totalRemain = 0;
          let salesByAccount = [];
          res.forEach((r) => {
            const remainTokensToEtherUnit = fromWei(
              r?.remainAmount?.toString()
            );
            const initTokensToEtherUnit = fromWei(r?.initAmount?.toString());

            const sale = {
              initAmount: initTokensToEtherUnit,
              remainAmount: remainTokensToEtherUnit,
            };

            salesByAccount.push(sale);
            totalTokensPurchased += Number(initTokensToEtherUnit);
            totalRemain += Number(remainTokensToEtherUnit);
          });
          // console.log('------salesByAccount------')
          // console.log(salesByAccount)
          // console.log('---------------------------------')
          // console.log('------totalTokensPurchased------')
          // console.log(totalTokensPurchased)
          // console.log('---------------------------------')

          salesByAccount = salesByAccount.map((sale, i) => ({
            ...sale,
            id: salesIdsArray[i],
          }));

          const purchaseHistory = {
            totalAmount: totalTokensPurchased,
            totalRemain: totalRemain,
            history: salesByAccount,
          };

          dispatch(setPurchases(purchaseHistory));

          getPercentsToReleaseForID(salesIdsArray, purchaseHistory);
        }
      })
      .catch((error) => {
        console.log(error);
        setHistoryLoading(false);
      });
  };

  const getPercentsToReleaseForID = (salesIdsArray, purchaseHistory) => {
    Promise.all(
      salesIdsArray.map((saleId) =>
        saleContract.getPercentsToReleaseForID(saleId)
      )
    )
      .then((res) => {
        if (res && Array.isArray(res)) {
          const data = res.map((d) => d.toString());
          // console.log(data)

          const history = {
            ...purchaseHistory,
            history:
              purchaseHistory.history.map((shop, i) => ({
                ...shop,
                percents: data[i],
              })) || [],
          };

          // console.log('-------history of getPercentsToReleaseForID----------')
          // console.log(history)
          // console.log('------------------------')

          getTimesToReleaseForID(salesIdsArray, history);
        }
      })
      .catch((error) => {
        console.log(error);
        setHistoryLoading(false);
      });
  };

  const getTimesToReleaseForID = (salesIdsArray, purchaseHistory) => {
    Promise.all(
      salesIdsArray.map((saleId) => saleContract.getTimesToReleaseForID(saleId))
    )
      .then((res) => {
        if (res && Array.isArray(res)) {
          const data = res.map((d) => d.toString()).map((d) => d.split(","));

          const history = {
            ...purchaseHistory,
            history:
              purchaseHistory.history.map((shop, i) => ({
                ...shop,
                times: data[i],
              })) || [],
          };

          // console.log('-------history of getTimesToReleaseForID----------')
          // console.log(history)
          // console.log('------------------------')
          dispatch(setPurchases(history));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setHistoryLoading(false);
      });
  };

  const historyListItem = (sale, index) => {
    const now = new Date();
    const times = Array.isArray(sale.times) ? [...sale.times] : [];
    const isClaimed = Number(sale.remainAmount) === 0;
    const isReleased =
      times.findIndex((time) => now > new Date(time * 1000)) > -1;
    const canClaim = isReleased && !isClaimed;

    const onClick = () => {
      if (canClaim) {
        claimSale(sale.id);
      }
    };

    const buttonStyles = {
      background: canClaim ? "lightblue" : isClaimed ? "green" : "grey",
      color: "white",
      cursor: canClaim ? "pointer" : "default",
      border: "none",
      width: "100%",
    };
    const buttonText = canClaim
      ? "Claim now"
      : isClaimed
      ? "Already claimed"
      : "Wait";

    return (
      <tr key={index.toString()}>
        {/* INITIAL AMOUNT */}
        <td>{sale.initAmount}</td>
        {/* REMAIN AMOUNT */}
        <td>{sale.remainAmount}</td>
        {/* PERCENTS TO RELEASE */}
        <td>{!!sale.percents && sale.percents}</td>
        {/* RELEASE TIMES */}
        <td style={{ textAlign: "left", padding: "10px" }}>
          {!!sale.times &&
            sale.times.length > 0 &&
            sale.times.map((time, i) => (
              <span key={time}>
                {new Date(time * 1000).toLocaleDateString()}{" "}
              </span>
            ))}
        </td>
        {/* CLAIM */}
        <td>
          <button className="button" onClick={onClick} style={buttonStyles}>
            {buttonText}
          </button>
        </td>
      </tr>
    );
  };

  const claimSale = async (id) => {
    try {
      setIsClaimingSale(true);
      const release = await saleContract.release(id);
      const res = await release.wait();
      if (res) {
        console.log(res);
        getUserTokens(account);
        setIsClaimingSale(false);
      }
    } catch (e) {
      console.log(e);
      setIsClaimingSale(false);
    }
  };

  const renderTable = (rows) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Initial amount</th>
            <th>Remain amount</th>
            <th>Percents</th>
            <th>Times to release</th>
            <th>Claim</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  return (
    <div className="App">
      <Router>
        <Header canShowAdminPanel={isAdmin} />
        {!!active && !!account && (
          <div className="wrap" style={{ marginTop: "20px" }}>
            {!!purchases &&
              !!purchases.history &&
              Array.isArray(purchases.history) &&
              purchases.history?.length > 0 && (
                <React.Fragment>
                  {historyLoading && (
                    <button disabled={true}>Loading history...</button>
                  )}
                  {isClaimingSale && (
                    <button disabled={true}>Claiming...</button>
                  )}
                  {!showHistory && !historyLoading && !isClaimingSale && (
                    <button onClick={() => setShowHistory(true)}>
                      Show history
                    </button>
                  )}
                  {showHistory && !historyLoading && !isClaimingSale && (
                    <button onClick={() => setShowHistory(false)}>
                      Hide history
                    </button>
                  )}
                  {showHistory &&
                    !historyLoading &&
                    !isClaimingSale &&
                    renderTable(purchases.history.map(historyListItem))}
                </React.Fragment>
              )}
          </div>
        )}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/preseed-page/:id"
            component={(props) => (
              <PreseedPage adminAccount={adminAccount} {...props} />
            )}
          />
          <Route exact path="/token" component={TokenPane} />
          <Route
            exact
            path="/admin"
            component={() => <Admin isAdmin={isAdmin} />}
          />
          <Redirect to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
