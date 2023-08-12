import * as fs from 'fs-extra';
import * as path from 'path';
import { Parser } from './Parser';

export function publish(data: any, opts: any) {
    // remove undocumented stuff.
    data({ undocumented: true }).remove();
    // remove package data
    data({ kind: 'package' }).remove();
    // remove header comments
    data({ copyright: { isString: true } }).remove();
    // remove private members
    data({ access: 'private' }).remove();
    // remove ignored doclets
    data({ ignore: true }).remove();

    if (!fs.existsSync(opts.destination)) {
        fs.mkdirSync(opts.destination);
    }

    var str = JSON.stringify(data().get(), null, 4);

    fs.writeFileSync(path.join(opts.destination, 'phaser.json'), str);

    var out = new Parser(data().get()).emit();

    fs.writeFileSync(path.join(opts.destination, 'phaser.d.ts'), out);
};
