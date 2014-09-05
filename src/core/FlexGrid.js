/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A responsive grid manager.
*
* @class Phaser.FlexGrid
* @constructor
* @param {Phaser.ScaleManager} manager - The ScaleManager.
*/
Phaser.FlexGrid = function (manager, width, height) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = manager.game;

    /**
    * @property {Phaser.ScaleManager} scale - A reference to the ScaleManager.
    */
    this.manager = manager;

    //  The perfect dimensions on which everything else is based
    this.width = width;
    this.height = height;

    this.bounds = new Phaser.Rectangle(0, 0, width, height);

    /**
    * @property {Phaser.Point} position - 
    * @readonly
    */
    this.position = new Phaser.Point(0, 0);

    /**
    * @property {Phaser.Point} scaleFactor - The scale factor based on the game dimensions vs. the scaled dimensions.
    * @readonly
    */
    this.scaleFactor = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} scaleFactorInversed - The inversed scale factor. The displayed dimensions divided by the game dimensions.
    * @readonly
    */
    this.scaleFactorInversed = new Phaser.Point(1, 1);

    this.ratioH = width / height;
    this.ratioV = height / width;

    this.multiplier = 0;

    this.fitHorizontally = false;
    this.fitVertically = false;

    this.layers = [];

};

Phaser.FlexGrid.prototype = {

    setSize: function (width, height) {

        //  These are locked and don't change until setSize is called again
        this.width = width;
        this.height = height;

        this.ratioH = width / height;
        this.ratioV = height / width;

        this.refresh();

    },

    createLayer: function () {

        var layer = this.game.add.group();

        //  Override the position and scale so they point to our objects instead, this will keep them matched
        layer.position = this.position;
        layer.scale = this.scaleFactor;

        this.layers.push(layer);

        return layer;

    },

    onResize: function (width, height) {

        this.refresh();

    },

    refresh: function () {

        //  Now let's scale it

        this.multiplier = Math.min((this.manager.height / this.height), (this.manager.width / this.width));

        this.bounds.width = Math.round(this.width * this.multiplier);
        this.bounds.height = Math.round(this.height * this.multiplier);

        //  Max checks?

        this.scaleFactor.set(this.bounds.width / this.width, this.bounds.height / this.height);
        this.scaleFactorInversed.set(this.width / this.bounds.width, this.height / this.bounds.height);

        this.bounds.centerOn(this.manager.bounds.centerX, this.manager.bounds.centerY);

        this.position.set(this.bounds.x, this.bounds.y);

    },

    debug: function () {

        this.game.debug.text("h: " + this.ratioH + " v: " + this.ratioV, 32, 32);
        this.game.debug.text(this.scaleFactor, 32, 64);
        // this.game.debug.text(this.scaleFactorInversed, 32, 64+32);
        // this.game.debug.geom(this.bounds);

    },

};

Phaser.FlexGrid.prototype.constructor = Phaser.FlexGrid;
