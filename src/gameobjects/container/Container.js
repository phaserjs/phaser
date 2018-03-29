var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var Render = require('./ContainerRender');

var Container = new Class({

    Extends: GameObject,

    Mixins: [
        Components.BlendMode,
        Components.Transform,
        Render
    ],

    initialize:

    function Container(scene, x, y)
    {
        GameObject.call(this, scene, 'Container');
        this.parentContainer = null;
        this.children = [];
        this.setPosition(x, y);
        this.localTransform = new Components.TransformMatrix();
        this.tempTransformMatrix = new Components.TransformMatrix();
    },

    add: function (gameObject)
    {
        if (gameObject.type === 'Container')
        {
            gameObject.parentContainer = this;
        }
        if (this.children.indexOf(gameObject) < 0)
        {
            this.children.push(gameObject);
        }
        return this;
    },

    remove: function (gameObject)
    {
        var index = this.children.indexOf(gameObject);
        if (index >= 0)
        {
            if (gameObject.type === 'Container')
            {
                gameObject.parentContainer = null;
            }
            this.children.splice(index, 1);
        }
        return this;
    },

    pointToContainer: function (pointSrc, pointDst)
    {
        var parent = this.parentContainer;
        var tempMatrix = this.tempTransformMatrix;
        
        if (pointDst === undefined)
        {
            pointDst = { x: 0, y: 0 };
        }

        if (parent !== null)
        {
            parent.pointToContainer(pointSrc, pointDst);
        }

        tempMatrix.loadIdentity();
        tempMatrix.applyITRS(this.x, this.y, this.rotation, this.scaleX, this.scaleY);
        tempMatrix.invert();
        tempMatrix.transformPoint(pointSrc.x, pointSrc.y, pointDst);

        return pointDst;
    },

    hasPoint: function (gameObject, point)
    {
        return false;
    }

});

module.exports = Container;
