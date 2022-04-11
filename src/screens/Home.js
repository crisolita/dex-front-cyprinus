import React from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";

import { selectCurrentPhase, selectPurchases } from "../redux/contractSlice";
import { fromWei, ellipseAddress } from "../utils/utils";

const Home = () => {
  const { active, account } = useWeb3React();
  const currentPhase = useSelector(selectCurrentPhase);
  const purchases = useSelector(selectPurchases);
  const isCurrentPhaseFetched =
    !!currentPhase &&
    Object.keys(currentPhase)?.length > 0 &&
    Object.values(currentPhase)?.length > 0;

  const supply = isCurrentPhaseFetched
    ? fromWei(currentPhase.supply.toString())
    : "150.000.000";
  const phase = isCurrentPhaseFetched ? currentPhase.phase.toString() : "1";
  const price = isCurrentPhaseFetched
    ? fromWei(currentPhase.price.toString())
    : "0,009";
  const vesting = isCurrentPhaseFetched
    ? currentPhase.timesToRelease.length
    : 9;
  const minimunEntry = isCurrentPhaseFetched
    ? fromWei(currentPhase.minimunEntry.toString())
    : 100;

  /**name: currentPhase.name,
          symbol: currentPhase.symbol,
          supply: fromWei(currentPhase.supply.toString()),
          endAt: fromUnixTimestamp(currentPhase.endAt.toString()).toGMTString(),
          minimunEntry: fromWei(currentPhase.minimunEntry.toString()),
          phase: currentPhase.phase.toString(), */

  return (
    <div className="home-p flex">
      <div className="wrap flex jc flex-col">
        <div className="home-heading s30 b3 font">Calendario de fases</div>
        <div className="cards-block">
          {/* PRESEED */}
          <div className="card flex flex-col">
            <div className="card-heading flex font">
              <div className="left flex font b4">Ronda Preseed</div>
              <div className="right flex font b4">Fase {phase}</div>
            </div>
            <div className="meta flex">
              <div className="meta-left flex flex-col">
                <div className="tag s13 font">Supply de tokens</div>
                <div
                  className="numb s18 font b3"
                  style={{ marginBottom: "6px" }}
                >
                  {supply}
                </div>
                <div className="tag s13 font ">Precio en USD</div>
                <div
                  className="numb s18 font b3"
                  style={{ marginBottom: "6px" }}
                >
                  {price}
                </div>
                <div className="tag s13 font ">Min. allocation</div>
                <div
                  className="numb s18 font b3"
                  style={{ marginBottom: "6px" }}
                >
                  {minimunEntry}
                </div>
                {/* <div className="price s12 font">Precio en US: 0,009</div>
                <div className="numb-2 flex s13 b5 jce">
                  <div>1.350.000</div>
                </div> */}
              </div>
              <div className="meta-right flex flex-col">
                {/* <div className="tag s13 b5 flex ">venta</div>
                <div className="numb s13 font b4 flex ">ro</div> */}
                <div className="lbl s13 flex">Bloqueo</div>
                <div
                  className="lbl-2 s13 b4 flex"
                  style={{ marginBottom: "6px" }}
                >
                  2023
                </div>
                <div className="lbl-3 s13 b5 flex">Vesting</div>
                <div className="lbl-3 s13 flex" style={{ marginBottom: "6px" }}>
                  {vesting} {!!vesting && vesting < 2 ? "Mes" : "Meses"}
                </div>
              </div>
            </div>
            {/* <div className="progress-bar flex">
              <div className="bar flex aic rel ">
                <div className="dot flex abs"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
              </div>
            </div> */}
            <div className="action flex" style={{ marginTop: "auto" }}>
              <Link to={"/token"} className="btn cleanbtn button btn-primary">
                Comprar Token C1P
              </Link>
            </div>
          </div>
          {/* ACCOUNT INFO */}
          <div className="card flex flex-col">
            <div className="card-heading flex font">
              <div className="left flex font b4">Welcome</div>
              <div className="right flex font b4">
                {active && account
                  ? ellipseAddress(account, 10)
                  : "Not connected"}
              </div>
            </div>
            <div className="meta flex">
              <div className="meta-left flex flex-col">
                <div className="tag s13 font">Total comprados</div>
                <div
                  className="numb s18 font b3"
                  style={{ marginBottom: "6px" }}
                >
                  {purchases.totalAmount}
                </div>
                {/* <div className="tag s13 font ">Precio en USD</div>
                <div className="numb s18 font b3" style={{ marginBottom: '6px' }}>{price}</div> */}
                {/* <div className="price s12 font">Precio en US: 0,009</div>
                <div className="numb-2 flex s13 b5 jce">
                  <div>1.350.000</div>
                </div> */}
              </div>
              <div className="meta-right flex flex-col">
                {/* <div className="tag s13 b5 flex ">venta</div>
                <div className="numb s13 font b4 flex ">ro</div> */}
                <div className="lbl s13 flex">Total reclamado</div>
                <div
                  className="lbl-2 s13 b4 flex"
                  style={{ marginBottom: "6px" }}
                >
                  {purchases.totalAmount - purchases.totalRemain}
                </div>
                <div className="lbl-3 s13 b5 flex">Pendiente</div>
                <div className="lbl-3 s13 flex" style={{ marginBottom: "6px" }}>
                  {purchases.totalRemain}
                </div>
              </div>
            </div>
            {/* <div className="progress-bar flex">
              <div className="bar flex aic rel ">
                <div className="dot flex abs"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
              </div>
            </div>
            <div className="action flex" style={{ marginTop: 'auto' }}>
              <Link to={"/preseed-page"} className="btn cleanbtn button">
                Comprar Token XREN
              </Link>
            </div> */}
          </div>
          {/* SEMILLA OLD */}
          {/* <div className="card flex flex-col">
            <div className="card-heading flex font">
              <div className="left flex font b4">Ronda Semilla</div>
              <div className="right flex font b4">Fase 2</div>
            </div>
            <div className="meta flex">
              <div className="meta-left flex flex-col">
                <div className="tag s13 font "># de tokens</div>
                <div className="numb s18 font b3">150.000.000</div>
                <div className="price s12 font">Precio en US:</div>
                <div className="numb-2 flex s13 b5 jcs">
                  <div>Funding:</div>
                </div>
              </div>
              <div className="meta-right flex flex-col">
                <div className="tag s13 b5 flex ">venta</div>
                <div className="numb s13 font b4 flex ">-</div>
                <div className="lbl s13 flex">Bloqueo</div>
                <div className="lbl-2 s13 b4 flex">6 Meses</div>
                <div className="lbl-3 s13 b5 flex">Vesting</div>
                <div className="lbl-3 s13 flex">9 Meses</div>
              </div>
            </div>
            <div className="progress-bar flex">
              <div className="bar flex aic rel ">
                <div className="dot flex abs"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
              </div>
            </div>
            <div className="action flex">
              <button className="btn cleanbtn button"></button>
            </div>
          </div> */}
          {/* FASE · */}
          <div style={{ visibility: "hidden" }} className="card flex flex-col">
            <div className="card-heading flex font">
              <div className="left flex font b4">vada</div>
              <div className="right flex font b4">Fase 3</div>
            </div>
            <div className="meta flex">
              <div className="meta-left flex flex-col">
                <div className="tag s13 font "># de tokens</div>
                <div className="numb s18 font b3">-</div>
                <div className="price s12 font">Precio en US:</div>
                <div className="numb-2 flex s13 b5 jcs">
                  <div>Funding:</div>
                </div>
              </div>
              <div className="meta-right flex flex-col">
                <div className="tag s13 b5 flex ">venta</div>
                <div className="numb s13 font b4 flex jce">-</div>
                <div className="lbl s13 flex">Bloqueo</div>
                <div className="lbl-2 s13 b4 flex jce">-</div>
                <div className="lbl-3 s13 b5 flex">Vesting</div>
                <div className="lbl-3 s13 flex jce">-</div>
              </div>
            </div>
            <div className="progress-bar flex">
              <div className="bar flex aic rel ">
                <div className="dot flex abs"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
              </div>
            </div>
            <div className="action flex">
              <button className="btn cleanbtn button"></button>
            </div>
          </div>
          {/* PUBLICA */}
          <div style={{ visibility: "hidden" }} className="card flex flex-col">
            <div className="card-heading flex font">
              <div className="left flex font b4">Ronda Publica</div>
              <div className="right flex font b4">Fase 4</div>
            </div>
            <div className="meta flex">
              <div className="meta-left flex flex-col">
                <div className="tag s13 font "># de tokens</div>
                <div className="numb s18 font b3">-</div>
                <div className="price s12 font">Precio en US:</div>
                <div className="numb-2 flex s13 b5 jcs">
                  <div>Funding:</div>
                </div>
              </div>
              <div className="meta-right flex flex-col">
                <div className="tag s13 b5 flex ">venta</div>
                <div className="numb s13 font b4 flex jce">-</div>
                <div className="lbl s13 flex">Bloqueo</div>
                <div className="lbl-2 s13 b4 flex jce">-</div>
                <div className="lbl-3 s13 b5 flex">Vesting</div>
                <div className="lbl-3 s13 flex jce">-</div>
              </div>
            </div>
            <div className="progress-bar flex">
              <div className="bar flex aic rel ">
                <div className="dot flex abs"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
                <div className="dot flex"></div>
              </div>
            </div>
            <div className="action flex">
              <button className="btn cleanbtn button"></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
