import Client from 'ssh2-sftp-client'
import { readdirSync, createReadStream } from 'fs';

const MARKER_REMOTE_PATH = "/mapdata/sprites/siren-marker/"
const MARKER_DIR = './../dist/siren-marker/'

const ICONS_REMOTE_PATH = "/assets/siren-icons/"
const ICONS_DIR = './../icons/'

const GLYPHS_REMOTE_PATH = "/mapdata/sprites/glyphs/"
const GLYPHS_DIR = './../glyphs/'

const PUT_OPTIONS = {
    writeStreamOptions: {
      mode: 0o664
  }}

const sftp = new Client()

console.log("Connect to SFTP server")
await sftp.connect({
    type: 'publickey',
    host: process.env.SFTP_HOST,
    username: process.env.SFTP_USER,
    privateKey : process.env.SFTP_PRIVATE_KEY
})

console.log("Upload siren markers")
const currentMarkerList = await sftp.list(MARKER_REMOTE_PATH)
for (const file of currentMarkerList) {
    await sftp.delete(MARKER_REMOTE_PATH + file.name)
}

const markerFileList = readdirSync(MARKER_DIR, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.svg'))

for (const file of markerFileList) {
    console.log(file.name)
    await sftp.put(createReadStream(MARKER_DIR + file.name), MARKER_REMOTE_PATH + file.name, PUT_OPTIONS)
}

console.log("Upload siren icons")
const currentIconList = await sftp.list(ICONS_REMOTE_PATH)
for (const file of currentIconList) {
    await sftp.delete(ICONS_REMOTE_PATH + file.name)
}

const iconFileList = readdirSync(ICONS_DIR, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.svg'))

for (const file of iconFileList) {
    console.log(file.name)
    await sftp.put(createReadStream(ICONS_DIR + file.name), ICONS_REMOTE_PATH + file.name, PUT_OPTIONS)
}

console.log("Upload glyphs")
const currentGlyphList = await sftp.list(GLYPHS_REMOTE_PATH)
for (const file of currentGlyphList) {
    await sftp.delete(GLYPHS_REMOTE_PATH + file.name)
}

const glyphFileList = readdirSync(GLYPHS_DIR, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.svg'))

for (const file of glyphFileList) {
    console.log(file.name)
    await sftp.put(createReadStream(GLYPHS_DIR + file.name), GLYPHS_REMOTE_PATH + file.name, PUT_OPTIONS)
}

console.log("Closing connection")
sftp.end()