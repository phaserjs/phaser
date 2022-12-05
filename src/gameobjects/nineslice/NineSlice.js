/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var GameObject = require('../GameObject');
var Components = require('../components');
var Face = require('../../geom/mesh/Face');
var GenerateGridVerts = require('../../geom/mesh/GenerateGridVerts');
var NineSliceRender = require('./NineSliceRender');
var Matrix4 = require('../../math/Matrix4');
var Vector3 = require('../../math/Vector3');
var DegToRad = require('../../math/DegToRad');
var Vertex = require('../../geom/mesh/Vertex');

/**
 * @classdesc
 * TODO
 *
 * @class NineSlice
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.60.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var NineSlice = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        NineSliceRender
    ],

    initialize:

    function NineSlice (scene, x, y, texture, frame)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        GameObject.call(this, scene, 'NineSlice');

        this.setPosition(x, y);
        this.setTexture(texture, frame);
        this.setSize(600, 128);

        // this.setSizeToFrame();

        this.faces = [];
        this.tintFill = false;

        /*
        this.dirtyCache = [];
        this.dirtyCache[11] = false;
        this.vertices = [];

        var result = GenerateGridVerts({
            mesh: this,
            widthSegments: 3,
            heightSegments: 1
        });
        */

        this.create();

        for (var i = 0; i < this.faces.length; i++)
        {
            this.faces[i].transformIdentity(this.width, this.height);
        }

        console.log(this);

        this.initPipeline();
    },


    //  Overrides Game Object method
    addedToScene: function ()
    {
        // this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        // this.scene.sys.updateList.remove(this);
    },

    create: function ()
    {
        var faces = this.faces;

        // var vertex1;
        // var vertex2;
        // var vertex3;

        // var width = this.width;
        // var height = this.height;

        // var x;
        // var y;
        // var u;
        // var v;

        //  Odd Vertex:

        //  1 ---. 3
        //    | /
        //  2 |/

        //  Even Vertex:

        //      /| 3
        //     / |
        //  1 .--- 1

        //  Left Faces

        var third = 1 / 3;
        var vthird = third / 2;
        var sixth = third * 2;

        var vertex1 = new Vertex(-0.5, 0.5, 0, 0, 0);
        var vertex2 = new Vertex(-0.5, -0.5, 0, 0, 1);
        var vertex3 = new Vertex(-vthird, 0.5, 0, third, 0);

        faces.push(new Face(vertex1, vertex2, vertex3));

        var vertex4 = new Vertex(-0.5, -0.5, 0, 0, 1);
        var vertex5 = new Vertex(-vthird, -0.5, 0, third, 1);
        var vertex6 = new Vertex(-vthird, 0.5, 0, third, 0);

        faces.push(new Face(vertex4, vertex5, vertex6));

        //  Right Faces

        var vertex7 = new Vertex(vthird, 0.5, 0, sixth, 0);
        var vertex8 = new Vertex(vthird, -0.5, 0, sixth, 1);
        var vertex9 = new Vertex(0.5, 0.5, 0, 1, 0);

        faces.push(new Face(vertex7, vertex8, vertex9));

        var vertex10 = new Vertex(vthird, -0.5, 0, sixth, 1);
        var vertex11 = new Vertex(0.5, -0.5, 0, 1, 1);
        var vertex12 = new Vertex(0.5, 0.5, 0, 1, 0);

        faces.push(new Face(vertex10, vertex11, vertex12));
    },

    /*
    create: function (slices)
    {
        var x = 0;
        var y = 0;
        var width = this.width;
        var height = this.height;
        var alpha = 1;
        var tint = 0xffffff;

        var textureManager = this.textureManager;

        var topLeft = textureManager.parseFrame(GetFastValue(slices, 'topLeft', null));
        var topBg = textureManager.parseFrame(GetFastValue(slices, 'topBackground', null));
        var topRight = textureManager.parseFrame(GetFastValue(slices, 'topRight', null));
        var leftBg = textureManager.parseFrame(GetFastValue(slices, 'left', null));
        var rightBg = textureManager.parseFrame(GetFastValue(slices, 'right', null));

        // var background = textureManager.parseFrame(GetFastValue(slices, 'background', null));

        var botLeft = textureManager.parseFrame(GetFastValue(slices, 'botLeft', null));
        var botBg = textureManager.parseFrame(GetFastValue(slices, 'botBackground', null));
        var botRight = textureManager.parseFrame(GetFastValue(slices, 'botRight', null));

        var topLeftPos = { x: x, y: y };
        var topRightPos = { x: x + width, y: y };
        var topPos = { x: x, y: y, w: width };
        var botLeftPos = { x: x, y: y + height };
        var botRightPos = { x: x + width, y: y + height };
        var botPos = { x: x, y: y + height, w: width };
        var leftPos = { x: x, y: y, h: height };
        var rightPos = { x: x + width, y: y, h: height };

        if (topLeft)
        {
            topPos.x += topLeft.width;
            topPos.w -= topLeft.width;
            leftPos.y += topLeft.height;
            leftPos.h -= topLeft.height;
        }

        if (topRight)
        {
            topRightPos.x -= topRight.width;
            topPos.w -= topRight.width;
            rightPos.y += topRight.height;
            rightPos.h -= topRight.height;
        }

        if (botBg)
        {
            botPos.y -= botBg.height;
        }

        if (botLeft)
        {
            botLeftPos.y -= botLeft.height;
            botPos.x += botLeft.width;
            botPos.w -= botLeft.width;
            leftPos.h -= botLeft.height;
        }

        if (botRight)
        {
            botRightPos.x -= botRight.width;
            botRightPos.y -= botRight.height;
            botPos.w -= botRight.width;
            rightPos.h -= botRight.height;
        }

        if (rightBg)
        {
            rightPos.x -= rightBg.width;
        }

        // console.log('topLeftPos', topLeftPos);
        // console.log('topRightPos', topRightPos);
        // console.log('topPos', topPos);
        // console.log('botLeftPos', botLeftPos);
        // console.log('botRightPos', botRightPos);
        // console.log('botPos', botPos);
        // console.log('leftPos', leftPos);
        // console.log('rightPos', rightPos);

        var stamp = this.resetStamp(alpha, tint);

        this.clear();

        this.beginDraw();

        //  None of these need cropping:

        if (topLeft)
        {
            stamp.setFrame(topLeft);

            this.drawGameObject(stamp, topLeftPos.x, topLeftPos.y);
        }

        if (topRight)
        {
            stamp.setFrame(topRight);

            this.drawGameObject(stamp, topRightPos.x, topRightPos.y);
        }

        if (botLeft)
        {
            stamp.setFrame(botLeft);

            this.drawGameObject(stamp, botLeftPos.x, botLeftPos.y);
        }

        if (botRight)
        {
            stamp.setFrame(botRight);

            this.drawGameObject(stamp, botRightPos.x, botRightPos.y);
        }

        //  These all use crop if they don't fit perfectly

        if (topBg)
        {
            this.repeat(topBg, null, topPos.x, topPos.y, topPos.w, topBg.height, alpha, tint, true);
        }

        if (leftBg)
        {
            this.repeat(leftBg, null, leftPos.x, leftPos.y, leftBg.width, leftPos.h, alpha, tint, true);
        }

        if (rightBg)
        {
            this.repeat(rightBg, null, rightPos.x, rightPos.y, rightBg.width, rightPos.h, alpha, tint, true);
        }

        if (botBg)
        {
            this.repeat(botBg, null, botPos.x, botPos.y, botPos.w, botBg.height, alpha, tint, true);
        }

        this.endDraw();

        return this;
    }
    */

});

module.exports = NineSlice;
