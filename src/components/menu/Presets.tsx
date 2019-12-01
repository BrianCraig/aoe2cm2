import * as React from "react";
import {Trans, withTranslation, WithTranslation} from "react-i18next";
import {Redirect} from "react-router";
import Preset from "../../models/Preset";
import PresetListElement from "./PresetListElement";
import CustomiseButton from "./CustomiseButton";

interface IState {
    draftId: string | null;
}

class Presets extends React.Component<WithTranslation, IState> {

    constructor(props: WithTranslation) {
        super(props);
        this.state = {draftId: null};
    }

    public render() {
        if (this.state.draftId !== null) {
            const target = '/draft/' + this.state.draftId;
            return (<Redirect to={target}/>);
        }

        return (
            <div>
                <div id="join_game" className="home_card box">
                    <h2><Trans i18nKey='presets.joinTitle'>Join existing draft</Trans></h2>
                    <div>
                        <div className="centered text-primary info-card">
                            <Trans i18nKey='presets.code'>code:</Trans>
                        </div>
                        <div className="code">
                            <input id="input-code" type="text" name="code" className="inset-input"/>
                        </div>
                        <div className="pure-g join-actions text-primary">
                            <div className="pure-u-1-1">
                                <div className="join-action">
                                    <button className="shadowbutton text-primary" id="join-game-button"
                                            onClick={this.joinDraft}>
                                        <Trans i18nKey='presets.join'>Join</Trans>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <div className="card home_card">
                            <h2><Trans i18nKey='presets.useTitle'>Use preset</Trans></h2>
                            <ul>
                                <PresetListElement preset={Preset.SAMPLE}/>
                                <PresetListElement preset={Preset.SIMPLE}/>
                                <PresetListElement preset={Preset.HIDDEN_1V1}/>
                                <PresetListElement preset={Preset.HIDDEN_2V2}/>
                                <PresetListElement preset={Preset.HIDDEN_3V3}/>
                                <PresetListElement preset={Preset.HIDDEN_4V4}/>
                                <PresetListElement preset={Preset.SIMPLE_PARALLEL}/>
                                <PresetListElement preset={Preset.REVEAL_TEST}/>
                                <PresetListElement preset={Preset.ILLEGAL}/>
                                <PresetListElement preset={Preset.M_CIVS}/>
                                <li>Rise of the Rajas 1v1</li>
                                <li>Rise of the Rajas 2v2</li>
                                <li>Rise of the Rajas 3v3</li>
                                <li>Rise of the Rajas 4v4</li>
                                <li>Hidden Rise of Rajas 1v1</li>
                                <li>Hidden Rise of Rajas 2v2</li>
                                <li>Hidden Rise of Rajas 3v3</li>
                                <li>Hidden Rise of Rajas 4v4</li>
                                <li>BoA 1</li>
                                <li>MoA5 Bo3</li>
                                <li>MoA5 Bo5</li>
                                <li>TLC 2</li>
                                <li>Lynx Bo3</li>
                                <li>Lynx Bo5</li>
                                <li>BoA 2</li>
                                <li>Nomad Battlegrounds</li>
                                <li>ArtOfTheTroll Showmatch</li>
                                <li>1ban3pick</li>
                                <li>T90 Discord ECL Edition EUE</li>
                                <li>T90 Discord ECL Edition Africa</li>
                                <li>T90 Discord ECL Edition Middle East</li>
                                <li>T90 Discord ECL Edition East Asia</li>
                                <li>T90 Discord ECL Edition SEA</li>
                                <li>T90 Discord ECL Edition Americas</li>
                                <li>T90 Discord ECL Edition EUW</li>
                                <li>KotD2</li>
                                <li>KotD2 Semi Finals</li>
                                <li>KotD2 Grand Final</li>
                                <li>NAC2 Group</li>
                                <li>NAC2 Playoffs</li>
                                <li>NAC2 Finals</li>
                                <li>Roechel’s 1v1 Rampage</li>
                                <li>KotP 3 Bo5</li>
                                <li>KotP 3 Bo7</li>
                                <li>Hidden Cup Bo7</li>
                                <li>Anvil League</li>
                            </ul>

                            <div className="pure-g join-actions text-primary">
                                <div className="pure-u-1-1">
                                    <CustomiseButton preset={Preset.NEW} i18nKey='createPreset'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private joinDraft = () => {
        const draftIdInput = document.getElementById('input-code') as HTMLInputElement;
        const draftId: string | null = draftIdInput.value;
        this.setState({...this.state, draftId});
    };
}

export default withTranslation()(Presets);