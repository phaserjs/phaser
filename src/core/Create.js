/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
*
* TODO: Gradient generator
* TODO: Look at bsfxr for audio gen
* TODO: Dither support
*
* @class Phaser.Create
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
 */
Phaser.Create = function (game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    this.bmd = game.make.bitmapData();

    this.canvas = this.bmd.canvas;
    this.ctx = this.bmd.context;

    // http://androidarts.com/palette/16pal.htm

    this.palettes = {
        'arne': { 0: '#000000', 1: '#9D9D9D', 2: '#FFFFFF', 3: '#BE2633', 4: '#E06F8B', 5: '#493C2B', 6: '#A46422', 7: '#EB8931', 8: '#F7E26B', 9: '#2F484E', A: '#44891A', B: '#A3CE27', C: '#1B2632', D: '#005784', E: '#31A2F2', F: '#B2DCEF' },
        'jmp': { 0: '#000000', 1: '#191028', 2: '#46af45', 3: '#a1d685', 4: '#453e78', 5: '#7664fe', 6: '#833129', 7: '#9ec2e8', 8: '#dc534b', 9: '#e18d79', A: '#d6b97b', B: '#e9d8a1', C: '#216c4b', D: '#d365c8', E: '#afaab9', F: '#f5f4eb' },
        'cga': { 0: '#000000', 1: '#2234d1', 2: '#0c7e45', 3: '#44aacc', 4: '#8a3622', 5: '#5c2e78', 6: '#aa5c3d', 7: '#b5b5b5', 8: '#5e606e', 9: '#4c81fb', A: '#6cd947', B: '#7be2f9', C: '#eb8a60', D: '#e23d69', E: '#ffd93f', F: '#fffff' }
    };

};

Phaser.Create.prototype = {

    texture: function (key, data, pixelWidth, pixelHeight, palette) {

        if (typeof pixelWidth === 'undefined') { pixelWidth = 8; }
        if (typeof pixelHeight === 'undefined') { pixelHeight = 8; }
        if (typeof palette === 'undefined') { palette = 'arne'; }

        var w = data[0].length * pixelWidth;
        var h = data.length * pixelHeight;

        this.bmd.resize(w, h);

        //  Draw it
        for (var y = 0; y < data.length; y++)
        {
            var row = data[y];

            for (var x = 0; x < row.length; x++)
            {
                var d = row[x];

                if (d !== '.' && d !== ' ')
                {
                    this.ctx.fillStyle = this.palettes[palette][d];
                    this.ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight);
                }
            }
        }

        return this.bmd.generateTexture(key);

    },

    grid: function (key, width, height, cellWidth, cellHeight, color) {

        this.bmd.resize(width, height);

        this.ctx.fillStyle = color;

        for (var y = 0; y < height; y += cellHeight)
        {
            this.ctx.fillRect(0, y, width, 1);
        }

        for (var x = 0; x < width; x += cellWidth)
        {
            this.ctx.fillRect(x, 0, 1, height);
        }

        return this.bmd.generateTexture(key);

    }

};

Phaser.Create.prototype.constructor = Phaser.Create;
