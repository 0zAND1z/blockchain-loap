// Import libraries we need.
import { default as Web3 } from 'web3'

// IPFS STUFF

import ipfsAPI from 'ipfs-api'

let IPFS_CLIENT = null
let DEFAULT_IPFS_GATEWAY_ADDR = 'http://localhost:8080'
let FILES = {}

const PREVIOUS_HASH_PARAMETER = "Previous Version"
const MOTHER_HASH_PARAMETER = "Original Data"

window.IPFS_CLIENT = IPFS_CLIENT

function SetupIPFSAPI (...args) {
  IPFS_CLIENT = ipfsAPI(...args)
  window.IPFS_CLIENT = IPFS_CLIENT
  return IPFS_CLIENT
}

function Upload (reader, filename) {
  if (IPFS_CLIENT == null) SetupIPFSAPI()
  let ipfsId
  const buffer = Buffer.from(reader.result)
  return IPFS_CLIENT.add(buffer)
    .then((response) => {
      console.log(response)
      ipfsId = response[0].hash
      FILES[ipfsId] = { 'name': filename, 'size': response[0].size }
      console.log(ipfsId)
    }).catch((err) => {
      console.error(err)
    })
}

function Download (hash) {
  // Fuck that, we can use the public gateways
  // if(IPFS_CLIENT == null) { SetupIPFSAPI() }
  // const options = { recursive: true }
  // consider this: https://www.npmjs.com/package/in-browser-download
  let win = window.open(DEFAULT_IPFS_GATEWAY_ADDR + '/ipfs/' + hash, '_blank')
  win.focus()
}

function BuildHashStructure (previousHash, motherHash, filesHashes) {
  if (IPFS_CLIENT == null) SetupIPFSAPI()

  let allTheLinks = []

  if (previousHash.length > 0) {
    allTheLinks.push(
      { 'Name':PREVIOUS_HASH_PARAMETER, 'Hash':previousHash, 'Size': 45 }
    )
  }

  if (motherHash.length > 0) {
    allTheLinks.push(
      { 'Name':MOTHER_HASH_PARAMETER, 'Hash': motherHash, 'Size': 42 }
    )
  }

  for (let k in filesHashes) {
    allTheLinks.push(
      { 'Name':filesHashes[k]['name'], 'Hash': k, 'Size': filesHashes[k]['size'] }
    )
  }

  let data = {}
  data.Links = allTheLinks
  data.Data = '\u0008\u0001'

  console.log(data)

  IPFS_CLIENT.object.put(data)
    .then( (response) => {
      console.log(response.toJSON())

    }).catch( (err) => {
      console.log('oops')
      console.log(err)
    })
  return
}

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

window.App = {
  start: function () {
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        console.log(err)
        return
      }

      if (accs.length == 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
        return
      }

      accounts = accs
      account = accounts[0]
      web3.eth.defaultAccount = account
      if (IPFS_CLIENT == null) SetupIPFSAPI()
    })
  },

  updateBlockchainHash: function () {
    let transaction = {
      to: "0x2c41f0a7aDfa683d3D3BBA4DAFd5539Ca34F8961",
      data: 'Mother!'
    }
    web3.eth.sendTransaction(transaction, (err, out) => {
      // We got a transaction, if no error
      if (err != null) {
        console.error(err)
      }

      console.log(out) //transaction published
    })
  },

  uploadFile: function () {
    let uploadForm = document.getElementById('uploadFies')
    if (uploadForm.files.length <= 0) return

    console.log(uploadForm)
    let file = uploadForm.files[0]
    console.log(file.name)
    let reader = new window.FileReader()
    reader.onloadend = () => {
      Upload(reader, file.name).then(() => {
        document.getElementById('fileList').innerText = JSON.stringify(FILES)
      })
    }
    reader.readAsArrayBuffer(file)
  },

  downloadFile: function () {
    let hashForm = document.getElementById('hash')
    console.log(hashForm)
    if (hashForm.value.length > 0) Download(hashForm.value)
  },

  publishChanges: function () {

    let hashForm = document.getElementById('hash')
    if (hashForm.value.length == 0) {
      return BuildHashStructure('', '', FILES)
    }
    // Extract the Mother hash
    IPFS_CLIENT.object.get(hashForm.value)
    .then((x) => {
      let previousObject = x.toJSON()
      let motherHash = ''

      for (let k in previousObject.links) {
        let fileData = previousObject[k]
        if (!fileData) continue
        if (fileData.name === MOTHER_HASH_PARAMETER) {
          motherHash = fileData.name
          break
        }
      }

      // In case there is no mother, the previous hash is used as mother
      if (motherHash === '') motherHash = hashForm.value
      BuildHashStructure(hashForm.value, motherHash, FILES)
    })
  }
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  window.App.start()
})
