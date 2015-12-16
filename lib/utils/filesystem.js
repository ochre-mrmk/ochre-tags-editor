import fs from 'fs';
import path from 'path';
import pathIsInside from 'path-is-inside';

const FILES_PATH = process.env.FILES_PATH || '/data';

function isUnixHiddenPath(thePath) {
    return (/(^|\/)\.[^\/\.]/g).test(thePath);
}

function isUnixHiddenFile(file) {
    return (/^\./.test(file));
}

export default function statDir(thePath, cb) {
    // check no one is trying to sniff the server
    let absolutePath = path.join(FILES_PATH, thePath);
    if (!pathIsInside(absolutePath, FILES_PATH)) {
        cb(new Error("Path is not inside the allowed path"), []);
    } else if (isUnixHiddenPath(absolutePath)) {
        cb(new Error("Going inside hidden paths is disallowed"), []);
    } else {
        fs.readdir(absolutePath, (err, files) => {
            if (err) {
                cb(err, []);
            } else {
                // only non-hidden files and directories
                cb(undefined, files.reduce((list, file) => {
                    let stats = fs.statSync(path.join(absolutePath, file));
                    if (isUnixHiddenFile(file) && (stats.isFile() || stats.isDirectory())) {
                        list.push(stats.isDirectory() ? file + path.sep : file);
                    }
                }, []));
            }
        });
    }
}