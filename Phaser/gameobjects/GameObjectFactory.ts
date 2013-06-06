/// <reference path="../Game.ts" />
/// <reference path="../tweens/Tween.ts" />
/// <reference path="../gameobjects/Emitter.ts" />
/// <reference path="../gameobjects/Particle.ts" />
/// <reference path="../gameobjects/Sprite.ts" />
/// <reference path="../gameobjects/ScrollZone.ts" />
/// <reference path="../gameobjects/DynamicTexture.ts" />
/// <reference path="../gameobjects/Tilemap.ts" />

/**
* Phaser - GameObjectFactory
*
* A quick way to create new world objects and add existing objects to the current world.
*/

module Phaser {

    export class GameObjectFactory {

        /**
         * GameObjectFactory constructor
         * @param game {Game} A reference to the current Game.
         */
        constructor(game: Phaser.Game) {

            this._game = game;
            this._world = this._game.world;

        }

        /**
         * Local private reference to Game
         */
        private _game: Phaser.Game;

        /**
         * Local private reference to World
         */
        private _world: Phaser.World;

        /**
         * Create a new camera with specific position and size.
         *
         * @param x {number} X position of the new camera.
         * @param y {number} Y position of the new camera.
         * @param width {number} Width of the new camera.
         * @param height {number} Height of the new camera.
         * @returns {Camera} The newly created camera object.
         */
        public camera(x: number, y: number, width: number, height: number): Camera {
            return this._world.cameras.addCamera(x, y, width, height);
        }

        /**
         * Create a new GeomSprite with specific position.
         *
         * @param x {number} X position of the new geom sprite.
         * @param y {number} Y position of the new geom sprite.
         * @returns {GeomSprite} The newly created geom sprite object.
         */
        //public geomSprite(x: number, y: number): GeomSprite {
        //    return <GeomSprite> this._world.group.add(new GeomSprite(this._game, x, y));
        //}

        /**
         * Create a new Sprite with specific position and sprite sheet key.
         *
         * @param x {number} X position of the new sprite.
         * @param y {number} Y position of the new sprite.
         * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
         * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
         * @param [bodyType] {number} The physics body type of the object (defaults to BODY_DISABLED)
         * @returns {Sprite} The newly created sprite object.
         */
        public sprite(x: number, y: number, key?: string = '', frame? = null, bodyType?: number = Phaser.Types.BODY_DISABLED): Sprite {
            return <Sprite> this._world.group.add(new Sprite(this._game, x, y, key, frame, bodyType));
        }

        /**
         * Create a new DynamicTexture with specific size.
         *
         * @param width {number} Width of the texture.
         * @param height {number} Height of the texture.
         * @returns {DynamicTexture} The newly created dynamic texture object.
         */
        public dynamicTexture(width: number, height: number): DynamicTexture {
            return new DynamicTexture(this._game, width, height);
        }

        /**
         * Create a new object container.
         *
         * @param maxSize {number} Optional, capacity of this group.
         * @returns {Group} The newly created group.
         */
        public group(maxSize?: number = 0): Group {
            return <Group> this._world.group.add(new Group(this._game, maxSize));
        }


        /**
         * Create a new Particle.
         *
         * @return {Particle} The newly created particle object.
         */
        public particle(): Particle {
            return new Particle(this._game);
        }

        /**
         * Create a new Emitter.
         *
         * @param x {number} Optional, x position of the emitter.
         * @param y {number} Optional, y position of the emitter.
         * @param size {number} Optional, size of this emitter.
         * @return {Emitter} The newly created emitter object.
         */
        public emitter(x?: number = 0, y?: number = 0, size?: number = 0): Emitter {
            return <Emitter> this._world.group.add(new Emitter(this._game, x, y, size));
        }

        /**
         * Create a new ScrollZone object with image key, position and size.
         *
         * @param key {string} Key to a image you wish this object to use.
         * @param x {number} X position of this object.
         * @param y {number} Y position of this object.
         * @param width number} Width of this object.
         * @param height {number} Height of this object.
         * @returns {ScrollZone} The newly created scroll zone object.
         */
        public scrollZone(key: string, x?: number = 0, y?: number = 0, width?: number = 0, height?: number = 0): ScrollZone {
            return <ScrollZone> this._world.group.add(new ScrollZone(this._game, key, x, y, width, height));
        }

        /**
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
        public tilemap(key: string, mapData: string, format: number, resizeWorld: bool = true, tileWidth?: number = 0, tileHeight?: number = 0): Tilemap {
            return <Tilemap> this._world.group.add(new Tilemap(this._game, key, mapData, format, resizeWorld, tileWidth, tileHeight));
        }

        /**
         * Create a tween object for a specific object.
         *
         * @param obj Object you wish the tween will affect.
         * @return {Phaser.Tween} The newly created tween object.
         */
        public tween(obj): Tween {
            return this._game.tweens.create(obj);
        }

        /**
         * Add an existing Sprite to the current world.
         * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
         *
         * @param sprite The Sprite to add to the Game World
         * @return {Phaser.Sprite} The Sprite object
         */
        public existingSprite(sprite: Sprite): Sprite {
            return this._world.group.add(sprite);
        }

        /**
         * Add an existing GeomSprite to the current world.
         * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
         *
         * @param sprite The GeomSprite to add to the Game World
         * @return {Phaser.GeomSprite} The GeomSprite object
         */
        //public existingGeomSprite(sprite: GeomSprite): GeomSprite {
        //    return this._world.group.add(sprite);
        //}

        /**
         * Add an existing Emitter to the current world.
         * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
         *
         * @param emitter The Emitter to add to the Game World
         * @return {Phaser.Emitter} The Emitter object
         */
        public existingEmitter(emitter: Emitter): Emitter {
            return this._world.group.add(emitter);
        }

        /**
         * Add an existing ScrollZone to the current world.
         * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
         *
         * @param scrollZone The ScrollZone to add to the Game World
         * @return {Phaser.ScrollZone} The ScrollZone object
         */
        public existingScrollZone(scrollZone: ScrollZone): ScrollZone {
            return this._world.group.add(scrollZone);
        }

        /**
         * Add an existing Tilemap to the current world.
         * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
         *
         * @param tilemap The Tilemap to add to the Game World
         * @return {Phaser.Tilemap} The Tilemap object
         */
        public existingTilemap(tilemap: Tilemap): Tilemap {
            return this._world.group.add(tilemap);
        }

        /**
         * Add an existing Tween to the current world.
         * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
         *
         * @param tween The Tween to add to the Game World
         * @return {Phaser.Tween} The Tween object
         */
        public existingTween(tween: Tween): Tween {
            return this._game.tweens.add(tween);
        }

    }

}
