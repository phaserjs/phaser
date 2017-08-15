var Class = require('../utils/Class');
var InputEvent = require('../input/local/events');
var SceneInputManager = require('../input/local/SceneInputManager');

var InputManager = new Class({

    Extends: SceneInputManager,

    initialize:

    function InputManager (scene)
    {
        SceneInputManager.call(this, scene);
    },

    pointScreenToWorldHitTest: function (gameObjects, x, y, camera)
    {
        return this.manager.pointScreenToWorldHitTest(gameObjects, x, y, camera);
    }

});

module.exports = InputManager;
