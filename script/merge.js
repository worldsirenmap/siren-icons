import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

const MARKER_DIR = './../marker-bases/'
const ICONS_DIR = './../siren-icons/'
const SPECIAL_ICONS_DIR = './../special-siren-icons/'
const OUTPUT_DIR = './../dist/sprites/'

const parser = new XMLParser({
    ignoreAttributes : false
});

const builder = new XMLBuilder({
    ignoreAttributes : false,
    suppressEmptyNode: true
});

const listSvgFiles = (dir) => readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.svg'))
    .map(entry => dir + entry.name)


for (const markerFile of listSvgFiles(MARKER_DIR)) {
    const markerDir = markerFile.split("/").pop().split(".svg").shift() + "-siren-marker/"

    for (const iconFile of [...listSvgFiles(ICONS_DIR), ...listSvgFiles(SPECIAL_ICONS_DIR)]) {
        const iconData = parser.parse(readFileSync(iconFile, 'utf8'))
        const markerData = parser.parse(readFileSync(markerFile, 'utf8'))

        iconData.svg.path['@_transform'] = 'translate(10, 10)'

        markerData.svg.path = [
            markerData.svg.path,
            iconData.svg.path,
        ]

        mkdirSync(OUTPUT_DIR + markerDir, { recursive: true })
        writeFileSync(OUTPUT_DIR + markerDir + iconFile, builder.build(markerData))
    }
}
