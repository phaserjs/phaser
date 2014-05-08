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

    //  TODO: History limit, History scan, record how many times walker has been on a tile before

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

    putTile: function (index) {

        this.map.putTile(index, this.location.x, this.location.y, this.locationLayer);

    },

    getTileFromLocation: function (x, y) {

        return this.map.getTile(this.location.x + x, this.location.y + y, this.locationLayer, true);

    },

    getTile: function () {

        return this.map.getTile(this.location.x, this.location.y, this.locationLayer, true);

    },

    getTiles: function (width, height, center) {

        var startX;
        var startX;
        var endX;
        var endY;
        var incX;
        var incY;

        var hw = Math.floor(width / 2);
        var hh = Math.floor(height / 2);

        //  For now we assume that center = bottom middle tile

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
            endY = this.location.y + (height - 1);
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

        var output = [];
        var row = [];

        for (var y = startY; y <= endY; y += incY)
        {
            row = [];

            for (var x = startX; x <= endX; x += incX)
            {
                var tile = this.map.getTile(x, y, this.locationLayer, true);

                if (tile)
                {
                    row.push(tile.index);
                }
                else
                {
                    //  out of bounds, so block it off
                    row.push(2);
                }
            }

            output.push(row);
        }

        // console.log(printMatrix(output));

        if (this.facing === Phaser.Tilemap.EAST)
        {
            output = rotateMatrix(output, 90);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            output = rotateMatrix(output, 180);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            output = rotateMatrix(output, -90);
        }

        // console.log('rotate');
        console.log(printMatrix(output));

        return output;

    },

    getTileAhead: function (distance) {

        if (typeof distance === 'undefined') { distance = 1; }

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(0, -distance);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(distance, 0);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(0, distance);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(-distance, 0);
        }

    },

    getTileAheadLeft: function (distance) {

        if (typeof distance === 'undefined') { distance = 1; }

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(-distance, -distance);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(distance, -distance);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(distance, distance);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(-distance, distance);
        }

    },

    getTileAheadRight: function (distance) {

        if (typeof distance === 'undefined') { distance = 1; }

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(distance, -distance);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(distance, distance);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(-distance, distance);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(-distance, -distance);
        }

    },

    getTileBehind: function (distance) {

        if (typeof distance === 'undefined') { distance = 1; }

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(0, distance);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(-distance, 0);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(0, -distance);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(distance, 0);
        }

    },

    getTileBehindLeft: function (distance) {

        if (typeof distance === 'undefined') { distance = 1; }

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(-distance, distance);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(-distance, -distance);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(distance, -distance);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(distance, distance);
        }

    },

    getTileBehindRight: function (distance) {

        if (typeof distance === 'undefined') { distance = 1; }

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(distance, distance);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(-distance, distance);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(-distance, -distance);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(distance, -distance);
        }

    },

    getTileLeft: function (distance) {

        if (typeof distance === 'undefined') { distance = 1; }

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(-distance, 0);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(0, -distance);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(distance, 0);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(0, distance);
        }

    },

    getTileRight: function (distance) {

        if (typeof distance === 'undefined') { distance = 1; }

        if (this.facing === Phaser.Tilemap.NORTH)
        {
            return this.getTileFromLocation(distance, 0);
        }
        else if (this.facing === Phaser.Tilemap.EAST)
        {
            return this.getTileFromLocation(0, distance);
        }
        else if (this.facing === Phaser.Tilemap.SOUTH)
        {
            return this.getTileFromLocation(-distance, 0);
        }
        else if (this.facing === Phaser.Tilemap.WEST)
        {
            return this.getTileFromLocation(0, -distance);
        }

    }

};

//  Original from http://jsfiddle.net/MrPolywhirl/NH42z/ - tided up and de-globalised by Richard Davey
var rotateMatrix = function (matrix, direction) {

    direction = ((direction % 360) + 360) % 360;

    var ret = matrix;

    var transpose = function (m) {
        var result = new Array(m[0].length);
        for (var i = 0; i < m[0].length; i++) {
            result[i] = new Array(m.length - 1);
            for (var j = m.length - 1; j > -1; j--) {
                result[i][j] = m[j][i];
            }
        }
        return result;
    };

    var reverseRows = function (m) {
        return m.reverse();
    };

    var reverseCols = function (m) {
        for (var i = 0; i < m.length; i++) {
            m[i].reverse();
        }
        return m;
    };

    var rotate90Left = function (m) {
        m = transpose(m);
        m = reverseRows(m);
        return m;
    };

    var rotate90Right = function (m) {
        m = reverseRows(m);
        m = transpose(m);
        return m;
    };

    var rotate180 = function (m) {
        m = reverseCols(m);
        m = reverseRows(m);
        return m;
    };

    if (direction == 90 || direction == -270) {
        return rotate90Left(ret);
    } else if (direction == -90 || direction == 270) {
        return rotate90Right(ret);
    } else if (Math.abs(direction) == 180) {
        return rotate180(ret);
    }

    return matrix;
};

var pad = function (val, amt, ch) {
    ch = typeof ch !== 'undefined' ? ch : ' ';
    var str = val
    var max = Math.abs(amt);
    while (str.length < max) {
        if (amt < 0) {
            str += ch;
        } else {
            str = ch + str;
        }
    }
    return str;
};

var printMatrix = function (matrix) {
    var str = '';
    for (var r = 0; r < matrix.length; r++) {
        for (var c = 0; c < matrix[r].length; c++) {
            var cell = matrix[r][c].toString();
            if (cell != 'undefined') {
                str += pad(cell, 2);
            } else {
                str += '?';
            }
            if (c < matrix[r].length - 1) {
                str += ' |';
            }
        }
        if (r < matrix.length - 1) {
            str += '\n';
            for (var i = 0; i < matrix[r].length; i++) {
                str += '---'
                if (i < matrix[r].length - 1) {
                    str += '+';
                }
            }
            str += '\n';
        }
    }
    return str;
};

