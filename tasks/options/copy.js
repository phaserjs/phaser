module.exports = {

    custom: {
        expand: true,
        flatten: true,
        cwd: '<%= compile_dir %>/',
        src: ['*.js', '*.map'],
        dest: '<%= target_dir %>/'
    }
   
};
