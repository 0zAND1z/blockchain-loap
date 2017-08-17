// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'

// IPFS STUFF

import ipfsAPI from 'ipfs-api'
let IPFS_CLIENT = null
let DEFAULT_IPFS_GATEWAY_ADDR = 'http://localhost:8080'
let FILES = {}

function SetupIPFSAPI (...args) {
  IPFS_CLIENT = ipfsAPI(...args)
  return IPFS_CLIENT
}

function Upload (reader, filename){
  if (IPFS_CLIENT == null) SetupIPFSAPI()
  let ipfsId
  const buffer = Buffer.from(reader.result)
  return IPFS_CLIENT.add(buffer)
    .then((response) => {
      console.log(response)
      ipfsId = response[0].hash
      FILES[ipfsId] = filename
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
