var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');

var Plugin = new Class({

    initialize:

    function Plugin (scene, systemName, sceneName)
    {
        if (sceneName === undefined) { sceneName = systemName; }

        this.scene = scene;

        this.system = {
            systemName: systemName,
            sceneName: sceneName,
            active: true,
            visible: true,
            priority: {
                begin: 0,
                update: 0,
                postUpdate: 0,
                render: 0,
                postRender: 0
            }
        };
    },

    setPriority: function (type, value)
    {
        this.system.priority[type] = value;
    },

    setActive: function (value)
    {
        this.system.active = value;
    },

    setVisible: function (value)
    {
        this.system.visible = value;
    },

    boot: NOOP,
    begin: NOOP,
    update: NOOP,
    postUpdate: NOOP,
    render: NOOP,
    postRender: NOOP,
    shutdown: NOOP,
    destroy: NOOP

});

module.exports = Plugin;
