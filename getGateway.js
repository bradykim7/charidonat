'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
//const fs = require('fs');
const path = require('path');
//const yaml = require('js-yaml');

// connection.json  설정 해야한다.

// const connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/paperNet.yaml', 'utf8'));
let client = Client.loadFromConfig('cdcn_connection.yaml');

async function main(){

    try{
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        let userId = User1; // wallet's user

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(userId);
        if (!userExists) {
            console.log('An identity for the user '+ userId + ' does not exist in the wallet');
            console.log('Run the registerUserMS.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(client, { wallet, identity: userId, discovery: { enabled: false } });



    }catch(error){
        console.error("ERROR");
        process.exit(1);
    }
}

main();