/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Destroy component is responsible for destroying a Game Object.
*
* @class
*/
Phaser.Component.Destroy = function () {};

Phaser.Component.Destroy.prototype = {

    /**
    * As a Game Object runs through its destroy method this flag is set to true, 
    * and can be checked in any sub-systems or plugins it is being destroyed from.
    * @property {boolean} destroyPhase
    * @readOnly
    */
    destroyPhase: false,

    /**
    * Destroys the Game Object. This removes it from its parent group, destroys the input, event and animation handlers if present
    * and nulls its reference to `game`, freeing it up for garbage collection.
    * 
    * If this Game Object has the Events component it will also dispatch the `onDestroy` event.
    *
    * You can optionally also destroy the BaseTexture this Game Object is using. Be careful if you've
    * more than one Game Object sharing the same BaseTexture.
    *
    * @method
    * @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called as well?
    * @param {boolean} [destroyTexture=false] - Destroy the BaseTexture this Game Object is using? Note that if another Game Object is sharing the same BaseTexture it will invalidate it.
    */
    destroy: function (destroyChildren, destroyTexture) {

        if (this.game === null || this.destroyPhase) { return; }

        if (destroyChildren === undefined) { destroyChildren = true; }
        if (destroyTexture === undefined) { destroyTexture = false; }

        this.destroyPhase = true;

        if (this.events)
        {
            this.events.onDestroy$dispatch(this);
        }

        if (this.parent)
        {
            if (this.parent instanceof Phaser.Group)
            {
                this.parent.remove(this);
            }
            else
            {
                this.parent.removeChild(this);
            }
        }

        if (this.input)
        {
            this.input.destroy();
        }

        if (this.animations)
        {
            this.animations.destroy();
        }

        if (this.body)
        {
            this.body.destroy();
        }

        if (this.events)
        {
            this.events.destroy();
        }

        this.game.tweens.removeFrom(this);

        var i = this.children.length;

        if (destroyChildren)
        {
            while (i--)
            {
                this.children[i].destroy(destroyChildren);
            }
        }
        else
        {
            while (i--)
            {
                this.removeChild(this.children[i]);
            }
        }

        if (this._crop)
        {
            this._crop = null;
        }

        if (this._frame)
        {
            this._frame = null;
        }

        if (Phaser.Video && this.key instanceof Phaser.Video)
        {
            this.key.onChangeSource.remove(this.resizeFrame, this);
        }

        if (Phaser.BitmapText && this._glyphs)
        {
            this._glyphs = [];
        }

        this.alive = false;
        this.exists = false;
        this.visible = false;

        this.filters = null;
        this.mask = null;
        this.game = null;

        //  In case Pixi is still going to try and render it even though destroyed
        this.renderable = false;

        if (this.transformCallback)
        {
            this.transformCallback = null;
            this.transformCallbackContext = null;
        }

        //  Pixi level DisplayObject destroy
        this.hitArea = null;
        this.parent = null;
        this.stage = null;
        this.worldTransform = null;
        this.filterArea = null;
        this._bounds = null;
        this._currentBounds = null;
        this._mask = null;

        this._destroyCachedSprite();

        //  Texture?
        if (destroyTexture)
        {
            this.texture.destroy(true);
        }

        this.destroyPhase = false;
        this.pendingDestroy = false;

    }

};
