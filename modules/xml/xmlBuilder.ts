import {FileService} from "../files/file";
import * as fs from "fs";
import * as _ from 'lodash';
import {toNumber} from 'lodash';

export class XmlBuilderService {
    private readonly fileService: FileService;
    private readonly authorsFlashDrives: Array<string>
    constructor() {
        this.fileService = new FileService()
        this.authorsFlashDrives = [
            'от Сидоровича', 'от Бармена', 'от Долга', 'от Свободы', 'от Бандитов',
            'от Сяка', '№7', '№8', '№9', '№10', '№11', '№12', '№13', '№14', '№15', '№16']
    }

    async getXmlSongListTemplate(folder: string, flashDriveNumber: number) {
        const tagsArray = [];

        const files = await this.fileService.listFilesInDir(`./music/${folder}`)

        for (let index in files) {
            const tags = this.fileService.takeFileTags(`./music/${folder}/${files[index]}`)
            tagsArray.push(tags)
        }

        const content = []
        let song: string;
        tagsArray.forEach(( tag, index) => {
            let xmlS = ''

            let xml = {
                flashDriveNumber: flashDriveNumber,
                numberSong: toNumber(index) + 1,
                titleSong: tag['title'],
                artistSong: tag['artist']
            }

            song = `<string id="flash_${xml.flashDriveNumber}_track_${xml.numberSong}">\n` +
                `\t<rus>${xml.artistSong} – ${xml.titleSong}</rus>\n` +
                `</string>\t\n`

            content.push(xmlS + `${_.template(song)({...xml})}`)


        })

        return _.join(content, '')
    }


    async getXml() {
        const folders = await this.fileService.listFilesInDir('./music')
        for (let index in folders) {
            let params = {
                flashDriveNumber: toNumber(index) + 1,
                content: null,
                authorIsFlashDrive: this.authorsFlashDrives[index]
            }

            params.content = await this.getXmlSongListTemplate(folders[index], params.flashDriveNumber)

            const item = fs.readFileSync('./modules/xml/templates/flash.xml', 'utf8')
            let items = ''
            items = items + `${_.template(item)({...params})}` + '\n'
            fs.appendFileSync(`./output/gamedata/config/text/string_table_ogg_flash_tracks.xml`, items)
        }
    }
}