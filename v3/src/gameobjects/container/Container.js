
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var ContainerRender = require('./ContainerRender');

var Container = new Class({

    Mixins: [
        Components.Visible,
        ContainerRender
    ],

    initialize:

    function Container (state)
    {
        GameObject.call(this, state);

        this.children = new Components.Children(this);
    }

});

module.exports = Container;
