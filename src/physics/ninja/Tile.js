/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Ninja Physics Tile constructor.
*
* @class Phaser.Physics.Ninja.Tile
* @classdesc Arcade Physics Constructor
* @constructor
* @param {Phaser.Game} game reference to the current game instance.
*/
Phaser.Physics.Ninja.Tile = function (system, x, y, width, height, type) {
    
    if (typeof type === 'undefined') { type = Phaser.Physics.Ninja.Tile.EMPTY; }

    this.system = system;

    this.id = type;
    this.type = Phaser.Physics.Ninja.Tile.TYPE_EMPTY;

    this.pos = new Phaser.Point(x, y);
    this.oldpos = new Phaser.Point(x, y);

    if (this.id > 1 && this.id < 30)
    {
        //  Tile Types 2 to 29 require square tile dimensions, so use the width as the base
        height = width;
    }

    this.xw = Math.abs(width / 2);
    this.yw = Math.abs(height / 2);

    this.width = width;
    this.height = height;

    this.drag = 1;
    this.friction = 0.05;
    this.gravityScale = 1;
    this.bounce = 0.3;
    this.velocity = new Phaser.Point();

    //  This stores tile-specific collision information
    this.signx = 0;
    this.signy = 0;
    this.sx = 0;
    this.sy = 0;

    if (this.id > 0)
    {
        this.setType(this.id);
    }

};

Phaser.Physics.Ninja.Tile.prototype.constructor = Phaser.Physics.Ninja.Tile;

