import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { selectCurrentPhase } from "../redux/contractSlice";
import { fromWei } from "../utils/utils";

const PAGE_KEY = "whitelist";

const PreseedPage = ({ match: { params } }) => {
  const currentPhase = useSelector(selectCurrentPhase);
  const isCurrentPhaseFetched =
    !!currentPhase &&
    Object.keys(currentPhase)?.length > 0 &&
    Object.values(currentPhase)?.length > 0;
  const price = isCurrentPhaseFetched
    ? fromWei(currentPhase.price.toString())
    : "0.01";
  const supply = isCurrentPhaseFetched
    ? fromWei(currentPhase.supply.toString())
    : "50.000.000";
  const name = isCurrentPhaseFetched ? currentPhase.name : "C1P";
  const minimunEntry = isCurrentPhaseFetched
    ? fromWei(currentPhase.minimunEntry.toString())
    : 100;
  return PAGE_KEY !== params.id ? (
    <Redirect to={"/"} />
  ) : (
    <div className="preseed-page flex">
      <div className="wrap flex">
        <div className="left-side flex flex-col">
          <div className="preseed-heading s30 b3 font">Ronda Preseed</div>
          <div className="card flex flex-col">
            <div className="card-img flex aic jc">
              <img src="/images/logo_black.svg" className="img" />
            </div>
            <div className="token-b flex flex-col aic jc">
              <div className="lbl s12 b5">TOKEN</div>
              <div className="token-num s26 b7">{price} USD</div>
            </div>
            <div className="meta-b flex aic jc">
              <div className="m-left flex flex-col">
                <div className="lbl s13 b4">Ronda Semilla</div>
                <div className="lbl s13 b4">Bloqueo: 4 meses</div>
                <div className="lbl s13 b4">Vesting: 6 meses</div>
              </div>
              <div className="m-right flex flex-col jce">
                <div className="lbl s13 b6">
                  ° Token: {supply} {name}
                </div>
                <div className="lbl s13 b4">
                  Compra minima {minimunEntry} {name}
                </div>
                {/* <div className="lbl s13 b4">Compra maxima 100$</div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="right-side flex flex-col">
          <div className="day-block flex">
            <div className="day-time flex aic jc">
              <div className="d-left cfff s14">DAYS</div>
              <div className="d-right s14 b5">12:00:00</div>
            </div>
          </div>
          <div className="lbl s18 b6 flex">Whitelist</div>
          <div className="txt-block flex flex-col">
            <input
              type="text"
              className="cleanbtn txt-box s13"
              placeholder="Nombre"
            />
            <input
              type="text"
              className="cleanbtn txt-box s13"
              placeholder="Teléfono"
            />
            <input
              type="text"
              className="cleanbtn txt-box s13"
              placeholder="Email"
            />
            <input
              type="text"
              className="cleanbtn txt-box s13"
              placeholder="BSC Wallet"
            />
            <input
              type="text"
              className="cleanbtn txt-box s13"
              placeholder="País"
            />
          </div>
          <div className="action flex">
            <Link to="/token" className="button cleanbtn btn s14 b5">
              Enviar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreseedPage;
