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

    function NineSlice (scene, sliceConfig, x, y, texture, frame)
    {
        if (x === undefined) { x = GetFastValue(sliceConfig, 'x', 0); }
        if (y === undefined) { y = GetFastValue(sliceConfig, 'y', 0); }
        if (texture === undefined) { texture = GetFastValue(sliceConfig, 'texture'); }
        if (frame === undefined) { frame = GetFastValue(sliceConfig, 'frame'); }

        GameObject.call(this, scene, 'NineSlice');

        this.setPosition(x, y);
        this.setTexture(texture, frame);

        var width = GetFastValue(sliceConfig, 'width', this.frame.width);
        var height = GetFastValue(sliceConfig, 'height', this.frame.height);
        var left = GetFastValue(sliceConfig, 'left', width / 3);
        var right = GetFastValue(sliceConfig, 'right', width / 3);

        this.setSize(width, height);

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

        this.create(left, right);

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

    create: function (left, right)
    {
        var faces = this.faces;

        var third = left / this.width;
        var vthird = 0.5 - third;
        var uvthird = left / this.frame.width;
        var uvsixth = 1 - uvthird;

        var third2 = right / this.width;
        var vthird2 = 0.5 - third2;
        var uvthird2 = right / this.frame.width;
        var uvsixth2 = 1 - uvthird2;

        var pos = [
            //  face 1
            -0.5, 0.5,
            -0.5, -0.5,
            -vthird, 0.5,

            //  face 2
            -0.5, -0.5,
            -vthird, -0.5,
            -vthird, 0.5,

            //  face 3
            -vthird, 0.5,
            -vthird, -0.5,
            vthird, 0.5,

            //  face 4
            -vthird, -0.5,
            vthird, -0.5,
            vthird, 0.5,

            //  face 5
            vthird2, 0.5,
            vthird2, -0.5,
            0.5, 0.5,

            //  face 6
            vthird2, -0.5,
            0.5, -0.5,
            0.5, 0.5
        ];

        var uv = [
            //  face 1
            0, 0,
            0, 1,
            uvthird, 0,

            //  face 2
            0, 1,
            uvthird, 1,
            uvthird, 0,

            //  face 3
            uvthird, 0,
            uvthird, 1,
            uvsixth, 0,

            //  face 4
            uvthird, 1,
            uvsixth, 1,
            uvsixth, 0,

            //  face 5
            uvsixth2, 0,
            uvsixth2, 1,
            1, 0,

            //  face 6
            uvsixth2, 1,
            1, 1,
            1, 0
        ];

        var c = 0;

        for (var i = 0; i < 6; i++)
        {
            var vertex1 = new Vertex(pos[c], pos[c + 1], 0, uv[c], uv[c + 1]);
            var vertex2 = new Vertex(pos[c + 2], pos[c + 3], 0, uv[c + 2], uv[c + 3]);
            var vertex3 = new Vertex(pos[c + 4], pos[c + 5], 0, uv[c + 4], uv[c + 5]);

            faces.push(new Face(vertex1, vertex2, vertex3));

            c += 6;
        }

        //  Left Faces

        //  Fixed test 50px width (from faked 600px test)
        /*
        var third = left / this.width;
        var vthird = 0.5 - third;
        var uvthird = left / this.frame.width;
        var uvsixth = 1 - uvthird;

        var vertex1 = new Vertex(-0.5, 0.5, 0, 0, 0);
        var vertex2 = new Vertex(-0.5, -0.5, 0, 0, 1);
        var vertex3 = new Vertex(-vthird, 0.5, 0, uvthird, 0);

        faces.push(new Face(vertex1, vertex2, vertex3));

        var vertex4 = new Vertex(-0.5, -0.5, 0, 0, 1);
        var vertex5 = new Vertex(-vthird, -0.5, 0, uvthird, 1);
        var vertex6 = new Vertex(-vthird, 0.5, 0, uvthird, 0);

        faces.push(new Face(vertex4, vertex5, vertex6));

        //  Center Faces

        var vertex13 = new Vertex(-vthird, 0.5, 0, uvthird, 0);
        var vertex14 = new Vertex(-vthird, -0.5, 0, uvthird, 1);
        var vertex15 = new Vertex(vthird, 0.5, 0, uvsixth, 0);

        faces.push(new Face(vertex13, vertex14, vertex15));

        var vertex16 = new Vertex(-vthird, -0.5, 0, uvthird, 1);
        var vertex17 = new Vertex(vthird, -0.5, 0, uvsixth, 1);
        var vertex18 = new Vertex(vthird, 0.5, 0, uvsixth, 0);

        faces.push(new Face(vertex16, vertex17, vertex18));

        //  Right Faces

        var third2 = right / this.width;
        var vthird2 = 0.5 - third2;
        var uvthird2 = right / this.frame.width;
        var uvsixth2 = 1 - uvthird2;

        var vertex7 = new Vertex(vthird2, 0.5, 0, uvsixth2, 0);
        var vertex8 = new Vertex(vthird2, -0.5, 0, uvsixth2, 1);
        var vertex9 = new Vertex(0.5, 0.5, 0, 1, 0);

        faces.push(new Face(vertex7, vertex8, vertex9));

        var vertex10 = new Vertex(vthird2, -0.5, 0, uvsixth2, 1);
        var vertex11 = new Vertex(0.5, -0.5, 0, 1, 1);
        var vertex12 = new Vertex(0.5, 0.5, 0, 1, 0);

        faces.push(new Face(vertex10, vertex11, vertex12));
        */
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
