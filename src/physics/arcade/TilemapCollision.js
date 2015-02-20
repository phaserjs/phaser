/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

Phaser.Physics.Arcade.TilemapCollision = function () {

};

/**
* The Arcade Physics tilemap collision methods.
*
* @class Phaser.Physics.Arcade.TilemapCollision
* @constructor
* @param {Phaser.Game} game - reference to the current game instance.
*/
Phaser.Physics.Arcade.TilemapCollision.prototype = {

    /**
    * @property {number} TILE_BIAS - A value added to the delta values during collision with tiles. Adjust this if you get tunneling.
    */
    TILE_BIAS: 16,

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @method Phaser.Physics.Arcade#collideSpriteVsTilemapLayer
    * @private
    * @param {Phaser.Sprite} sprite - The sprite to check.
    * @param {Phaser.TilemapLayer} tilemapLayer - The layer to check.
    * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
    * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
    * @param {object} callbackContext - The context in which to run the callbacks.
    * @param {boolean} overlapOnly - Just run an overlap or a full collision.
    */
    collideSpriteVsTilemapLayer: function (sprite, tilemapLayer, collideCallback, processCallback, callbackContext) {

        if (!sprite.body)
        {
            return;
        }

        var mapData = tilemapLayer.getTiles(
            sprite.body.position.x - sprite.body.tilePadding.x,
            sprite.body.position.y - sprite.body.tilePadding.y,
            sprite.body.width + sprite.body.tilePadding.x,
            sprite.body.height + sprite.body.tilePadding.y,
            false, false);

        if (mapData.length === 0)
        {
            return;
        }

        for (var i = 0; i < mapData.length; i++)
        {
            if (processCallback)
            {
                if (processCallback.call(callbackContext, sprite, mapData[i]))
                {
                    if (this.separateTile(i, sprite.body, mapData[i]))
                    {
                        this._total++;

                        if (collideCallback)
                        {
                            collideCallback.call(callbackContext, sprite, mapData[i]);
                        }
                    }
                }
            }
            else
            {
                if (this.separateTile(i, sprite.body, mapData[i]))
                {
                    this._total++;

                    if (collideCallback)
                    {
                        collideCallback.call(callbackContext, sprite, mapData[i]);
                    }
                }
            }
        }

    },

    /**
    * An internal function. Use Phaser.Physics.Arcade.collide instead.
    *
    * @private
    * @method Phaser.Physics.Arcade#collideGroupVsTilemapLayer
    * @param {Phaser.Group} group - The Group to check.
    * @param {Phaser.TilemapLayer} tilemapLayer - The layer to check.
    * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
    * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
    * @param {object} callbackContext - The context in which to run the callbacks.
    * @param {boolean} overlapOnly - Just run an overlap or a full collision.
    */
    collideGroupVsTilemapLayer: function (group, tilemapLayer, collideCallback, processCallback, callbackContext) {

        if (group.length === 0)
        {
            return;
        }

        for (var i = 0; i < group.children.length; i++)
        {
            if (group.children[i].exists)
            {
                this.collideSpriteVsTilemapLayer(group.children[i], tilemapLayer, collideCallback, processCallback, callbackContext);
            }
        }

    },

    /**
    * The core separation function to separate a physics body and a tile.
    *
    * @private
    * @method Phaser.Physics.Arcade#separateTile
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
    * @param {Phaser.Tile} tile - The tile to collide against.
    * @return {boolean} Returns true if the body was separated, otherwise false.
    */
    separateTile: function (i, body, tile) {

        //  We re-check for collision in case body was separated in a previous step
        if (!body.enable || !tile.intersects(body.position.x, body.position.y, body.right, body.bottom))
        {
            //  no collision so bail out (separated in a previous step)
            return false;
        }

        //  They overlap. Any custom callbacks?

        //  A local callback always takes priority over a layer level callback
        if (tile.collisionCallback && !tile.collisionCallback.call(tile.collisionCallbackContext, body.sprite, tile))
        {
            //  If it returns true then we can carry on, otherwise we should abort.
            return false;
        }
        else if (tile.layer.callbacks[tile.index] && !tile.layer.callbacks[tile.index].callback.call(tile.layer.callbacks[tile.index].callbackContext, body.sprite, tile))
        {
            //  If it returns true then we can carry on, otherwise we should abort.
            return false;
        }

        //  We don't need to go any further if this tile doesn't actually separate
        if (!tile.faceLeft && !tile.faceRight && !tile.faceTop && !tile.faceBottom)
        {
            //   This could happen if the tile was meant to be collided with re: a callback, but otherwise isn't needed for separation
            return false;
        }

        var ox = 0;
        var oy = 0;
        var minX = 0;
        var minY = 1;

        if (body.deltaAbsX() > body.deltaAbsY())
        {
            //  Moving faster horizontally, check X axis first
            minX = -1;
        }
        else if (body.deltaAbsX() < body.deltaAbsY())
        {
            //  Moving faster vertically, check Y axis first
            minY = -1;
        }

        if (body.deltaX() !== 0 && body.deltaY() !== 0 && (tile.faceLeft || tile.faceRight) && (tile.faceTop || tile.faceBottom))
        {
            //  We only need do this if both axis have checking faces AND we're moving in both directions
            minX = Math.min(Math.abs(body.position.x - tile.right), Math.abs(body.right - tile.left));
            minY = Math.min(Math.abs(body.position.y - tile.bottom), Math.abs(body.bottom - tile.top));
        }

        if (minX < minY)
        {
            if (tile.faceLeft || tile.faceRight)
            {
                ox = this.tileCheckX(body, tile);

                //  That's horizontal done, check if we still intersects? If not then we can return now
                if (ox !== 0 && !tile.intersects(body.position.x, body.position.y, body.right, body.bottom))
                {
                    return true;
                }
            }

            if (tile.faceTop || tile.faceBottom)
            {
                oy = this.tileCheckY(body, tile);
            }
        }
        else
        {
            if (tile.faceTop || tile.faceBottom)
            {
                oy = this.tileCheckY(body, tile);

                //  That's vertical done, check if we still intersects? If not then we can return now
                if (oy !== 0 && !tile.intersects(body.position.x, body.position.y, body.right, body.bottom))
                {
                    return true;
                }
            }

            if (tile.faceLeft || tile.faceRight)
            {
                ox = this.tileCheckX(body, tile);
            }
        }

        return (ox !== 0 || oy !== 0);

    },

    /**
    * Check the body against the given tile on the X axis.
    *
    * @private
    * @method Phaser.Physics.Arcade#tileCheckX
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
    * @param {Phaser.Tile} tile - The tile to check.
    * @return {number} The amount of separation that occurred.
    */
    tileCheckX: function (body, tile) {

        var ox = 0;

        if (body.deltaX() < 0 && !body.blocked.left && tile.collideRight && body.checkCollision.left)
        {
            //  Body is moving LEFT
            if (tile.faceRight && body.x < tile.right)
            {
                ox = body.x - tile.right;

                if (ox < -this.TILE_BIAS)
                {
                    ox = 0;
                }
            }
        }
        else if (body.deltaX() > 0 && !body.blocked.right && tile.collideLeft && body.checkCollision.right)
        {
            //  Body is moving RIGHT
            if (tile.faceLeft && body.right > tile.left)
            {
                ox = body.right - tile.left;

                if (ox > this.TILE_BIAS)
                {
                    ox = 0;
                }
            }
        }

        if (ox !== 0)
        {
            if (body.customSeparateX)
            {
                body.overlapX = ox;
            }
            else
            {
                this.processTileSeparationX(body, ox);
            }
        }

        return ox;

    },

    /**
    * Check the body against the given tile on the Y axis.
    *
    * @private
    * @method Phaser.Physics.Arcade#tileCheckY
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
    * @param {Phaser.Tile} tile - The tile to check.
    * @return {number} The amount of separation that occurred.
    */
    tileCheckY: function (body, tile) {

        var oy = 0;

        if (body.deltaY() < 0 && !body.blocked.up && tile.collideDown && body.checkCollision.up)
        {
            //  Body is moving UP
            if (tile.faceBottom && body.y < tile.bottom)
            {
                oy = body.y - tile.bottom;

                if (oy < -this.TILE_BIAS)
                {
                    oy = 0;
                }
            }
        }
        else if (body.deltaY() > 0 && !body.blocked.down && tile.collideUp && body.checkCollision.down)
        {
            //  Body is moving DOWN
            if (tile.faceTop && body.bottom > tile.top)
            {
                oy = body.bottom - tile.top;

                if (oy > this.TILE_BIAS)
                {
                    oy = 0;
                }
            }
        }

        if (oy !== 0)
        {
            if (body.customSeparateY)
            {
                body.overlapY = oy;
            }
            else
            {
                this.processTileSeparationY(body, oy);
            }
        }

        return oy;

    },

    /**
    * Internal function to process the separation of a physics body from a tile.
    *
    * @private
    * @method Phaser.Physics.Arcade#processTileSeparationX
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
    * @param {number} x - The x separation amount.
    */
    processTileSeparationX: function (body, x) {

        if (x < 0)
        {
            body.blocked.left = true;
        }
        else if (x > 0)
        {
            body.blocked.right = true;
        }

        body.position.x -= x;

        if (body.bounce.x === 0)
        {
            body.velocity.x = 0;
        }
        else
        {
            body.velocity.x = -body.velocity.x * body.bounce.x;
        }

    },

    /**
    * Internal function to process the separation of a physics body from a tile.
    *
    * @private
    * @method Phaser.Physics.Arcade#processTileSeparationY
    * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
    * @param {number} y - The y separation amount.
    */
    processTileSeparationY: function (body, y) {

        if (y < 0)
        {
            body.blocked.up = true;
        }
        else if (y > 0)
        {
            body.blocked.down = true;
        }

        body.position.y -= y;

        if (body.bounce.y === 0)
        {
            body.velocity.y = 0;
        }
        else
        {
            body.velocity.y = -body.velocity.y * body.bounce.y;
        }

    }

};

//  Merge this with the Arcade Physics prototype
Phaser.Utils.mixinPrototype(Phaser.Physics.Arcade.prototype, Phaser.Physics.Arcade.TilemapCollision.prototype);
