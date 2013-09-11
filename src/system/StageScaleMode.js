Phaser.StageScaleMode = function (game, width, height) {

    /**
    * Stage height when start the game.
    * @type {number}
    */
    this._startHeight = 0;

    /**
    * If the game should be forced to use Landscape mode, this is set to true by Game.Stage
    * @type {bool}
    */
    this.forceLandscape = false;

    /**
    * If the game should be forced to use Portrait mode, this is set to true by Game.Stage
    * @type {bool}
    */
    this.forcePortrait = false;

    /**
    * If the game should be forced to use a specific orientation and the device currently isn't in that orientation this is set to true.
    * @type {bool}
    */
    this.incorrectOrientation = false;

    /**
    * If you wish to align your game in the middle of the page then you can set this value to true.
    * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
    * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
    * @type {bool}
    */
    this.pageAlignHorizontally = false;

    /**
    * If you wish to align your game in the middle of the page then you can set this value to true.
    * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
    * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
    * @type {bool}
    */
    this.pageAlignVeritcally = false;

    /**
    * Minimum width the canvas should be scaled to (in pixels)
    * @type {number}
    */
    this.minWidth = null;

    /**
    * Maximum width the canvas should be scaled to (in pixels).
    * If null it will scale to whatever width the browser can handle.
    * @type {number}
    */
    this.maxWidth = null;

    /**
    * Minimum height the canvas should be scaled to (in pixels)
    * @type {number}
    */
    this.minHeight = null;

    /**
    * Maximum height the canvas should be scaled to (in pixels).
    * If null it will scale to whatever height the browser can handle.
    * @type {number}
    */
    this.maxHeight = null;

    /**
    * Width of the stage after calculation.
    * @type {number}
    */
    this.width = 0;

    /**
    * Height of the stage after calculation.
    * @type {number}
    */
    this.height = 0;

    /**
    * The maximum number of times it will try to resize the canvas to fill the browser (default is 5)
    * @type {number}
    */
    this.maxIterations = 5;
    this.game = game;

    this.enterLandscape = new Phaser.Signal();
    this.enterPortrait = new Phaser.Signal();

    if (window['orientation'])
    {
        this.orientation = window['orientation'];
    }
    else
    {
        if (window.outerWidth > window.outerHeight)
        {
            this.orientation = 90;
        }
        else
        {
            this.orientation = 0;
        }
    }

    this.scaleFactor = new Phaser.Point(1, 1);
    this.aspectRatio = 0;

    var _this = this;

    window.addEventListener('orientationchange', function (event) {
        return _this.checkOrientation(event);
    }, false);

    window.addEventListener('resize', function (event) {
        return _this.checkResize(event);
    }, false);
	
};

Phaser.StageScaleMode.EXACT_FIT = 0;
Phaser.StageScaleMode.NO_SCALE = 1;
Phaser.StageScaleMode.SHOW_ALL = 2;

