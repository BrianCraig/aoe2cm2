import * as React from "react";
import {Link, Route, Switch} from "react-router-dom";
import Practice from "./Practice";
import Presets from "./Presets";
import Preset from "./Preset";
import Index from "./Index";
import Spectate from "./Spectate";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import Modal from "../containers/Modal";
import PresetEditor from "./PresetEditor/PresetEditor";

class Menu extends React.Component<WithTranslation, object> {
    public render() {
        return (
            <div className="content">
                <Modal/>
                <div className="title">
                    <span id="aoe-title">Age of Empires II</span>
                    <span id="cm-logo"/>
                    <span id="cm-title">Captains mode</span>
                </div>
                <div className="pure-menu pure-menu-horizontal main-menu">
                    <ul className="pure-menu-list">
                        <li className="pure-menu-item">
                            <Link to='/' className="pure-menu-link"><Trans>menu.welcome</Trans></Link>
                        </li>
                        <li className="pure-menu-item">
                            <Link to='/presets' className="pure-menu-link"><Trans>menu.hostOrJoin</Trans></Link>
                        </li>
                        <li className="pure-menu-item">
                            <Link to='/spectate' className="pure-menu-link"><Trans>menu.spectate</Trans></Link>
                        </li>
                        <li className="pure-menu-item">
                            <Link to='/practice' className="pure-menu-link"><Trans>menu.practice</Trans></Link>
                        </li>
                    </ul>
                </div>
                <Switch>
                    <Route exact path="/" component={Index}/>
                    <Route path="/presets" component={Presets}/>
                    <Route path="/preset/create" component={PresetEditor}/>
                    <Route path="/preset/:id" component={Preset}/>
                    <Route path="/spectate" component={Spectate}/>
                    <Route path="/practice" component={Practice}/>
                </Switch>
            </div>
        );
    }
}

export default withTranslation()(Menu);