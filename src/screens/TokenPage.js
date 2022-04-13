import React from "react";
import { useSelector } from "react-redux";

import BuyForm from "../components/BuyForm/BuyForm";
import { selectCurrentPhase, selectLatestPrice } from "../redux/contractSlice";
import { fromWei, formatDate } from "../utils/utils";
import { ReactComponent as ReactLogo } from "./TheCyprinus.svg";

const TokenPage = () => {
  const currentPhase = useSelector(selectCurrentPhase);
  const latestPrice = useSelector(selectLatestPrice)?.toString() ?? "0";
  const isCurrentPhaseFetched =
    !!currentPhase &&
    Object.keys(currentPhase)?.length > 0 &&
    Object.values(currentPhase)?.length > 0;

  const price = isCurrentPhaseFetched
    ? fromWei(currentPhase.price.toString())
    : "No se han creado fases";
  const supply = isCurrentPhaseFetched
    ? fromWei(currentPhase.supply.toString())
    : "No se han creado fases";
  const phase = isCurrentPhaseFetched ? currentPhase.phase.toString() : "1";
  const name = isCurrentPhaseFetched ? currentPhase.name : "Cyprinus";
  const symbol = isCurrentPhaseFetched ? currentPhase.symbol : "C1P";
  const minimunEntry = isCurrentPhaseFetched
    ? fromWei(currentPhase.minimunEntry.toString())
    : 100;
  const endAt = isCurrentPhaseFetched
    ? new Date(Number(currentPhase.endAt.toString()) * 1000).toDateString()
    : "No se han creado fases";
  const vesting = isCurrentPhaseFetched
    ? currentPhase.timesToRelease.length
    : "No se han creado fases";

  return (
    <div className="token-page flex">
      <div className="wrap flex">
        <div className="token-left flex flex-col">
          {/* <div className="small-card flex flex-col">
            <div className="loading flex flex-col">
              <div className="lbl cfff s12 b4">(1 BNB= 500,000 XREN)</div>
              <div className="progress flex rel">
                <div className="bar abs"></div>
              </div>
              <div className="tages flex aic">
                <div className="val s12 cfff">45.30%</div>
                <div className="val s12 cfff">653/1000 BNB</div>
              </div>
            </div>
            <div className="desc flex flex-col jc">
              <div className="lbl s12 b4">
                0x1134bFe4a25FFe3b4c98227cC6d7c109057
              </div>
              <div className="lbl s12 b4">Copy XREN Address</div>
            </div>
          </div> */}

          <div className="larg-card flex flex-col">
            <div className="card-img flex aic jc">
              {" "}
              <ReactLogo />
            </div>

            <div className="token-b flex flex-col aic jc">
              <div className="lbl s12 b5">{name}</div>
              <div className="token-num s26 b7">{price} USD</div>
            </div>
            {/* BUY FORM */}
            <BuyForm
              name={name}
              latestPrice={latestPrice}
              symbol={symbol}
              currentPhase={
                isCurrentPhaseFetched ? currentPhase : { price: "0" }
              }
            />
          </div>
        </div>
        <div className="token-right flex jc">
          <div className="r-card flex flex-col">
            <div className="card-heading s17 font b5">Token Information</div>
            <div className="block flex flex-col">
              <div className="row aic flex">
                <div className="tag-l s16 font b4">Name</div>
                <div className="tag-r s16 font b4">{name}</div>
              </div>
              <div className="row aic flex">
                <div className="tag-l s16 font b4">Token Symbol</div>
                <div className="tag-r s16 font b4">{symbol}</div>
              </div>
            </div>
            <div className="block flex flex-col">
              <div className="row aic flex">
                <div className="tag-l s16 font b4">Supply Amount</div>
                <div className="tag-r s16 font b4">
                  {supply} {symbol}
                </div>
              </div>
              <div className="row aic flex">
                <div className="tag-l s16 font b4">Accept Token</div>
                <div className="tag-r s16 font b4">BNB</div>
              </div>
              <div className="row aic flex">
                <div className="tag-l s16 font b4">End Time</div>
                <div className="tag-r s16 font b4">{endAt}</div>
              </div>
              <div className="row aic flex">
                <div className="tag-l s16 font b4">Current Round</div>
                <div className="tag-r s16 font b4">Round {phase}</div>
              </div>
            </div>
            <div className="block flex flex-col">
              <div className="row aic flex">
                <div className="tag-l s16 font b4">Min. Allocation</div>
                <div className="tag-r s16 font b4">{minimunEntry}</div>
              </div>
              <div className="row aic flex"></div>
              <div className="row aic flex">
                {/* <div className="tag-l s16 font b4">Vesting</div>
                <div className="tag-r s16 font b4">
                  {vesting} {!!vesting && vesting < 2 ? "Mes" : "Meses"}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;