Phaser.Physics.Ninja.Tile.prototype = {

    /**
    * Updates this AABBs position.
    *
    * @method Phaser.Physics.Ninja.AABB#integrate
    */
    integrate: function () {

        var px = this.pos.x;
        var py = this.pos.y;

        this.pos.x += (this.drag * this.pos.x) - (this.drag * this.oldpos.x);
        this.pos.y += (this.drag * this.pos.y) - (this.drag * this.oldpos.y);

        this.velocity.set(this.pos.x - px, this.pos.y - py);
        this.oldpos.set(px, py);

    },

    collideWorldBounds: function () {
    },

    //these functions are used to update the cell
    //note: id is assumed to NOT be "empty" state..
    //if it IS the empty state, the tile clears itself
    setType: function (id) {

        if (id === Phaser.Physics.Ninja.Tile.EMPTY)
        {
            this.clear();
        }
        else
        {
            //set tile state to a non-emtpy value, and update it's edges and those of the neighbors
            this.id = id;
            this.updateType();
        }

        return this;

    },

    clear: function () {

        this.id = Phaser.Physics.Ninja.Tile.EMPTY;
        this.updateType();

    },

    render: function (context, key) {
        
        if (this.id === 0)
        {
            return;
        }

        var image = this.system.game.cache.getImage(key);
        var data = this.system.game.cache.getFrameData(key);
        var frame = data._frames[this.id - 1];

        context.drawImage(image, frame.x, frame.y, frame.width, frame.height, this.x, this.y, this.width, this.height);

        // context.beginPath();
        // context.strokeStyle = 'rgb(255,255,0)';
        // context.strokeRect(this.x, this.y, this.width, this.height);
        // context.strokeRect(this.pos.x, this.pos.y, 2, 2); // center point
        // context.closePath();

    },

    //this converts a tile from implicitly-defined (via id), to explicit (via properties)
    updateType: function () {

        if (this.id === 0)
        {
            //EMPTY
            this.type = Phaser.Physics.Ninja.Tile.TYPE_EMPTY;
            this.signx = 0;
            this.signy = 0;
            this.sx = 0;
            this.sy = 0;

            return true;
        }

        //tile is non-empty; collide
        if (this.id < Phaser.Physics.Ninja.Tile.TYPE_45DEG)
        {
            //FULL
            this.type = Phaser.Physics.Ninja.Tile.TYPE_FULL;
            this.signx = 0;
            this.signy = 0;
            this.sx = 0;
            this.sy = 0;
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_CONCAVE)
        {
            //  45deg
            this.type = Phaser.Physics.Ninja.Tile.TYPE_45DEG;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn)
            {
                this.signx = 1;
                this.signy = -1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)               
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGnn)
            {
                this.signx = -1;
                this.signy = -1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)               
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGnp)
            {
                this.signx = -1;
                this.signy = 1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)               
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_45DEGpp)
            {
                this.signx = 1;
                this.signy = 1;
                this.sx = this.signx / Math.SQRT2;//get slope _unit_ normal
                this.sy = this.signy / Math.SQRT2;//since normal is (1,-1), length is sqrt(1*1 + -1*-1) = sqrt(2)               
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_CONVEX)
        {
            //  Concave
            this.type = Phaser.Physics.Ninja.Tile.TYPE_CONCAVE;

            if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEpn)
            {
                this.signx = 1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEnn)
            {
                this.signx = -1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEnp)
            {
                this.signx = -1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONCAVEpp)
            {
                this.signx = 1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_22DEGs)
        {
            //  Convex
            this.type = Phaser.Physics.Ninja.Tile.TYPE_CONVEX;

            if (this.id == Phaser.Physics.Ninja.Tile.CONVEXpn)
            {
                this.signx = 1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONVEXnn)
            {
                this.signx = -1;
                this.signy = -1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONVEXnp)
            {
                this.signx = -1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.CONVEXpp)
            {
                this.signx = 1;
                this.signy = 1;
                this.sx = 0;
                this.sy = 0;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_22DEGb)
        {
            //  22deg small
            this.type = Phaser.Physics.Ninja.Tile.TYPE_22DEGs;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnS)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnS)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpS)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGppS)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_67DEGs)
        {
            //  22deg big
            this.type = Phaser.Physics.Ninja.Tile.TYPE_22DEGb;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnB)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnB)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpB)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_22DEGppB)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 1) / slen;
                this.sy = (this.signy * 2) / slen;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_67DEGb)
        {
            //  67deg small
            this.type = Phaser.Physics.Ninja.Tile.TYPE_67DEGs;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnS)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnS)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpS)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGppS)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else
            {
                return false;
            }
        }
        else if (this.id < Phaser.Physics.Ninja.Tile.TYPE_HALF)
        {
            //  67deg big
            this.type = Phaser.Physics.Ninja.Tile.TYPE_67DEGb;

            if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnB)
            {
                this.signx = 1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnB)
            {
                this.signx = -1;
                this.signy = -1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpB)
            {
                this.signx = -1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.SLOPE_67DEGppB)
            {
                this.signx = 1;
                this.signy = 1;
                var slen = Math.sqrt(2 * 2 + 1 * 1);
                this.sx = (this.signx * 2) / slen;
                this.sy = (this.signy * 1) / slen;
            }
            else
            {
                return false;
            }
        }
        else
        {
            //  Half-full tile
            this.type = Phaser.Physics.Ninja.Tile.TYPE_HALF;

            if (this.id == Phaser.Physics.Ninja.Tile.HALFd)
            {
                this.signx = 0;
                this.signy = -1;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.HALFu)
            {
                this.signx = 0;
                this.signy = 1;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.HALFl)
            {
                this.signx = 1;
                this.signy = 0;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else if (this.id == Phaser.Physics.Ninja.Tile.HALFr)
            {
                this.signx = -1;
                this.signy = 0;
                this.sx = this.signx;
                this.sy = this.signy;
            }
            else
            {
                return false;
            }
        }
    }

}

/**
* @name Phaser.Physics.Ninja.Tile#x
* @property {number} x - The x position.
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "x", {
    
    /**
    * The x position.
    * @method x
    * @return {number}
    */
    get: function () {
        return this.pos.x - this.xw;
    },

    /**
    * The x position.
    * @method x
    * @param {number} value
    */
    set: function (value) {
        this.pos.x = value;
    }

});

