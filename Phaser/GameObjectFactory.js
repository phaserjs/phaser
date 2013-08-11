/// <reference path="Game.ts" />
/**
* Phaser - GameObjectFactory
*
* A quick way to create new world objects and add existing objects to the current world.
*/
var Phaser;
(function (Phaser) {
    var GameObjectFactory = (function () {
        /**
        * GameObjectFactory constructor
        * @param game {Game} A reference to the current Game.
        */
        function GameObjectFactory(game) {
            this._game = game;
            this._world = this._game.world;
        }
        GameObjectFactory.prototype.camera = /**
        * Create a new camera with specific position and size.
        *
        * @param x {number} X position of the new camera.
        * @param y {number} Y position of the new camera.
        * @param width {number} Width of the new camera.
        * @param height {number} Height of the new camera.
        * @returns {Camera} The newly created camera object.
        */
        function (x, y, width, height) {
            return this._world.createCamera(x, y, width, height);
        };
        GameObjectFactory.prototype.geomSprite = /**
        * Create a new GeomSprite with specific position.
        *
        * @param x {number} X position of the new geom sprite.
        * @param y {number} Y position of the new geom sprite.
        * @returns {GeomSprite} The newly created geom sprite object.
        */
        function (x, y) {
            return this._world.createGeomSprite(x, y);
        };
        GameObjectFactory.prototype.sprite = /**
        * Create a new Sprite with specific position and sprite sheet key.
        *
        * @param x {number} X position of the new sprite.
        * @param y {number} Y position of the new sprite.
        * @param key {string} Optional, key for the sprite sheet you want it to use.
        * @returns {Sprite} The newly created sprite object.
        */
        function (x, y, key) {
            if (typeof key === "undefined") { key = ''; }
            return this._world.createSprite(x, y, key);
        };
        GameObjectFactory.prototype.dynamicTexture = /**
        * Create a new DynamicTexture with specific size.
        *
        * @param width {number} Width of the texture.
        * @param height {number} Height of the texture.
        * @returns {DynamicTexture} The newly created dynamic texture object.
        */
        function (width, height) {
            return this._world.createDynamicTexture(width, height);
        };
        GameObjectFactory.prototype.group = /**
        * Create a new object container.
        *
        * @param maxSize {number} Optional, capacity of this group.
        * @returns {Group} The newly created group.
        */
        function (maxSize) {
            if (typeof maxSize === "undefined") { maxSize = 0; }
            return this._world.createGroup(maxSize);
        };
        GameObjectFactory.prototype.particle = /**
        * Create a new Particle.
        *
        * @return {Particle} The newly created particle object.
        */
        function () {
            return this._world.createParticle();
        };
        GameObjectFactory.prototype.emitter = /**
        * Create a new Emitter.
        *
        * @param x {number} Optional, x position of the emitter.
        * @param y {number} Optional, y position of the emitter.
        * @param size {number} Optional, size of this emitter.
        * @return {Emitter} The newly created emitter object.
        */
        function (x, y, size) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof size === "undefined") { size = 0; }
            return this._world.createEmitter(x, y, size);
        };
        GameObjectFactory.prototype.scrollZone = /**
        * Create a new ScrollZone object with image key, position and size.
        *
        * @param key {string} Key to a image you wish this object to use.
        * @param x {number} X position of this object.
        * @param y {number} Y position of this object.
        * @param width number} Width of this object.
        * @param height {number} Height of this object.
        * @returns {ScrollZone} The newly created scroll zone object.
        */
        function (key, x, y, width, height) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof width === "undefined") { width = 0; }
            if (typeof height === "undefined") { height = 0; }
            return this._world.createScrollZone(key, x, y, width, height);
        };
        GameObjectFactory.prototype.tilemap = /**
        * Create a new Tilemap.
        *
        * @param key {string} Key for tileset image.
        * @param mapData {string} Data of this tilemap.
        * @param format {number} Format of map data. (Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON)
        * @param [resizeWorld] {boolean} resize the world to make same as tilemap?
        * @param [tileWidth] {number} width of each tile.
        * @param [tileHeight] {number} height of each tile.
        * @return {Tilemap} The newly created tilemap object.
        */
        function (key, mapData, format, resizeWorld, tileWidth, tileHeight) {
            if (typeof resizeWorld === "undefined") { resizeWorld = true; }
            if (typeof tileWidth === "undefined") { tileWidth = 0; }
            if (typeof tileHeight === "undefined") { tileHeight = 0; }
            return this._world.createTilemap(key, mapData, format, resizeWorld, tileWidth, tileHeight);
        };
        GameObjectFactory.prototype.tween = /**
        * Create a tween object for a specific object.
        *
        * @param obj Object you wish the tween will affect.
        * @return {Phaser.Tween} The newly created tween object.
        */
        function (obj) {
            return this._game.tweens.create(obj);
        };
        GameObjectFactory.prototype.existingSprite = /**
        * Add an existing Sprite to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param sprite The Sprite to add to the Game World
        * @return {Phaser.Sprite} The Sprite object
        */
        function (sprite) {
            return this._world.group.add(sprite);
        };
        GameObjectFactory.prototype.existingGeomSprite = /**
        * Add an existing GeomSprite to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param sprite The GeomSprite to add to the Game World
        * @return {Phaser.GeomSprite} The GeomSprite object
        */
        function (sprite) {
            return this._world.group.add(sprite);
        };
        GameObjectFactory.prototype.existingEmitter = /**
        * Add an existing Emitter to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param emitter The Emitter to add to the Game World
        * @return {Phaser.Emitter} The Emitter object
        */
        function (emitter) {
            return this._world.group.add(emitter);
        };
        GameObjectFactory.prototype.existingScrollZone = /**
        * Add an existing ScrollZone to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param scrollZone The ScrollZone to add to the Game World
        * @return {Phaser.ScrollZone} The ScrollZone object
        */
        function (scrollZone) {
            return this._world.group.add(scrollZone);
        };
        GameObjectFactory.prototype.existingTilemap = /**
        * Add an existing Tilemap to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param tilemap The Tilemap to add to the Game World
        * @return {Phaser.Tilemap} The Tilemap object
        */
        function (tilemap) {
            return this._world.group.add(tilemap);
        };
        GameObjectFactory.prototype.existingTween = /**
        * Add an existing Tween to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param tween The Tween to add to the Game World
        * @return {Phaser.Tween} The Tween object
        */
        function (tween) {
            return this._game.tweens.add(tween);
        };
        return GameObjectFactory;
    })();
    Phaser.GameObjectFactory = GameObjectFactory;    
})(Phaser || (Phaser = {}));
