//  Phaser.Physics.Impact.CollisionMap

var Class = require('../../utils/Class');
var DefaultDefs = require('./DefaultDefs');

var CollisionMap = new Class({

    initialize:

    function CollisionMap (tilesize, data)
    {
        this.tilesize = tilesize;

        this.data = data;

        this.width = (Array.isArray(data)) ? data[0].length : 0;
        this.height = (Array.isArray(data)) ? data.length : 0;

        this.lastSlope = 55;

        this.tiledef = DefaultDefs;
    },

    trace: function (x, y, vx, vy, objectWidth, objectHeight)
    {
        // Set up the trace-result
        var res = {
            collision: { x: false, y: false, slope: false },
            pos: { x: x, y: y },
            tile: { x: 0, y: 0 }
        };

        if (!this.data)
        {
            res.pos.x += vx;
            res.pos.y += vy;

            return res;
        }
        
        var steps = Math.ceil(Math.max(Math.abs(vx), Math.abs(vy)) / this.tilesize);

        if (steps > 1)
        {
            var sx = vx / steps;
            var sy = vy / steps;
            
            for (var i = 0; i < steps && (sx || sy); i++)
            {
                this.step(res, x, y, sx, sy, objectWidth, objectHeight, vx, vy, i);
                
                x = res.pos.x;
                y = res.pos.y;

                if (res.collision.x)
                {
                    sx = 0;
                    vx = 0;
                }

                if (res.collision.y)
                {
                    sy = 0;
                    vy = 0;
                }

                if (res.collision.slope)
                {
                    break;
                }
            }
        }
        else
        {
            this.step(res, x, y, vx, vy, objectWidth, objectHeight, vx, vy, 0);
        }
        
        return res;
    },

    step: function (res, x, y, vx, vy, width, height, rvx, rvy, step)
    {
        res.pos.x += vx;
        res.pos.y += vy;
        
        var t = 0;
        var tilesize = this.tilesize;
        var mapWidth = this.width;
        var mapHeight = this.height;
        
        //  Horizontal
        if (vx)
        {
            var pxOffsetX = (vx > 0 ? width : 0);
            var tileOffsetX = (vx < 0 ? tilesize : 0);
            
            var firstTileY = Math.max(Math.floor(y / tilesize), 0);
            var lastTileY = Math.min(Math.ceil((y + height) / tilesize), mapHeight);
            var tileX = Math.floor((res.pos.x + pxOffsetX) / tilesize);

            var prevTileX = Math.floor((x + pxOffsetX) / tilesize);

            if (step > 0 || tileX === prevTileX || prevTileX < 0 || prevTileX >= mapWidth)
            {
                prevTileX = -1;
            }
            
            if (tileX >= 0 && tileX < mapWidth)
            {
                for (var tileY = firstTileY; tileY < lastTileY; tileY++)
                {
                    if (prevTileX !== -1)
                    {
                        t = this.data[tileY][prevTileX];

                        if (t > 1 && t <= this.lastSlope && this.checkDef(res, t, x, y, rvx, rvy, width, height, prevTileX, tileY))
                        {
                            break;
                        }
                    }
                    
                    t = this.data[tileY][tileX];

                    if (t === 1 || t > this.lastSlope || (t > 1 && this.checkDef(res, t, x, y, rvx, rvy, width, height, tileX, tileY)))
                    {
                        if (t > 1 && t <= this.lastSlope && res.collision.slope)
                        {
                            break;
                        }
                        
                        res.collision.x = true;
                        res.tile.x = t;
                        res.pos.x = tileX * tilesize - pxOffsetX + tileOffsetX;
                        x = res.pos.x;
                        rvx = 0;

                        break;
                    }
                }
            }
        }
        
        //  Vertical
        if (vy)
        {
            var pxOffsetY = (vy > 0 ? height : 0);
            var tileOffsetY = (vy < 0 ? tilesize : 0);
            
            var firstTileX = Math.max(Math.floor(res.pos.x / tilesize), 0);
            var lastTileX = Math.min(Math.ceil((res.pos.x + width) / tilesize), mapWidth);
            var tileY = Math.floor((res.pos.y + pxOffsetY) / tilesize);
            
            var prevTileY = Math.floor((y + pxOffsetY) / tilesize);

            if (step > 0 || tileY === prevTileY || prevTileY < 0 || prevTileY >= mapHeight)
            {
                prevTileY = -1;
            }
            
            if (tileY >= 0 && tileY < mapHeight)
            {
                for (var tileX = firstTileX; tileX < lastTileX; tileX++)
                {
                    if (prevTileY !== -1)
                    {
                        t = this.data[prevTileY][tileX];

                        if (t > 1 && t <= this.lastSlope && this.checkDef(res, t, x, y, rvx, rvy, width, height, tileX, prevTileY))
                        {
                            break;
                        }
                    }
                    
                    t = this.data[tileY][tileX];

                    if (t === 1 || t > this.lastSlope || (t > 1 && this.checkDef(res, t, x, y, rvx, rvy, width, height, tileX, tileY)))
                    {
                        if (t > 1 && t <= this.lastSlope && res.collision.slope)
                        {
                            break;
                        }
                        
                        res.collision.y = true;
                        res.tile.y = t;
                        res.pos.y = tileY * tilesize - pxOffsetY + tileOffsetY;

                        break;
                    }
                }
            }
        }
    },
    
    checkDef: function (res, t, x, y, vx, vy, width, height, tileX, tileY)
    {
        var def = this.tiledef[t];

        if (!def)
        {
            return false;
        }

        var tilesize = this.tilesize;
        
        var lx = (tileX + def[0]) * tilesize;
        var ly = (tileY + def[1]) * tilesize;
        var lvx = (def[2] - def[0]) * tilesize;
        var lvy = (def[3] - def[1]) * tilesize;
        var solid = def[4];
        
        var tx = x + vx + (lvy < 0 ? width : 0) - lx;
        var ty = y + vy + (lvx > 0 ? height : 0) - ly;
        
        if (lvx * ty - lvy * tx > 0)
        {
            if (vx * -lvy + vy * lvx < 0)
            {
                return solid;
            }
            
            var length = Math.sqrt(lvx * lvx + lvy * lvy);
            var nx = lvy / length;
            var ny = -lvx / length;
            
            var proj = tx * nx + ty * ny;
            var px = nx * proj;
            var py = ny * proj;
            
            if (px * px + py * py >= vx * vx + vy * vy)
            {
                return solid || (lvx * (ty - vy) - lvy * (tx - vx) < 0.5);
            }
            
            res.pos.x = x + vx - px;
            res.pos.y = y + vy - py;
            res.collision.slope = { x: lvx, y: lvy, nx: nx, ny: ny };

            return true;
        }
        
        return false;
    }

});

module.exports = CollisionMap;
