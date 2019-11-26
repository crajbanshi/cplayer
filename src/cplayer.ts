import { Component, Renderer2 } from '@angular/core';
import './js/cplayer.min.js';

declare var cplayer: any;

export class Cplayer extends cplayer {
    constructor(private renderer: Renderer2) {
        super();
        require("style-loader!./cstyle.scss");
    }
}