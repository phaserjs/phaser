/// <reference path="../Game.ts" />

/*
 * Based on code from Viewporter v2.0
 * http://github.com/zynga/viewporter
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/viewporter/master/MIT-LICENSE.txt
 */

class FullScreen {

    constructor(game: Game) {

        this._game = game;

        this.orientation = window['orientation'];

        window.addEventListener('orientationchange', (event) => this.checkOrientation(event), false);

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    }

    private _game: Game;
    private _startHeight: number;
    private _iterations: number;
    private _check;

    public width: number;
    public height: number;

    public orientation;

    public go() {

        this.refresh();

    }

    public update() {

        if (window.innerWidth !== this.width || window.innerHeight !== this.height)
        {
            this.refresh();
        }

    }

    public get isLandscape(): bool {
        return window['orientation'] === 90 || window['orientation'] === -90;
    }

    private checkOrientation(event) {

        if (window['orientation'] !== this.orientation)
        {
            this.refresh();
            this.orientation = window['orientation'];
        }

    }

    private refresh() {

        //  We can't do anything about the status bars in iPads, web apps or desktops
        if (this._game.device.iPad == false && this._game.device.webApp == false && this._game.device.desktop == false)
        {
	        document.documentElement.style.minHeight = '5000px';

	        this._startHeight = window.innerHeight;

	        if (this._game.device.android && this._game.device.chrome == false)
	        {
    	        window.scrollTo(0, 1);
	        }
	        else
	        {
    	        window.scrollTo(0, 0);
	        }
        }

		if (this._check == null)
		{
    		this._iterations = 40;
    		this._check = window.setInterval(() => this.retryFullScreen(), 10);
		}

    }

    private retryFullScreen() {

	    if (this._game.device.android && this._game.device.chrome == false)
	    {
    	    window.scrollTo(0, 1);
	    }
	    else
	    {
    	    window.scrollTo(0, 0);
	    }

	    this._iterations--;

	    if (window.innerHeight > this._startHeight || this._iterations < 0)
	    {
            // set minimum height of content to new window height
            document.documentElement.style.minHeight = window.innerHeight + 'px';

            this._game.stage.canvas.style.width = window.innerWidth + 'px';
            this._game.stage.canvas.style.height = window.innerHeight + 'px';

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            clearInterval(this._check);

            this._check = null;

	    }

    }

}