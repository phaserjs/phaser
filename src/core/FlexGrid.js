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

    this.boundsFluid = new Phaser.Rectangle(0, 0, width, height);
    this.boundsFull = manager.bounds;
    this.boundsNone = new Phaser.Rectangle(0, 0, width, height);

    /**
    * @property {Phaser.Point} position - 
    * @readonly
    */
    this.positionFluid = new Phaser.Point(0, 0);
    this.positionFull = new Phaser.Point(0, 0);
    this.positionNone = new Phaser.Point(0, 0);

    /**
    * @property {Phaser.Point} scaleFactor - The scale factor based on the game dimensions vs. the scaled dimensions.
    * @readonly
    */
    this.scaleFluid = new Phaser.Point(1, 1);
    this.scaleFull = new Phaser.Point(1, 1);
    this.scaleNone = new Phaser.Point(1, 1);

    this.ratioH = width / height;
    this.ratioV = height / width;

    this.multiplier = 0;

    this.layers = [];

};

Phaser.FlexGrid.prototype = {

    setSize: function (width, height) {

        //  These are locked and don't change until setSize is called again
        this.width = width;
        this.height = height;

        this.ratioH = width / height;
        this.ratioV = height / width;

        this.scaleNone = new Phaser.Point(1, 1);

        this.boundsNone.width = this.width;
        this.boundsNone.height = this.height;

        this.refresh();

    },

    //  Need ability to create your own layers with custom scaling, etc.

    createFluidLayer: function () {

        var layer = this.game.add.group();

        //  Override the position and scale so they point to our objects instead, this will keep them matched
        layer.position = this.positionFluid;
        layer.scale = this.scaleFluid;

        this.layers.push(layer);

        return layer;

    },

    createFullLayer: function () {

        var layer = this.game.add.group();

        //  Override the position and scale so they point to our objects instead, this will keep them matched
        layer.position = this.positionFull;
        layer.scale = this.scaleFull;

        this.layers.push(layer);

        return layer;

    },

    createFixedLayer: function () {

        var layer = this.game.add.group();

        //  Override the position and scale so they point to our objects instead, this will keep them matched
        layer.position = this.positionNone;
        layer.scale = this.scaleNone;

        this.layers.push(layer);

        return layer;

    },

    reset: function () {

        for (var i = 0; i < this.layers.length; i++)
        {
            //  Remove references to this class
            this.layers[i].position = null;
            this.layers[i].scale = null;
        }

        this.layers.length = 0;

    },

    onResize: function (width, height) {

        this.refresh(width, height);

    },

    refresh: function () {

        this.multiplier = Math.min((this.manager.height / this.height), (this.manager.width / this.width));

        this.boundsFluid.width = Math.round(this.width * this.multiplier);
        this.boundsFluid.height = Math.round(this.height * this.multiplier);

        this.scaleFluid.set(this.boundsFluid.width / this.width, this.boundsFluid.height / this.height);
        this.scaleFull.set(this.boundsFull.width / this.width, this.boundsFull.height / this.height);

        this.boundsFluid.centerOn(this.manager.bounds.centerX, this.manager.bounds.centerY);
        this.boundsNone.centerOn(this.manager.bounds.centerX, this.manager.bounds.centerY);

        this.positionFluid.set(this.boundsFluid.x, this.boundsFluid.y);
        this.positionNone.set(this.boundsNone.x, this.boundsNone.y);

    },

    debug: function () {

        this.game.debug.text(this.boundsFluid.width + ' x ' + this.boundsFluid.height, this.boundsFluid.x + 4, this.boundsFluid.y + 16);
        this.game.debug.geom(this.boundsFluid, 'rgba(255,0,0,0.9', false);

        this.game.debug.text(this.boundsNone.width + ' x ' + this.boundsNone.height, this.boundsNone.x + 4, this.boundsNone.y + 16);
        this.game.debug.geom(this.boundsNone, 'rgba(0,255,0,0.9', false);

    }

};

Phaser.FlexGrid.prototype.constructor = Phaser.FlexGrid;
