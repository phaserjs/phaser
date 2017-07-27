var Class = require('../utils/Class');
var InputEvent = require('../input/local/events');
var SceneInputManager = require('../input/local/SceneInputManager');

var InputManager = new Class({

    Extends: SceneInputManager,

    initialize:

    function InputManager (scene, game)
    {
        SceneInputManager.call(this, scene, game);
    }

});

module.exports = InputManager;
