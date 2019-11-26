import 'cplayer/js/cplayer.min';

declare var cplayer: any;

export declare class Cplayer extends cplayer {
    constructor() {
        super();
        require("style-loader!./cstyle.scss");
    }
}