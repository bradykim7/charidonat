# Building network 

# Reset 
docker kill $(docker ps -qa)
docker rm $(docker ps -qa)
docker volume rm $(docker volume ls)

# Generate Certificate using cryptogen
./bin/cryptogen generate --config=./crypto-config.yaml


# Setting Env
export FABRIC_CFG_PATH=$PWD
export CHANNEL_NAME=cdcn-channel

# Genereate Orderer Gensis Block
./bin/configtxgen -profile SampleDevModeKafka -channelID cdcn-channel -outputBlock ./channel-artifacts/genesis.block

# Generating channel configuration
./bin/configtxgen -profile SampleDevModeKafka -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

# Update Anchor Peer 
## -asOrg argument MSP ID, and not name.
./bin/configtxgen -profile SampleDevModeKafka -outputAnchorPeersUpdate ./channel-artifacts/org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg org1MSP
./bin/configtxgen -profile SampleDevModeKafka -outputAnchorPeersUpdate ./channel-artifacts/charidonatchainMSPanchors.tx -channelID $CHANNEL_NAME -asOrg charidonatchainMSP
./bin/configtxgen -profile SampleDevModeKafka -outputAnchorPeersUpdate ./channel-artifacts/animalloveMSPanchors.tx -channelID $CHANNEL_NAME -asOrg animalloveMSP

# Starting the Network 
docker-compose -f docker-compose.yaml up -d
docker-compose -f docker-compose-kafka.yaml up -d 

docker exec -it cli bash
# Creating the Channel 
# "< Don't Need to do >'
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/charidonatchain.com/users/Admin@charidonatchain.com/msp
CORE_PEER_ADDRESS=peer0.charidonatchain.com:7051
CORE_PEER_LOCALMSPID=charidonatchainMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/charidonatchain.com/peers/peer0.charidonatchain.com/tls/ca.crt
peer channel create -o orderer3.charidonatorderer.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/charidonatorderer.com/orderers/orderer3.charidonatorderer.com/msp/tlscacerts/tlsca.charidonatorderer.com-cert.pem

# Entering channel which is already exists 
# charidonatchain.com
export CHANNEL_NAME=cdcn-channel
peer chaincode install -n cdcn-channel -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/node
peer channel join -b ./channel-artifacts/genesis.block

# animallove.com
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/animallove.com/users/Admin@animallove.com/msp
CORE_PEER_ADDRESS=peer0.animallove.com:9051
CORE_PEER_LOCALMSPID=animalloveMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/animallove.com/peers/peer0.animallove.com/tls/ca.crt
peer channel join -b ./channel-artifacts/genesis.block

# org1.com
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/Admin@org1.com/msp
CORE_PEER_ADDRESS=ChildPeer.org1.com:11051
CORE_PEER_LOCALMSPID=org1MSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/peers/ChildPeer.org1.com/tls/ca.crt
peer channel join -b ./channel-artifacts/genesis.block

# When you want to New Updaiting Anchor peer 
peer channel update -o orderer3.charidonatorderer.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/charidonatchainMSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/charidonatorderer.com/orderers/orderer3.charidonatorderer.com/msp/tlscacerts/tlsca.charidonatorderer.com-cert.pem

# Install ChainCode
# Charidonatchain
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/charidonatchain.com/users/Admin@charidonatchain.com/msp
CORE_PEER_ADDRESS=peer0.charidonatchain.com:7051
CORE_PEER_LOCALMSPID=charidonatchainMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/charidonatchain.com/peers/peer0.charidonatchain.com/tls/ca.crt
peer chaincode install -n chaincode -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/node

CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/charidonatchain.com/users/Admin@charidonatchain.com/msp
CORE_PEER_ADDRESS=peer1.charidonatchain.com:8051
CORE_PEER_LOCALMSPID=charidonatchainMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/charidonatchain.com/peers/peer1.charidonatchain.com/tls/ca.crt
peer chaincode install -n chaincode -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/node

# Animallove
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/animallove.com/users/Admin@animallove.com/msp
CORE_PEER_ADDRESS=peer0.animallove.com:9051
CORE_PEER_LOCALMSPID=animalloveMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/animallove.com/peers/peer0.animallove.com/tls/ca.crt
peer chaincode install -n chaincode -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/node

CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/animallove.com/users/Admin@animallove.com/msp
CORE_PEER_ADDRESS=peer1.animallove.com:10051
CORE_PEER_LOCALMSPID=animalloveMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/animallove.com/peers/peer1.animallove.com/tls/ca.crt
peer chaincode install -n chaincode -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/node

# Org1
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/Admin@org1.com/msp
CORE_PEER_ADDRESS=ChildPeer.org1.com:11051
CORE_PEER_LOCALMSPID=org1MSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/peers/ChildPeer.org1.com/tls/ca.crt
peer chaincode install -n chaincode -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/node

CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/users/Admin@org1.com/msp
CORE_PEER_ADDRESS=ChildPeer.org1.com:11051
CORE_PEER_LOCALMSPID=org1MSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.com/peers/ChildPeer.org1.com/tls/ca.crt
peer chaincode install -n chaincode -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/node

# Instantiate ChainCode
peer chaincode instantiate -o orderer3.charidonatorderer.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/charidonatorderer.com/orderers/orderer3.charidonatorderer.com/msp/tlscacerts/tlsca.charidonatorderer.com-cert.pem -C $CHANNEL_NAME -n chaincode -l node -v 1.0 -c '{"Args":["init","a", "100", "b","200"]}' -P "AND ('org1MSP.peer','animalloveMSP.peer','charidonatchainMSP.peer')"

# Invoke ChainCode
peer chaincode invoe -o orderer.example.com:7050 --tls true 
--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem 
-C $CHANNEL_NAME -n mycc 
--peerAddresses peer0.org1.example.com:9051 
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt 
--peerAddresses peer0.org2.example.com:9051 
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt 
-c '{"Args":["invoke","a","b","10"]}'

# Query ChainCode
peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["query","a"]}'

# 
