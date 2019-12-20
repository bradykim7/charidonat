'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// connection.json  설정 해야한다.
/*
const connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/paperNet.yaml', 'utf8'));
const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
*/
async function main(){

    try{
        // Wallet
        const walletPath = path.join(process.cwd(), 'wallet')
        const wallet = new FileSystemWallet(walletPath);
        const credPath = '/Users/mskim/go/src/github.com/ChariDonat/crypto-config/peerOrganizations/charidonatchain.com/users/User1@charidonatchain.com/msp'
        const cert = fs.readFileSync(path.join(credPath, '/signcerts/User1@charidonatchain.com-cert.pem')).toString();
        const key = fs.readFileSync(path.join(credPath, '/keystore/5a657f0f30a9964e2e715d723eab25f0f4af27e3961807b8a060ac43893fec10_sk')).toString();

        const identityLabel = 'User1@charidonatchain.com';
        const identity = X509WalletMixin.createIdentity('charidonatchainMSP', cert, key);

        await wallet.import(identityLabel, identity);


    }catch(error){
        console.error("ERROR");
        process.exit(1);
    }
}

main();