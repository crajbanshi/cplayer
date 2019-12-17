import './js/cplayer.min';

declare var cplayer: any;

export class Cplayer extends cplayer {
    constructor() {
        super();
        require("style-loader!./cstyle.scss");
    }
}