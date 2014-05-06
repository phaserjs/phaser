/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates an object that is placed within a layer of a Phaser.Tilemap and can be moved around and rotated using the direction commands.
*
* @class Phaser.Plugin.TilemapWalker
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
* @param {Phaser.Tilemap} map - A reference to the Tilemap this TilemapWalker belongs to.
* @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to this.currentLayer.
* @param {number} x - X position of the top left of the area to copy (given in tiles, not pixels)
* @param {number} y - Y position of the top left of the area to copy (given in tiles, not pixels)
* @return {Phaser.Plugin.TilemapWalker}
*/
Phaser.Plugin.TilemapWalker = function (game, map, layer, x, y) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
	this.game = game;

    /**
    * @property {Phaser.Tilemap} map - A reference to the Tilemap this TilemapWalker belongs to.
    */
	this.map = map;

    /**
    * @property {number} locationLayer - The current layer of the location marker.
    */
	this.locationLayer = map.getLayer(layer);

    /**
    * @property {Phaser.Point} location - The current marker location. You can move the marker with the movement methods.
    */
    this.location = new Phaser.Point();

    /**
    * @property {number} facing - The direction the location marker is facing. You can rotate it using the turn and face methods.
    * @default
    */
    this.facing = Phaser.Tilemap.NORTH;

    /**
    * @property {boolean} collides - Does the TilemapWalker collide with the tiles in the map set for collision? If so it cannot move through them.
    * @default
    */
    this.collides = true;

    /**
    * @property {array} history - An array containing a history of movements through the map.
    */
    this.history = [];

    //	TODO: History limit, History scan, record how many times walker has been on a tile before

    if (typeof x !== 'undefined' && typeof y !== 'undefined')
    {
        this.setLocation(x, y);
    }

    return this;

};

Phaser.Plugin.TilemapWalker.prototype = {

    /**
    * Sets the location marker to the given x/y coordinates within the map.
    * Once set you can move the marker around via the movement and turn methods.
    *
    * @method Phaser.Tilemap#setLocation
    * @param {number} x - X position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number} y - Y position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number|string|Phaser.TilemapLayer} [layer] - The layer to operate on. If not given will default to this.currentLayer.
    * @return {boolean} True if the location could be set, otherwise false.
    */
    setLocation: function (x, y, layer) {

        if (this.checkTile(x, y))
        {
            this.location.set(x, y);
            this.history.push( { x: x, y: y });

            return true;
        }

        return false;

    },

    /**
    * Checks if the given x/y coordinate has a tile into which we can move.
    *
    * @method Phaser.Tilemap#checkTile
    * @param {number} x - X position of the top left of the area to copy (given in tiles, not pixels)
    * @param {number} y - Y position of the top left of the area to copy (given in tiles, not pixels)
    * @return {boolean} True if the location can be moved into, false if not.
    */
    checkTile: function (x, y) {

        if (this.map.hasTile(x, y, this.locationLayer))
        {
        	if (this.collides)
        	{
        		var tile = this.map.getTile(x, y, this.locationLayer);

        		if (tile && tile.collides)
        		{
        			return false;
        		}
        	}

        	return true;
        }

        return false;

    },

    updateLocation: function (x, y) {

        if (this.checkTile(this.location.x + x, this.location.y + y, this.locationLayer))
        {
            this.location.set(this.location.x + x, this.location.y + y);
            this.history.push( { x: x, y: y });

            return true;
        }

        return false;

    },

    moveForward: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.updateLocation(0, -1);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.updateLocation(1, 0);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.updateLocation(0, 1);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.updateLocation(-1, 0);
        }

    },

    moveBackward: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.updateLocation(0, 1);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.updateLocation(-1, 0);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.updateLocation(0, -1);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.updateLocation(1, 0);
        }

    },

    moveLeft: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.updateLocation(-1, 0);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.updateLocation(0, -1);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.updateLocation(1, 0);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.updateLocation(0, 1);
        }

    },

    moveRight: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.updateLocation(1, 0);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.updateLocation(0, 1);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.updateLocation(-1, 0);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.updateLocation(0, -1);
        }

    },

    turnLeft: function () {

        this.facing--;

        if (this.facing === -1)
        {
            this.facing = 3;
        }

    },

    turnRight: function () {

        this.facing++;

        if (this.facing === 4)
        {
            this.facing = 0;
        }

    },

    getTileFromLocation: function (x, y) {

        return this.map.getTile(this.location.x + x, this.location.y + y, this.locationLayer);

    },

    getTile: function () {

    	//	Get the current tile the walker is on
    	return this.map.getTile(this.location.x, this.location.y, this.locationLayer);

    },

    getTiles: function (width, height, center) {

        var output = [];
        var startX;
        var startX;
        var endX;
        var endY;
        var incX;
        var incY;

        var hw = Math.floor(width / 2);
        var hh = Math.floor(height / 2);

        //  For now we assume that center = bottom middle

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            startX = this.location.x - hw;
            endX = this.location.x + hw;
            incX = 1;

            //  bottom middle align
            startY = this.location.y - (height - 1);
            endY = this.location.y;
            incY = 1;
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            startX = this.location.x;
            endX = this.location.x + (width - 1);
            incX = 1;

            //  bottom middle align
            startY = this.location.y - hh;
            endY = this.location.y + hh;
            incY = 1;
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            startX = this.location.x - hw;
            endX = this.location.x + hw;
            incX = 1;

            //  bottom middle align
            startY = this.location.y;
            endY = this.location.y - (height - 1);
            incY = 1;
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            startX = this.location.x - (width - 1);
            endX = this.location.x;
            incX = 1;

            //  bottom middle align
            startY = this.location.y - hh;
            endY = this.location.y + hh;
            incY = 1;
        }

        // console.log('getTiles', startX, endX, startY, endY);

        for (var y = startY; y <= endY; y += incY)
        {
            for (var x = startX; x <= endX; x += incX)
            {
                output.push(this.map.getTile(x, y, this.locationLayer));
                // console.log(x, y, this.map.getTile(x, y, this.locationLayer));
            }
        }

        return output;

    },

    getTileAhead: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(0, -1);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(1, 0);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(0, 1);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(-1, 0);
        }

    },

    getTileAheadLeft: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(-1, -1);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(1, -1);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(1, 1);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(-1, 1);
        }

    },

    getTileAheadRight: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(1, -1);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(1, 1);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(-1, 1);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(-1, -1);
        }

    },

    getTileBehind: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(0, 1);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(-1, 0);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(0, -1);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(1, 0);
        }

    },

    getTileBehindLeft: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(-1, 1);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(-1, -1);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(1, -1);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(1, 1);
        }

    },

    getTileBehindRight: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(1, 1);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(-1, 1);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(-1, -1);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(1, -1);
        }

    },

    getTileLeft: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(-1, 0);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(0, -1);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(1, 0);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(0, 1);
        }

    },

    getTileRight: function () {

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(1, 0);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(0, 1);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(-1, 0);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(0, -1);
        }

    },

};
