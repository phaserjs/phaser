/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../../const');
var GameObject = require('../GameObject');
var ContainerWebGLRenderer = require('./ContainerWebGLRenderer');
var Children = require('../../components/Children');

var Container = function (state, parent, x, y)
{
    GameObject.call(this, state, x, y, null, null, parent);

    this.type = CONST.CONTAINER;

    this.render = ContainerWebGLRenderer;

    this.children = new Children(this);
};

Container.prototype = Object.create(GameObject.prototype);
Container.prototype.constructor = Container;

Container.prototype.preUpdate = function ()
{
    if (this.parent)
    {
        this.color.worldAlpha = this.parent.color.worldAlpha;
    }

    this.children.preUpdate();
};

module.exports = Container;
