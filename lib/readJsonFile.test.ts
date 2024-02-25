import * as fs from 'fs';
import { readJsonFile } from './readJsonFile';

jest.mock('fs');

describe('readJsonFile function', () => {
    const mockReadFile: jest.SpyInstance = jest.spyOn(fs, 'readFile');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should read JSON file and return data', async () => {
        // prepare
        const mockData = '{"name": "John", "age": 30}';
        mockReadFile.mockImplementationOnce((path, encoding, callback) => {
            callback(null, mockData);
        });

        // execute
        const result = await readJsonFile('test.json');

        // assert
        expect(result).toEqual(JSON.parse(mockData));
        expect(mockReadFile).toHaveBeenCalledWith('test.json', 'utf8', expect.any(Function));
    });

    it('should cache the result when called multiple times with the same path', async () => {
        // prepare
        const mockData = '{"name": "John", "age": 30}';
        mockReadFile.mockImplementationOnce((path, encoding, callback) => {
            callback(null, mockData);
        });

        // execute
        await readJsonFile('test-cache.json');
        await readJsonFile('test-cache.json');

        // assert
        expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if file reading fails', async () => {
        // prepare
        const errorMessage = 'File not found';
        mockReadFile.mockImplementationOnce((path, encoding, callback) => {
            callback(new Error(errorMessage));
        });

        // execute and assert
        await expect(async () => {
            await readJsonFile('test-error.json');
        }).rejects.toThrow(errorMessage);
    });
});
