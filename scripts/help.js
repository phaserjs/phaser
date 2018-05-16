var v = require('vivid-cli');
                                          
v.log('{bgYellow}{black} __________.__                                 ________   ');
v.log('{bgYellow}{black} \\______   \\  |__ _____    ______ ___________  \\_____  \\  ');
v.log('{bgYellow}{black}  |     ___/  |  \\\\__  \\  /  ___// __ \\_  __ \\   _(__  <  ');
v.log('{bgYellow}{black}  |    |   |   Y  \\/ __ \\_\\___ \\\\  ___/|  | \\/  /       \\ ');
v.log('{bgYellow}{black}  |____|   |___|  (____  /____  >\\___  >__|    /______  / ');
v.log('{bgYellow}{black}                \\/     \\/     \\/     \\/               \\/  ');
v.log('{bgYellow}{black}  Available commands:                                     ');

v.log('{white}* npm run {green}build {cyan}  Build dev version of Phaser with Webpack');
v.log('{white}* npm run {green}watch {cyan}   Build dev & put Webpack into watch mode');
v.log('{white}* npm run {green}dist {cyan}        Build dist & min versions of Phaser');
v.log('{white}* npm run {green}lint {cyan}                 ESLint check Phaser source');
v.log('{white}* npm run {green}lintfix {cyan}      ESLint check and fix Phaser source');
v.log('{white}* npm run {green}sloc {cyan}      Get source code & comments line count');
v.log('{white}* npm run {green}bundleshaders {cyan}   Convert vert/frag shaders to js');

v.log('{bgYellow}{black}  https://phaser.io               https://labs.phaser.io  ');
