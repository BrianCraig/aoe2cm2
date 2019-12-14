import * as React from "react";
import CivGrid from "./CivGrid";
import Messages from "../../containers/Messages";
import DraftState from "./DraftState";
import TurnRow from "./TurnRow";
import Player from "../../constants/Player";
import Preset from "../../models/Preset";
import "../../types/DraftEvent";
import {DraftEvent} from "../../types/DraftEvent";
import {IDraftConfig} from "../../types/IDraftConfig";
import {WithTranslation, withTranslation} from "react-i18next";
import Modal from "../../containers/Modal";
import NameGenerator from "../../util/NameGenerator";
import {Link} from "react-router-dom";
import RoleModal from "../../containers/RoleModal";

interface IProps extends WithTranslation {
    nameHost: string;
    nameGuest: string;
    hostConnected: boolean;
    guestConnected: boolean;
    whoAmI: Player;
    ownName: string | null;
    preset: Preset;
    nextAction: number;

    onActionCompleted?: (message: DraftEvent) => void;
    onDraftConfig?: (message: IDraftConfig) => void;
    onNextAction?: () => void;
    onSetNameHostAction?: (name: string) => void;
    onSetNameGuestAction?: (name: string) => void;
    triggerConnect: () => void;
    triggerJoin: (name: string, role: Player) => void;
    triggerDisconnect?: () => void;
    showRoleModal: () => void;
    showNameModal: () => void;
}

interface IState {
    joined: boolean;
}

class Draft extends React.Component<IProps, IState> {

    state = {joined: false};

    componentDidMount(): void {
        this.props.triggerConnect();
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        console.log('cdU', this.props);
        if (this.props.whoAmI === Player.NONE && (!this.props.hostConnected || !this.props.guestConnected)) {
            this.props.showRoleModal();
        } else if (this.props.whoAmI !== Player.NONE && !this.state.joined) {
            let username: string | null = NameGenerator.getNameFromLocalStorage(this.props.ownName);
            console.log("componentDidMount", this.props.triggerJoin, username);
            if (username !== null) {
                console.log('triggering JOIN');
                this.props.triggerJoin(username, this.props.whoAmI);
                this.setState({joined: true});
            } else {
                this.props.showNameModal();
            }
        }
    }

    public render() {
        const presetName: string = this.props.preset.name;
        const turns = this.props.preset.turns;


        return (
            <div id="container">
                <div style={{position: 'absolute', top: '8px', left: '8px'}}>
                    <span onClick={this.props.triggerDisconnect}><Link to="/"><span
                        className="back-icon header-navigation">back</span></Link></span>
                </div>

                <Modal inDraft={true}/>
                <RoleModal/>

                <div className="draft-content">

                    <div id="draft-title" className="centered text-primary info-card">{presetName}</div>

                    <TurnRow turns={turns}/>

                    <DraftState nameHost={this.props.nameHost} nameGuest={this.props.nameGuest} preset={this.props.preset}/>

                    <div>
                        <div id="action-text" className="centered">
                            <div className="action-string info-card text-primary">
                                <Messages/>
                            </div>
                        </div>
                    </div>

                    <CivGrid civilisations={this.props.preset.civilisations}/>

                </div>
            </div>
        );
    }
}

export default withTranslation()(Draft);