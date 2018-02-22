/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Matrix4 = require('../../math/Matrix4');
var RandomXYZ = require('../../math/RandomXYZ');
var RandomXYZW = require('../../math/RandomXYZW');
var RotateVec3 = require('../../math/RotateVec3');
var Set = require('../../structs/Set');
var Sprite3D = require('../../gameobjects/sprite3d/Sprite3D');
var Vector2 = require('../../math/Vector2');
var Vector3 = require('../../math/Vector3');
var Vector4 = require('../../math/Vector4');

//  Local cache vars
var tmpVec3 = new Vector3();
var tmpVec4 = new Vector4();
var dirvec = new Vector3();
var rightvec = new Vector3();
var billboardMatrix = new Matrix4();

//  @author attribute https://github.com/mattdesl/cam3d/wiki

/**
 * @classdesc
 * [description]
 *
 * @class Camera
 * @memberOf Phaser.Cameras.Sprite3D
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var Camera = new Class({

    initialize:

    function Camera (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#displayList
         * @type {Phaser.GameObjects.DisplayList}
         * @since 3.0.0
         */
        this.displayList = scene.sys.displayList;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#updateList
         * @type {Phaser.GameObjects.UpdateList}
         * @since 3.0.0
         */
        this.updateList = scene.sys.updateList;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#name
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.name = '';

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#direction
         * @type {Phaser.Math.Vector3}
         * @since 3.0.0
         */
        this.direction = new Vector3(0, 0, -1);

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#up
         * @type {Phaser.Math.Vector3}
         * @since 3.0.0
         */
        this.up = new Vector3(0, 1, 0);

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#position
         * @type {Phaser.Math.Vector3}
         * @since 3.0.0
         */
        this.position = new Vector3();

        //  The mapping from 3D size units to pixels.
        //  In the default case 1 3D unit = 128 pixels. So a sprite that is
        //  256 x 128 px in size will be 2 x 1 units.
        //  Change to whatever best fits your game assets.

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#pixelScale
         * @type {number}
         * @since 3.0.0
         */
        this.pixelScale = 128;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#projection
         * @type {Phaser.Math.Matrix4}
         * @since 3.0.0
         */
        this.projection = new Matrix4();

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#view
         * @type {Phaser.Math.Matrix4}
         * @since 3.0.0
         */
        this.view = new Matrix4();

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#combined
         * @type {Phaser.Math.Matrix4}
         * @since 3.0.0
         */
        this.combined = new Matrix4();

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#invProjectionView
         * @type {Phaser.Math.Matrix4}
         * @since 3.0.0
         */
        this.invProjectionView = new Matrix4();

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#near
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.near = 1;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#far
         * @type {number}
         * @since 3.0.0
         */
        this.far = 100;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#ray
         * @type {[type]}
         * @since 3.0.0
         */
        this.ray = {
            origin: new Vector3(),
            direction: new Vector3()
        };

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#viewportWidth
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.viewportWidth = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#viewportHeight
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.viewportHeight = 0;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#billboardMatrixDirty
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.billboardMatrixDirty = true;

        /**
         * [description]
         *
         * @name Phaser.Cameras.Sprite3D#children
         * @type {Phaser.Structs.Set}
         * @since 3.0.0
         */
        this.children = new Set();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setPosition
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} z - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setPosition: function (x, y, z)
    {
        this.position.set(x, y, z);

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setScene
     * @since 3.0.0
     *
     * @param {Phaser.Scene} scene - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setScene: function (scene)
    {
        this.scene = scene;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setPixelScale
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setPixelScale: function (value)
    {
        this.pixelScale = value;

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#add
     * @since 3.0.0
     *
     * @param {[type]} sprite3D - [description]
     *
     * @return {[type]} [description]
     */
    add: function (sprite3D)
    {
        this.children.set(sprite3D);

        this.updateChildren();

        return sprite3D;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#remove
     * @since 3.0.0
     *
     * @param {[type]} child - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    remove: function (child)
    {
        this.displayList.remove(child.gameObject);
        this.updateList.remove(child.gameObject);

        this.children.delete(child);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#clear
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    clear: function ()
    {
        var children = this.getChildren();

        for (var i = 0; i < children.length; i++)
        {
            this.remove(children[i]);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#getChildren
     * @since 3.0.0
     *
     * @return {array} [description]
     */
    getChildren: function ()
    {
        return this.children.entries;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#create
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} z - [description]
     * @param {[type]} key - [description]
     * @param {[type]} frame - [description]
     * @param {[type]} visible - [description]
     *
     * @return {[type]} [description]
     */
    create: function (x, y, z, key, frame, visible)
    {
        if (visible === undefined) { visible = true; }

        var child = new Sprite3D(this.scene, x, y, z, key, frame);

        this.displayList.add(child.gameObject);
        this.updateList.add(child.gameObject);

        child.visible = visible;

        this.children.set(child);

        this.updateChildren();

        return child;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#createMultiple
     * @since 3.0.0
     *
     * @param {[type]} quantity - [description]
     * @param {[type]} key - [description]
     * @param {[type]} frame - [description]
     * @param {[type]} visible - [description]
     *
     * @return {[type]} [description]
     */
    createMultiple: function (quantity, key, frame, visible)
    {
        if (visible === undefined) { visible = true; }

        var output = [];

        for (var i = 0; i < quantity; i++)
        {
            var child = new Sprite3D(this.scene, 0, 0, 0, key, frame);

            this.displayList.add(child.gameObject);
            this.updateList.add(child.gameObject);

            child.visible = visible;

            this.children.set(child);

            output.push(child);
        }

        return output;
    },

    //  Create a bunch of Sprite3D objects in a rectangle
    //  size and spacing are Vec3s (or if integers are converted to vec3s)
    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#createRect
     * @since 3.0.0
     *
     * @param {[type]} size - [description]
     * @param {[type]} spacing - [description]
     * @param {[type]} key - [description]
     * @param {[type]} frame - [description]
     *
     * @return {[type]} [description]
     */
    createRect: function (size, spacing, key, frame)
    {
        if (typeof size === 'number') { size = { x: size, y: size, z: size }; }
        if (typeof spacing === 'number') { spacing = { x: spacing, y: spacing, z: spacing }; }

        var quantity = size.x * size.y * size.z;

        var sprites = this.createMultiple(quantity, key, frame);

        var i = 0;

        for (var z = 0.5 - (size.z / 2); z < (size.z / 2); z++)
        {
            for (var y = 0.5 - (size.y / 2); y < (size.y / 2); y++)
            {
                for (var x = 0.5 - (size.x / 2); x < (size.x / 2); x++)
                {
                    var bx = (x * spacing.x);
                    var by = (y * spacing.y);
                    var bz = (z * spacing.z);

                    sprites[i].position.set(bx, by, bz);

                    i++;
                }
            }
        }

        this.update();

        return sprites;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#randomSphere
     * @since 3.0.0
     *
     * @param {[type]} radius - [description]
     * @param {[type]} sprites - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    randomSphere: function (radius, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            RandomXYZ(sprites[i].position, radius);
        }

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#randomCube
     * @since 3.0.0
     *
     * @param {[type]} scale - [description]
     * @param {[type]} sprites - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    randomCube: function (scale, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            RandomXYZW(sprites[i].position, scale);
        }

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#translateChildren
     * @since 3.0.0
     *
     * @param {[type]} vec3 - [description]
     * @param {[type]} sprites - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    translateChildren: function (vec3, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            sprites[i].position.add(vec3);
        }

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#transformChildren
     * @since 3.0.0
     *
     * @param {[type]} mat4 - [description]
     * @param {[type]} sprites - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    transformChildren: function (mat4, sprites)
    {
        if (sprites === undefined) { sprites = this.getChildren(); }

        for (var i = 0; i < sprites.length; i++)
        {
            sprites[i].position.transformMat4(mat4);
        }

        return this.update();
    },

    /**
     * Sets the width and height of the viewport. Does not update any matrices.
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setViewport
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setViewport: function (width, height)
    {
        this.viewportWidth = width;
        this.viewportHeight = height;

        return this.update();
    },

    /**
     * Translates this camera by a specified Vector3 object
     * or x, y, z parameters. Any undefined x y z values will
     * default to zero, leaving that component unaffected.
     * If you wish to set the camera position directly call setPosition instead.
     *
     * @method Phaser.Cameras.Sprite3D.Camera#translate
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} z - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    translate: function (x, y, z)
    {
        if (typeof x === 'object')
        {
            this.position.x += x.x || 0;
            this.position.y += x.y || 0;
            this.position.z += x.z || 0;
        }
        else
        {
            this.position.x += x || 0;
            this.position.y += y || 0;
            this.position.z += z || 0;
        }

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#lookAt
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} z - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    lookAt: function (x, y, z)
    {
        var dir = this.direction;
        var up = this.up;

        if (typeof x === 'object')
        {
            dir.copy(x);
        }
        else
        {
            dir.set(x, y, z);
        }

        dir.subtract(this.position).normalize();

        //  Calculate right vector
        tmpVec3.copy(dir).cross(up).normalize();

        //  Calculate up vector
        up.copy(tmpVec3).cross(dir).normalize();

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#rotate
     * @since 3.0.0
     *
     * @param {[type]} radians - [description]
     * @param {[type]} axis - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    rotate: function (radians, axis)
    {
        RotateVec3(this.direction, axis, radians);
        RotateVec3(this.up, axis, radians);

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#rotateAround
     * @since 3.0.0
     *
     * @param {[type]} point - [description]
     * @param {[type]} radians - [description]
     * @param {[type]} axis - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    rotateAround: function (point, radians, axis)
    {
        tmpVec3.copy(point).subtract(this.position);

        this.translate(tmpVec3);
        this.rotate(radians, axis);
        this.translate(tmpVec3.negate());

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#project
     * @since 3.0.0
     *
     * @param {[type]} vec - [description]
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
     */
    project: function (vec, out)
    {
        if (out === undefined) { out = new Vector4(); }

        //  TODO: support viewport XY
        var viewportWidth = this.viewportWidth;
        var viewportHeight = this.viewportHeight;
        var n = Camera.NEAR_RANGE;
        var f = Camera.FAR_RANGE;

        //  For useful Z and W values we should do the usual steps: clip space -> NDC -> window coords

        //  Implicit 1.0 for w component
        tmpVec4.set(vec.x, vec.y, vec.z, 1.0);

        //  Transform into clip space
        tmpVec4.transformMat4(this.combined);

        //  Avoid divide by zero when 0x0x0 camera projects to a 0x0x0 vec3
        if (tmpVec4.w === 0)
        {
            tmpVec4.w = 1;
        }

        //  Now into NDC
        tmpVec4.x = tmpVec4.x / tmpVec4.w;
        tmpVec4.y = tmpVec4.y / tmpVec4.w;
        tmpVec4.z = tmpVec4.z / tmpVec4.w;

        //  And finally into window coordinates
        out.x = viewportWidth / 2 * tmpVec4.x + (0 + viewportWidth / 2);
        out.y = viewportHeight / 2 * tmpVec4.y + (0 + viewportHeight / 2);
        out.z = (f - n) / 2 * tmpVec4.z + (f + n) / 2;

        //  If the out vector has a fourth component, we also store (1/clip.w), same idea as gl_FragCoord.w
        if (out.w === 0 || out.w)
        {
            out.w = 1 / tmpVec4.w;
        }

        return out;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#unproject
     * @since 3.0.0
     *
     * @param {[type]} vec - [description]
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
     */
    unproject: function (vec, out)
    {
        if (out === undefined) { out = new Vector3(); }

        var viewport = tmpVec4.set(0, 0, this.viewportWidth, this.viewportHeight);

        return out.copy(vec).unproject(viewport, this.invProjectionView);
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#getPickRay
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
     */
    getPickRay: function (x, y)
    {
        var origin = this.ray.origin.set(x, y, 0);
        var direction = this.ray.direction.set(x, y, 1);
        var viewport = tmpVec4.set(0, 0, this.viewportWidth, this.viewportHeight);
        var mtx = this.invProjectionView;

        origin.unproject(viewport, mtx);

        direction.unproject(viewport, mtx);

        direction.subtract(origin).normalize();

        return this.ray;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#updateChildren
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    updateChildren: function ()
    {
        var children = this.children.entries;

        for (var i = 0; i < children.length; i++)
        {
            children[i].project(this);
        }

        return this;
    },

    //  Overriden by subclasses
    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#update
     * @since 3.0.0
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    update: function ()
    {
        return this.updateChildren();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#updateBillboardMatrix
     * @since 3.0.0
     */
    updateBillboardMatrix: function ()
    {
        var dir = dirvec.set(this.direction).negate();

        // Better view-aligned billboards might use this:
        // var dir = tmp.set(camera.position).subtract(p).normalize();
        
        var right = rightvec.set(this.up).cross(dir).normalize();
        var up = tmpVec3.set(dir).cross(right).normalize();

        var out = billboardMatrix.val;

        out[0] = right.x;
        out[1] = right.y;
        out[2] = right.z;
        out[3] = 0;

        out[4] = up.x;
        out[5] = up.y;
        out[6] = up.z;
        out[7] = 0;

        out[8] = dir.x;
        out[9] = dir.y;
        out[10] = dir.z;
        out[11] = 0;

        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;

        this.billboardMatrixDirty = false;
    },
    
    /**
     * This is a utility function for canvas 3D rendering, 
     * which determines the "point size" of a camera-facing
     * sprite billboard given its 3D world position 
     * (origin at center of sprite) and its world width
     * and height in x/y. 
     *
     * We place into the output Vector2 the scaled width
     * and height. If no `out` is specified, a new Vector2
     * will be created for convenience (this should be avoided 
     * in tight loops).
     *
     * @method Phaser.Cameras.Sprite3D.Camera#getPointSize
     * @since 3.0.0
     *
     * @param {[type]} vec - The position of the 3D Sprite.
     * @param {[type]} size - The x and y dimensions.
     * @param {[type]} out - The result, scaled x and y dimensions.
     *
     * @return {[type]} [description]
     */
    getPointSize: function (vec, size, out)
    {
        if (out === undefined) { out = new Vector2(); }

        // TODO: optimize this with a simple distance calculation:
        // https://developer.valvesoftware.com/wiki/Field_of_View

        if (this.billboardMatrixDirty)
        {
            this.updateBillboardMatrix();
        }

        var tmp = tmpVec3;

        var dx = (size.x / this.pixelScale) / 2;
        var dy = (size.y / this.pixelScale) / 2;

        tmp.set(-dx, -dy, 0).transformMat4(billboardMatrix).add(vec);

        this.project(tmp, tmp);

        var tlx = tmp.x;
        var tly = tmp.y;

        tmp.set(dx, dy, 0).transformMat4(billboardMatrix).add(vec);

        this.project(tmp, tmp);

        var brx = tmp.x;
        var bry = tmp.y;

        // var w = Math.abs(brx - tlx);
        // var h = Math.abs(bry - tly);

        //  Allow the projection to get negative ...
        var w = brx - tlx;
        var h = bry - tly;

        return out.set(w, h);
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.children.clear();

        this.scene = undefined;
        this.children = undefined;
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setX
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setX: function (value)
    {
        this.position.x = value;

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setY
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setY: function (value)
    {
        this.position.y = value;

        return this.update();
    },

    /**
     * [description]
     *
     * @method Phaser.Cameras.Sprite3D.Camera#setZ
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {Phaser.Cameras.Sprite3D.Camera} This Camera object.
     */
    setZ: function (value)
    {
        this.position.z = value;

        return this.update();
    },

    /**
     * [description]
     *
     * @name Phaser.Cameras.Sprite3D.Camera#x
     * @type {number}
     * @since 3.0.0
     */
    x: {
        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
            this.update();
        }
    },

    /**
     * [description]
     *
     * @name Phaser.Cameras.Sprite3D.Camera#y
     * @type {number}
     * @since 3.0.0
     */
    y: {
        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
            this.update();
        }
    },

    /**
     * [description]
     *
     * @name Phaser.Cameras.Sprite3D.Camera#z
     * @type {number}
     * @since 3.0.0
     */
    z: {
        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
            this.update();
        }
    }

});

Camera.FAR_RANGE = 1.0;
Camera.NEAR_RANGE = 0.0;

module.exports = Camera;
