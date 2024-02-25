import * as fs from 'fs';
import * as util from 'util';

const cache: { [path: string]: string } = {};

export const readJsonFile = async (path: string): Promise<string> => {
    if (!cache[path]) {
        const readFile = util.promisify(fs.readFile);
        const data = await readFile(path, 'utf8');
        cache[path] = JSON.parse(data);
    }
    return cache[path];
};