Phaser.StageScaleMode.prototype = {

    startFullScreen: function () {

        if (this.isFullScreen)
        {
            return;
        }

        var element = this.game.canvas;
        
        if (element['requestFullScreen'])
        {
            element['requestFullScreen']();
        }
        else if (element['mozRequestFullScreen'])
        {
            element['mozRequestFullScreen']();
        }
        else if (element['webkitRequestFullScreen'])
        {
            element['webkitRequestFullScreen'](Element.ALLOW_KEYBOARD_INPUT);
        }

        this.game.stage.canvas.style['width'] = '100%';
        this.game.stage.canvas.style['height'] = '100%';

    },

    stopFullScreen: function () {

        if (document['cancelFullScreen'])
        {
            document['cancelFullScreen']();
        }
        else if (document['mozCancelFullScreen'])
        {
            document['mozCancelFullScreen']();
        }
        else if (document['webkitCancelFullScreen'])
        {
            document['webkitCancelFullScreen']();
        }

    },

    checkOrientationState: function () {

        //  They are in the wrong orientation
        if (this.incorrectOrientation)
        {
            if ((this.forceLandscape && window.innerWidth > window.innerHeight) || (this.forcePortrait && window.innerHeight > window.innerWidth))
            {
                //  Back to normal
                this.game.paused = false;
                this.incorrectOrientation = false;
                this.refresh();
            }
        }
        else
        {
            if ((this.forceLandscape && window.innerWidth < window.innerHeight) || (this.forcePortrait && window.innerHeight < window.innerWidth))
            {
                //  Show orientation screen
                this.game.paused = true;
                this.incorrectOrientation = true;
                this.refresh();
            }
        }
    },

	/**
    * Handle window.orientationchange events
    */
    checkOrientation: function (event) {

        this.orientation = window['orientation'];

        if (this.isLandscape)
        {
            this.enterLandscape.dispatch(this.orientation, true, false);
        }
        else
        {
            this.enterPortrait.dispatch(this.orientation, false, true);
        }

        if (this.game.stage.scaleMode !== Phaser.StageScaleMode.NO_SCALE)
        {
            this.refresh();
        }

    },

	/**
    * Handle window.resize events
    */
    checkResize: function (event) {

        if (window.outerWidth > window.outerHeight)
        {
            this.orientation = 90;
        }
        else
        {
            this.orientation = 0;
        }

        if (this.isLandscape)
        {
            this.enterLandscape.dispatch(this.orientation, true, false);
        }
        else
        {
            this.enterPortrait.dispatch(this.orientation, false, true);
        }

        if (this.game.stage.scaleMode !== Phaser.StageScaleMode.NO_SCALE)
        {
            this.refresh();
        }
    },

	/**
    * Re-calculate scale mode and update screen size.
    */
    refresh: function () {

        var _this = this;
        
        //  We can't do anything about the status bars in iPads, web apps or desktops
        if (this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false)
        {
            // document.documentElement['style'].minHeight = '2000px';
            // this._startHeight = window.innerHeight;

            if (this.game.device.android && this.game.device.chrome == false)
            {
                window.scrollTo(0, 1);
            }
            else
            {
                window.scrollTo(0, 0);
            }
        }

        if (this._check == null && this.maxIterations > 0)
        {
            this._iterations = this.maxIterations;
            this._check = window.setInterval(function () {
                return _this.setScreenSize();
            }, 10);
            this.setScreenSize();
        }

    },

	/**
    * Set screen size automatically based on the scaleMode.
    */
    setScreenSize: function (force) {

        if (typeof force == 'undefined')
        {
            force = false;
        }
        
        if (this.game.device.iPad == false && this.game.device.webApp == false && this.game.device.desktop == false) 
        {
            if (this.game.device.android && this.game.device.chrome == false)
            {
                window.scrollTo(0, 1);
            }
            else
            {
                window.scrollTo(0, 0);
            }
        }

        this._iterations--;

        if (force || window.innerHeight > this._startHeight || this._iterations < 0)
        {
            // Set minimum height of content to new window height
            document.documentElement['style'].minHeight = window.innerHeight + 'px';
        
            if (this.incorrectOrientation == true)
            {
                this.setMaximum();
            }
            else if (this.game.stage.scaleMode == Phaser.StageScaleMode.EXACT_FIT)
            {
                this.setExactFit();
            }
            else if (this.game.stage.scaleMode == Phaser.StageScaleMode.SHOW_ALL)
            {
                this.setShowAll();
            }

            this.setSize();
            clearInterval(this._check);
            this._check = null;
        }

    },

    setSize: function () {

        if (this.incorrectOrientation == false)
        {
            if (this.maxWidth && this.width > this.maxWidth)
            {
                this.width = this.maxWidth;
            }

            if (this.maxHeight && this.height > this.maxHeight)
            {
                this.height = this.maxHeight;
            }

            if (this.minWidth && this.width < this.minWidth)
            {
                this.width = this.minWidth;
            }

            if (this.minHeight && this.height < this.minHeight)
            {
                this.height = this.minHeight;
            }
        }

        this.game.canvas.style.width = this.width + 'px';
        this.game.canvas.style.height = this.height + 'px';
        
        this.game.input.scale.setTo(this.game.width / this.width, this.game.height / this.height);

        if (this.pageAlignHorizontally)
        {
            if (this.width < window.innerWidth && this.incorrectOrientation == false)
            {
                this.game.canvas.style.marginLeft = Math.round((window.innerWidth - this.width) / 2) + 'px';
            }
            else
            {
                this.game.canvas.style.marginLeft = '0px';
            }
        }

        if (this.pageAlignVeritcally)
        {
            if (this.height < window.innerHeight && this.incorrectOrientation == false)
            {
                this.game.canvas.style.marginTop = Math.round((window.innerHeight - this.height) / 2) + 'px';
            }
            else
            {
                this.game.canvas.style.marginTop = '0px';
            }
        }

        Phaser.Canvas.getOffset(this.game.canvas, this.game.stage.offset);
        
        this.aspectRatio = this.width / this.height;
        
        this.scaleFactor.x = this.game.width / this.width;
        this.scaleFactor.y = this.game.height / this.height;

    },

    setMaximum: function () {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

    },

    setShowAll: function () {

        var multiplier = Math.min((window.innerHeight / this.game.height), (window.innerWidth / this.game.width));

        this.width = Math.round(this.game.width * multiplier);
        this.height = Math.round(this.game.height * multiplier);

    },

    setExactFit: function () {

        var availableWidth = window.innerWidth - 0;
        var availableHeight = window.innerHeight - 5;

        console.log('available', availableWidth, availableHeight);

        if (this.maxWidth && availableWidth > this.maxWidth)
        {
            this.width = this.maxWidth;
        }
        else
        {
            this.width = availableWidth;
        }

        if (this.maxHeight && availableHeight > this.maxHeight)
        {
            this.height = this.maxHeight;
        }
        else
        {
            this.height = availableHeight;
        }

        console.log('setExactFit', this.width, this.height, this.game.stage.offset);

    }

};

Object.defineProperty(Phaser.StageScaleMode.prototype, "isFullScreen", {

    get: function () {

        if (document['fullscreenElement'] === null || document['mozFullScreenElement'] === null || document['webkitFullscreenElement'] === null)
        {
            return false;
        }

        return true;

    }

});

Object.defineProperty(Phaser.StageScaleMode.prototype, "isPortrait", {

    get: function () {
        return this.orientation == 0 || this.orientation == 180;
    }

});

Object.defineProperty(Phaser.StageScaleMode.prototype, "isLandscape", {

    get: function () {
        return this.orientation === 90 || this.orientation === -90;
    }

});