/**
* @name Phaser.Physics.Ninja.Tile#y
* @property {number} y - The y position.
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "y", {
    
    /**
    * The y position.
    * @method y
    * @return {number}
    */
    get: function () {
        return this.pos.y - this.yw;
    },

    /**
    * The y position.
    * @method y
    * @param {number} value
    */
    set: function (value) {
        this.pos.y = value;
    }

});

/**
* @name Phaser.Physics.Ninja.Tile#bottom
* @property {number} bottom - The bottom value of this Body (same as Body.y + Body.height)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "bottom", {
    
    /**
    * The sum of the y and height properties.
    * @method bottom
    * @return {number}
    * @readonly
    */
    get: function () {
        return this.pos.y + this.yw;
    }

});

/**
* @name Phaser.Physics.Ninja.Tile#right
* @property {number} right - The right value of this Body (same as Body.x + Body.width)
* @readonly
*/
Object.defineProperty(Phaser.Physics.Ninja.Tile.prototype, "right", {
    
    /**
    * The sum of the x and width properties.
    * @method right
    * @return {number}
    * @readonly
    */
    get: function () {
        return this.pos.x + this.xw;
    }

});

//  TILETYPE ENUMERATION
Phaser.Physics.Ninja.Tile.EMPTY = 0;
Phaser.Physics.Ninja.Tile.FULL = 1;//fullAABB tile
Phaser.Physics.Ninja.Tile.SLOPE_45DEGpn = 2;//45-degree triangle, whose normal is (+ve,-ve)
Phaser.Physics.Ninja.Tile.SLOPE_45DEGnn = 3;//(+ve,+ve)
Phaser.Physics.Ninja.Tile.SLOPE_45DEGnp = 4;//(-ve,+ve)
Phaser.Physics.Ninja.Tile.SLOPE_45DEGpp = 5;//(-ve,-ve)
Phaser.Physics.Ninja.Tile.CONCAVEpn = 6;//1/4-circle cutout
Phaser.Physics.Ninja.Tile.CONCAVEnn = 7;
Phaser.Physics.Ninja.Tile.CONCAVEnp = 8;
Phaser.Physics.Ninja.Tile.CONCAVEpp = 9;
Phaser.Physics.Ninja.Tile.CONVEXpn = 10;//1/4/circle
Phaser.Physics.Ninja.Tile.CONVEXnn = 11;
Phaser.Physics.Ninja.Tile.CONVEXnp = 12;
Phaser.Physics.Ninja.Tile.CONVEXpp = 13;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnS = 14;//22.5 degree slope
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnS = 15;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpS = 16;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGppS = 17;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGpnB = 18;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnnB = 19;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGnpB = 20;
Phaser.Physics.Ninja.Tile.SLOPE_22DEGppB = 21;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnS = 22;//67.5 degree slope
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnS = 23;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpS = 24;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGppS = 25;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGpnB = 26;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnnB = 27;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGnpB = 28;
Phaser.Physics.Ninja.Tile.SLOPE_67DEGppB = 29;
Phaser.Physics.Ninja.Tile.HALFd = 30;//half-full tiles
Phaser.Physics.Ninja.Tile.HALFr = 31;
Phaser.Physics.Ninja.Tile.HALFu = 32;
Phaser.Physics.Ninja.Tile.HALFl = 33;

//collision shape  "types"
Phaser.Physics.Ninja.Tile.TYPE_EMPTY = 0;
Phaser.Physics.Ninja.Tile.TYPE_FULL = 1;
Phaser.Physics.Ninja.Tile.TYPE_45DEG = 2;
Phaser.Physics.Ninja.Tile.TYPE_CONCAVE = 6;
Phaser.Physics.Ninja.Tile.TYPE_CONVEX = 10;
Phaser.Physics.Ninja.Tile.TYPE_22DEGs = 14;
Phaser.Physics.Ninja.Tile.TYPE_22DEGb = 18;
Phaser.Physics.Ninja.Tile.TYPE_67DEGs = 22;
Phaser.Physics.Ninja.Tile.TYPE_67DEGb = 26;
Phaser.Physics.Ninja.Tile.TYPE_HALF = 30;
