import * as ffmpeg from "fluent-ffmpeg";
import {FileService} from "../files/file";
import * as _ from 'lodash';
import {toNumber} from 'lodash';

export class ConverterService {
    private readonly fileService: FileService;

    constructor() {
        this.fileService = new FileService()
    }
    async converterMp3ToOgg(folder: string, file: string, fileIndex: string) {
        return new Promise((resolve, reject) => {
            ffmpeg(`music/${folder}/${file}`)
                .audioBitrate(16)
                .audioChannels(1)
                .withAudioFrequency(44100)
                .format('wav')
                .save(`./output/wavMusic/${folder}/sound_${fileIndex}.wav`)
                .on('end', () => {
                    ffmpeg(`./output/wavMusic/${folder}/sound_${fileIndex}.wav`)
                        .format('ogg')
                        .save(`./output/gamedata/sounds/ogg_player/${folder}/sound_${fileIndex}.ogg`)
                        .on('end', (err, res) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(res)
                            }
                        })
                })
        })
    }

    async getMusicInOggFormat() {
        const folders = await this.fileService.listFilesInDir('./music')

        for (let folderIndex in folders) {
            const files = await this.fileService.listFilesInDir(`./music/${folders[folderIndex]}`)

            for (let fileIndex in files) {
                    await this.converterMp3ToOgg(`${folders[folderIndex]}`, `${files[fileIndex]}`, _.toString(toNumber(fileIndex)+1) )
            }
        }


    }
}