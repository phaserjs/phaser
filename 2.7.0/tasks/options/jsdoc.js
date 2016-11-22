module.exports = {
    html: {
        src: ['./README.md'],
        options: {
            configure: 'tasks/jsdoc-conf.json',
            /* The destination and private options must be redefined event if there are always in the configure file otherwise, grunt-jsdoc overwrite it with its default values */
            destination: 'docs',
            private: false
        }
    },
    json: {
        jsdoc: './node_modules/.bin/jsdoc',
        src: [],
        options: {
            configure: 'tasks/jsdocexportjson-conf.json',
            /* The destination options must be redefined event if there is always in the configure file otherwise, grunt-jsdoc overwrite it with its default value */
            destination: './out'
        }
    }
};