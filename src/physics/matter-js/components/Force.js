/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Body = require('../lib/body/Body');

/**
 * [description]
 *
 * @name Phaser.Physics.Matter.Components.Force
 * @since 3.0.0
 */
var Force = {

    //  force = vec2 / point
    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#applyForce
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} force - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    applyForce: function (force)
    {
        this._tempVec2.set(this.body.position.x, this.body.position.y);

        Body.applyForce(this.body, this._tempVec2, force);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#applyForceFrom
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} position - [description]
     * @param {Phaser.Math.Vector2} force - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    applyForceFrom: function (position, force)
    {
        Body.applyForce(this.body, position, force);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#thrust
     * @since 3.0.0
     *
     * @param {number} speed - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    thrust: function (speed)
    {
        var angle = this.body.angle;

        this._tempVec2.set(speed * Math.cos(angle), speed * Math.sin(angle));

        Body.applyForce(this.body, { x: this.body.position.x, y: this.body.position.y }, this._tempVec2);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#thrustLeft
     * @since 3.0.0
     *
     * @param {number} speed - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    thrustLeft: function (speed)
    {
        var angle = this.body.angle - Math.PI / 2;

        this._tempVec2.set(speed * Math.cos(angle), speed * Math.sin(angle));

        Body.applyForce(this.body, { x: this.body.position.x, y: this.body.position.y }, this._tempVec2);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#thrustRight
     * @since 3.0.0
     *
     * @param {number} speed - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    thrustRight: function (speed)
    {
        var angle = this.body.angle + Math.PI / 2;

        this._tempVec2.set(speed * Math.cos(angle), speed * Math.sin(angle));

        Body.applyForce(this.body, { x: this.body.position.x, y: this.body.position.y }, this._tempVec2);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.Components.Force#thrustBack
     * @since 3.0.0
     *
     * @param {number} speed - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    thrustBack: function (speed)
    {
        var angle = this.body.angle - Math.PI;

        this._tempVec2.set(speed * Math.cos(angle), speed * Math.sin(angle));

        Body.applyForce(this.body, { x: this.body.position.x, y: this.body.position.y }, this._tempVec2);

        return this;
    }

};

module.exports = Force;
