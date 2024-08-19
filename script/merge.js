import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

const MARKER_DIR = './../marker-bases/'
const ICONS_DIR = './../siren-icons/'
const OUTPUT_DIR = './../dist/siren-marker/'

if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
}

const parser = new XMLParser({
    ignoreAttributes : false
});

const builder = new XMLBuilder({
    ignoreAttributes : false,
    suppressEmptyNode: true
});

const markerFileList = readdirSync(MARKER_DIR, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.svg'))

const iconFileList = readdirSync(ICONS_DIR, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.svg'))
    

for (const iconFile of iconFileList) {
    for (const markerFile of markerFileList) {
        const iconData = parser.parse(readFileSync(ICONS_DIR + iconFile.name, 'utf8'))
        const markerData = parser.parse(readFileSync(MARKER_DIR + markerFile.name, 'utf8'))

        iconData.svg.path['@_transform'] = 'translate(10, 10)'

        markerData.svg.path = [
            markerData.svg.path,
            iconData.svg.path,
        ]

        const outputData = builder.build(markerData);
        const outputFilename = iconFile.name.toLowerCase().slice(0, -4) + "-" + markerFile.name.toLowerCase().slice(0, -4) + ".svg";
        
        writeFileSync(OUTPUT_DIR + outputFilename, outputData)
    }
}
