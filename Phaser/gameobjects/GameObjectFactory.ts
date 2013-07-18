/// <reference path="../Game.ts" />
/// <reference path="../tweens/Tween.ts" />
/// <reference path="../gameobjects/Emitter.ts" />
/// <reference path="../gameobjects/Particle.ts" />
/// <reference path="../gameobjects/Sprite.ts" />
/// <reference path="../gameobjects/Button.ts" />
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
         * Create a new Button game object.
         *
         * @param [x] {number} X position of the button.
         * @param [y] {number} Y position of the button.
         * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this button.
         * @param [callback] {function} The function to call when this button is pressed
         * @param [callbackContext] {object} The context in which the callback will be called (usually 'this')
         * @param [overFrame] {string|number} This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
         * @param [outFrame] {string|number} This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
         * @param [downFrame] {string|number} This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
         * @returns {Button} The newly created button object.
         */
        public button(x?: number = 0, y?: number = 0, key?: string = null, callback? = null, callbackContext? = null, overFrame? = null, outFrame? = null, downFrame? = null): Button {
            return <Button> this._world.group.add(new Button(this._game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame));
        }

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

        public audio(key: string, volume?: number = 1, loop?: bool = false) {
            return <Sound> this._game.sound.add(key, volume, loop);
        }

        /**
         * Create a new Sprite with the physics automatically created and set to DYNAMIC. The Sprite position offset is set to its center.
         *
         * @param x {number} X position of the new sprite.
         * @param y {number} Y position of the new sprite.
         * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
         * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
         * @param [bodyType] {number} The physics body type of the object (defaults to BODY_DYNAMIC)
         * @param [shapeType] The default body shape is either 0 for a Box or 1 for a Circle. See Sprite.body.addShape for custom shapes (polygons, etc)
         * @returns {Sprite} The newly created sprite object.
         */
        public physicsSprite(x: number, y: number, key?: string = '', frame? = null, bodyType?: number = Phaser.Types.BODY_DYNAMIC, shapeType?:number = 0): Sprite {
            return <Sprite> this._world.group.add(new Sprite(this._game, x, y, key, frame, bodyType, shapeType));
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
         * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
         *
         * @param obj {object} Object the tween will be run on.
         * @param [localReference] {bool} If true the tween will be stored in the object.tween property so long as it exists. If already set it'll be over-written.
         * @return {Phaser.Tween} The newly created tween object.
         */
        public tween(obj, localReference?:bool = false): Tween {
            return this._game.tweens.create(obj, localReference);
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
         * Add an existing Button to the current world.
         * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
         *
         * @param button The Button to add to the Game World
         * @return {Phaser.Button} The Button object
         */
        public existingButton(button: Button): Button {
            return this._world.group.add(button);
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
