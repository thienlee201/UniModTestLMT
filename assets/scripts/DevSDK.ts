import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

globalThis.gameStart = () => { // do something 
}
globalThis.gameClose = () => { // do something 
}
export enum TYPE_NET {
    Unity = 'Unity',
    MTG = 'MTG',
    IS = 'IS',
    AppLovin = 'AppLovin',
    Vungle = 'Vungle',
    Google = 'Google',
    Facebook = 'Facebook',
    Tiktok = 'Tiktok'
}
@ccclass('DevSDK')
export class DevSDK {

    static gameReady() {
        if (window.type_net == TYPE_NET.MTG)
            window.gameReady && window.gameReady();
    }
    static gameRetry() {
        if (window.type_net == TYPE_NET.MTG)
            window.gameRetry && window.gameRetry();
    }
    static gameEnd() {
        if (window.type_net == TYPE_NET.MTG)
            window.gameEnd && window.gameEnd();
    }


    static openStore() {
        if (window.type_net == TYPE_NET.MTG)
            window.install && window.install();
        else if (window.type_net == TYPE_NET.Unity || window.type_net == TYPE_NET.AppLovin) {
            // globalThis.mraidOpen();
            window.mraidOpen && window.mraidOpen();
        } else {
            window.openStore && window.openStore();
        }
    }
}

