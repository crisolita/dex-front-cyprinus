import React from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { ReactComponent as ReactLogo } from "./TheCyprinus.svg";

import { injected, ellipseAddress } from "../utils/utils";

const Header = ({ canShowAdminPanel }) => {
  const { active, account, activate, deactivate } = useWeb3React();

  const connect = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.log(error);
    }
  };

  const disconnect = () => {
    try {
      deactivate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="header flex">
      <div className="wrap flex aic">
        <div className="left flex aic">
          <Link to="/">
            <div className="App">
              <ReactLogo />
            </div>
          </Link>
        </div>
        <div className="right flex aic">
          <div className="items flex aic">
            <div className="li c111 font">Inicio</div>
            <div className="li c111 font">Funcionalidades</div>
            <div className="li c111 font">Marketplace</div>
            <div className="li c111 font">Cripto</div>
            <div className="li c111 font">Ayuda</div>
            {canShowAdminPanel && (
              <Link className="li c111 fon" to="/admin">
                Admin
              </Link>
            )}
          </div>
          <div className="action flex">
            {active && (
              <button className="btn button cleanbtn" onClick={disconnect}>
                Disconnect {ellipseAddress(account)}
              </button>
            )}
            {!active && (
              <button className="btn button cleanbtn" onClick={connect}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
