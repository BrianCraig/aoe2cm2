import express from "express";
import {Server} from "http"
import socketio from "socket.io";
import Player from "./models/Player";
import {IDraftConfig} from "./models/IDraftConfig";
import {IJoinMessage} from "./models/IJoinMessage";
import {DraftsStore} from "./models/DraftsStore";
import {Validator} from "./models/Validator";
import {ValidationId} from "./models/ValidationId";
import {DraftEvent} from "./models/DraftEvent";
import {Util} from "./models/Util";
import {AddressInfo} from "net";
import Preset from "./models/Preset";
import {Listeners} from "./models/Listeners";

export const DraftServer = {
    serve(port: string | number | undefined):{ httpServerAddr: AddressInfo | string | null; io: SocketIO.Server; httpServer: Server } {
        const app = express();
        app.set("port", port);
        app.use(express.json());

        const server = new Server(app);
        const io = socketio(server, {cookie: false});
        const draftsStore = new DraftsStore();
        const validator = new Validator(draftsStore);

        function setPlayerName(draftId: string, player: Player, name: string) {
            if (!draftsStore.has(draftId)) {
                draftsStore.initDraft(draftId, Preset.SAMPLE);
            }
            draftsStore.setPlayerName(draftId, player, name);
        }

        app.post('/preset/new', (req, res) => {
            console.log('/preset/new', req.body);
            let draftId = Util.newDraftId();
            while(draftsStore.has(draftId)){
                draftId += Util.randomChar();
            }
            const pojo: Preset = req.body.preset as Preset;
            let preset = Preset.fromPojo(pojo);
            if (preset !== undefined) {
                draftsStore.initDraft(draftId, preset);
            }
            res.json({draftId});
        });
        app.use('/draft/[a-zA-Z]+', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        app.use(express.static('build'));
        app.use('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        io.on("connection", (socket: socketio.Socket) => {
            const draftId: string = socket.handshake.query.draftId;

            const roomHost: string = `${draftId}-host`;
            const roomGuest: string = `${draftId}-guest`;
            const roomSpec: string = `${draftId}-spec`;

            console.log("a user connected to the draft", draftId);

            if (!draftsStore.has(draftId)) {
                socket.emit('message', 'This draft does not exist.');
                socket.disconnect(true);
                return;
            }

            const {nameHost, nameGuest} = draftsStore.getPlayerNames(draftId);

            const rooms = Object.keys(socket.adapter.rooms);
            console.log('rooms', rooms);
            if (!rooms.includes(roomHost)) {
                socket.join(roomHost);
                const message = {nameHost, nameGuest, youAre: Player.HOST};
                console.log('sending', message);
            } else if (!rooms.includes(roomGuest)) {
                socket.join(roomGuest);
                const message = {nameHost, nameGuest, youAre: Player.GUEST};
                console.log('sending', message);
            } else {
                socket.join(roomSpec);
                const message = {nameHost, nameGuest, youAre: Player.NONE};
                console.log('sending', message);
            }

            socket.on("join", (message: IJoinMessage, fn: (dc: IDraftConfig) => void) => {
                console.log("player joined:", message);
                let playerType: Player = Player.NONE;
                if (Object.keys(socket.rooms).includes(roomHost)) {
                    setPlayerName(draftId, Player.HOST, message.name);
                    draftsStore.setPlayerReady(draftId, Player.HOST);
                    playerType = Player.HOST;
                } else if (Object.keys(socket.rooms).includes(roomGuest)) {
                    setPlayerName(draftId, Player.GUEST, message.name);
                    draftsStore.setPlayerReady(draftId, Player.GUEST);
                    playerType = Player.GUEST
                }
                socket.nsp
                    .in(roomHost)
                    .in(roomGuest)
                    .in(roomSpec)
                    .emit("player_joined", {name: message.name, playerType});
                fn({
                    ...draftsStore.getDraftViewsOrThrow(draftId).getDraftForPlayer(playerType),
                    yourPlayerType: playerType
                });
            });

            socket.on("act", Listeners.actListener(draftsStore, draftId, validateAndApply, socket, roomHost, roomGuest, roomSpec));

            socket.on('disconnect', function () {
                console.log('Got disconnect! draftId: ' + draftId);
            });
        });

        const httpServer = server.listen(port, () => {
            console.log("listening on *:" + port);
        });
        const httpServerAddr = httpServer.listen().address();


        function validateAndApply(draftId: string, message: DraftEvent): ValidationId[] {
            return validator.validateAndApply(draftId, message);
        }

        return {httpServer, httpServerAddr, io};
    }
};