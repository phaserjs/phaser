
var Text = require('./Text');
var BuildFromConfig = require('./BuildFromConfig');
var FactoryContainer = require('../../FactoryContainer');

var TextFactory = {

    KEY: 'text',

    add: function (x, y, text, style)
    {
        return this.children.add(new Text(this.state, x, y, text, style));
    },

    make: function (config)
    {
        return BuildFromConfig(this.state, config);
    }

};

module.exports = FactoryContainer.register(TextFactory);
