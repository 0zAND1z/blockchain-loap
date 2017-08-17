import ipfsAPI from 'ipfs-api'

let IPFS_CLIENT = null
let DEFAULT_IPFS_GATEWAY_ADDR = 'http://localhost:8080/'

export function SetupIPFSAPI(...args) {
  IPFS_CLIENT = ipfsAPI(...args)
  return IPFS_CLIENT
}

export function UploadPath(localPath, previous_hash) {
  if(IPFS_CLIENT == null) { SetupIPFSAPI() }
  const options = { recursive: true }
  return IPFS_CLIENT.util.addFromFs(filePath, options)
}

export function Download(hash, outputPath) {
  // Fuck that, we can use the public gateways
  // if(IPFS_CLIENT == null) { SetupIPFSAPI() }
  // const options = { recursive: true }
  // consider this: https://www.npmjs.com/package/in-browser-download
  let win = window.open(DEFAULT_IPFS_GATEWAY_ADDR + '/ipfs/' + hash, '_blank')
  win.focus()
}
