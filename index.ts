import { FileService } from "./modules/files/file";
import { XmlBuilderService } from "./modules/xml/xmlBuilder";
import {ConverterService} from "./modules/converter/converter";
import {spawn} from "child_process";

class NodeOP22 {
    private readonly fileService: FileService
    private readonly xmlBuilderService: XmlBuilderService
    private readonly converterService: ConverterService
    constructor() {
        this.fileService = new FileService();
        this.xmlBuilderService = new XmlBuilderService()
        this.converterService = new ConverterService()
    }

    tot() {
        // this.xmlBuilderService.getXml().then()
        // this.converterService.getMusicInOggFormat().then()

        let cmd = spawn('./utils/converter.exe', [
            '-pack',
            './output/gamedata',
            '-2947ru',
            '-out',
            //'./output/gamedata.dbz_flash22'
        ])
        cmd.stdout.on('data', (res) => {
            console.log(`${res}`)
        })

    }
}

new NodeOP22().tot()
