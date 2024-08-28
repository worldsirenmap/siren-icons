import Client from 'ssh2-sftp-client'
import { readdirSync, createReadStream } from 'fs';

const SPRITE_REMOTE_PATH = "/mapdata/sprites/"
const SPRITE_DIR = './../dist/sprites/'

const ICONS_REMOTE_PATH = "/assets/siren-icons/"
const ICONS_DIR = './../siren-icons/'

const GENERALICONS_REMOTE_PATH = "/mapdata/sprites/general-icons/"
const GENERALICONS_DIR = './../general-icons/'

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
sftp.rmdir(SPRITE_REMOTE_PATH + "/*" , true)

const markerFileDirs = readdirSync(SPRITE_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())

for (const dir of markerFileDirs) {
	sftp.mkdir(SPRITE_REMOTE_PATH + dir, true)
	
	const markerFileList = readdirSync(SPRITE_DIR, { withFileTypes: true })
		.filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.svg'))
		
	for (const file of markerFileList) {
		console.log(dir + file.name)
		await sftp.put(createReadStream(SPRITE_DIR + dir + file.name), SPRITE_REMOTE_PATH + dir + file.name, PUT_OPTIONS)
	}
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

console.log("Upload general icons")
const currentGeneralIconList = await sftp.list(GENERALICONS_REMOTE_PATH)
for (const file of currentGeneralIconList) {
    await sftp.delete(GENERALICONS_REMOTE_PATH + file.name)
}

const generalIconFileList = readdirSync(GENERALICONS_DIR, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.svg'))

for (const file of generalIconFileList) {
    console.log(file.name)
    await sftp.put(createReadStream(GENERALICONS_DIR + file.name), GENERALICONS_REMOTE_PATH + file.name, PUT_OPTIONS)
}

console.log("Closing connection")
sftp.end()