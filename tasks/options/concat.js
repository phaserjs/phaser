module.exports = {

    ///////////////////
    //  Custom Build //
    ///////////////////

    custom: {
        options: {
            banner: '<%= banner %>',
        },
        src: ['<%= filelist %>'],
        dest: '<%= compile_dir %>/<%= filename %>.js'
    }

};
