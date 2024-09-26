import * as fs from "fs";
import * as NodeID3 from 'node-id3';

export class FileService {

    async listFilesInDir(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(files)
                }
            })
        })
    }

    takeFileTags(file: string): NodeID3.Tags {
        const options = {
            include: ['TIT2', 'TPE1'],    // only read the specified tags (default: all)
            noRaw: true
        }
        //const numberOfFolders = await this.numberOfFolders();
        return NodeID3.read(file, options)
    }

}