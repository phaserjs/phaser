/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Phaser.Create class is a collection of smaller helper methods that allow you to generate game content
* quickly and easily, without the need for any external files. You can create textures for sprites and in
* coming releases we'll add dynamic sound effect generation support as well (like sfxr).
*
* Access this via `Game.create` (`this.game.create` from within a State object)
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

    /**
    * @property {Phaser.BitmapData} bmd - The internal BitmapData Create uses to generate textures from.
    */
    this.bmd = null;

    /**
    * @property {HTMLCanvasElement} canvas - The canvas the BitmapData uses.
    */
    this.canvas = null;

    /**
    * @property {CanvasRenderingContext2D} context - The 2d context of the canvas.
    */
    this.ctx = null;

    /**
    * @property {array} palettes - A range of 16 color palettes for use with sprite generation.
    */
    this.palettes = [
        { 0: '#000', 1: '#9D9D9D', 2: '#FFF', 3: '#BE2633', 4: '#E06F8B', 5: '#493C2B', 6: '#A46422', 7: '#EB8931', 8: '#F7E26B', 9: '#2F484E', A: '#44891A', B: '#A3CE27', C: '#1B2632', D: '#005784', E: '#31A2F2', F: '#B2DCEF' },
        { 0: '#000', 1: '#191028', 2: '#46af45', 3: '#a1d685', 4: '#453e78', 5: '#7664fe', 6: '#833129', 7: '#9ec2e8', 8: '#dc534b', 9: '#e18d79', A: '#d6b97b', B: '#e9d8a1', C: '#216c4b', D: '#d365c8', E: '#afaab9', F: '#f5f4eb' },
        { 0: '#000', 1: '#2234d1', 2: '#0c7e45', 3: '#44aacc', 4: '#8a3622', 5: '#5c2e78', 6: '#aa5c3d', 7: '#b5b5b5', 8: '#5e606e', 9: '#4c81fb', A: '#6cd947', B: '#7be2f9', C: '#eb8a60', D: '#e23d69', E: '#ffd93f', F: '#fff' },
        { 0: '#000', 1: '#fff', 2: '#8b4131', 3: '#7bbdc5', 4: '#8b41ac', 5: '#6aac41', 6: '#3931a4', 7: '#d5de73', 8: '#945a20', 9: '#5a4100', A: '#bd736a', B: '#525252', C: '#838383', D: '#acee8b', E: '#7b73de', F: '#acacac' },
        { 0: '#000', 1: '#191028', 2: '#46af45', 3: '#a1d685', 4: '#453e78', 5: '#7664fe', 6: '#833129', 7: '#9ec2e8', 8: '#dc534b', 9: '#e18d79', A: '#d6b97b', B: '#e9d8a1', C: '#216c4b', D: '#d365c8', E: '#afaab9', F: '#fff' }
    ];

};

/**
* A 16 color palette by [Arne](http://androidarts.com/palette/16pal.htm)
* @constant
* @type {number}
*/
Phaser.Create.PALETTE_ARNE = 0;

/**
* A 16 color JMP inspired palette.
* @constant
* @type {number}
*/
Phaser.Create.PALETTE_JMP = 1;

/**
* A 16 color CGA inspired palette.
* @constant
* @type {number}
*/
Phaser.Create.PALETTE_CGA = 2;

/**
* A 16 color C64 inspired palette.
* @constant
* @type {number}
*/
Phaser.Create.PALETTE_C64 = 3;

/**
* A 16 color palette inspired by Japanese computers like the MSX.
* @constant
* @type {number}
*/
Phaser.Create.PALETTE_JAPANESE_MACHINE = 4;

Phaser.Create.prototype = {

    /**
     * Generates a new PIXI.Texture from the given data, which can be applied to a Sprite.
     *
     * This allows you to create game graphics quickly and easily, with no external files but that use actual proper images
     * rather than Phaser.Graphics objects, which are expensive to render and limited in scope.
     *
     * Each element of the array is a string holding the pixel color values, as mapped to one of the Phaser.Create PALETTE consts.
     *
     * For example:
     *
     * `var data = [
     *   ' 333 ',
     *   ' 777 ',
     *   'E333E',
     *   ' 333 ',
     *   ' 3 3 '
     * ];`
     *
     * `game.create.texture('bob', data);`
     *
     * The above will create a new texture called `bob`, which will look like a little man wearing a hat. You can then use it
     * for sprites the same way you use any other texture: `game.add.sprite(0, 0, 'bob');`
     *
     * @method Phaser.Create#texture
     * @param {string} key - The key used to store this texture in the Phaser Cache.
     * @param {array} data - An array of pixel data.
     * @param {integer} [pixelWidth=8] - The width of each pixel.
     * @param {integer} [pixelHeight=8] - The height of each pixel.
     * @param {integer} [palette=0] - The palette to use when rendering the texture. One of the Phaser.Create.PALETTE consts.
     * @return {PIXI.Texture} The newly generated texture.
     */
    texture: function (key, data, pixelWidth, pixelHeight, palette) {

        if (pixelWidth === undefined) { pixelWidth = 8; }
        if (pixelHeight === undefined) { pixelHeight = pixelWidth; }
        if (palette === undefined) { palette = 0; }

        var w = data[0].length * pixelWidth;
        var h = data.length * pixelHeight;

        //  No bmd? Let's make one
        if (this.bmd === null)
        {
            this.bmd = this.game.make.bitmapData();
            this.canvas = this.bmd.canvas;
            this.ctx = this.bmd.context;
        }

        this.bmd.resize(w, h);
        this.bmd.clear();

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

    /**
     * Creates a grid texture based on the given dimensions.
     *
     * @method Phaser.Create#grid
     * @param {string} key - The key used to store this texture in the Phaser Cache.
     * @param {integer} width - The width of the grid in pixels.
     * @param {integer} height - The height of the grid in pixels.
     * @param {integer} cellWidth - The width of the grid cells in pixels.
     * @param {integer} cellHeight - The height of the grid cells in pixels.
     * @param {string} color - The color to draw the grid lines in. Should be a Canvas supported color string like `#ff5500` or `rgba(200,50,3,0.5)`.
     * @return {PIXI.Texture} The newly generated texture.
     */
    grid: function (key, width, height, cellWidth, cellHeight, color) {

        //  No bmd? Let's make one
        if (this.bmd === null)
        {
            this.bmd = this.game.make.bitmapData();
            this.canvas = this.bmd.canvas;
            this.ctx = this.bmd.context;
        }

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
