from fastapi import FastAPI, HTTPException
from web3 import Web3
import uvicorn

# Initialize FastAPI app
app = FastAPI()

# Infura or node URL
infura_url = "https://polygon-mainnet.infura.io/v3/"
web3 = Web3(Web3.HTTPProvider(infura_url))

# Check if connected to the EVM node
if not web3.is_connected():
    print('Error connecting to node.')
    exit(1)

# Private key
private_key = ""

# Get account address from private key
account = web3.eth.account.from_key(private_key)
from_address = account.address

# Contract address
contract_address = '0x1fC490c7FD8716A9d20232B6871951e674841b4a'

# Contract ABI
contract_abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_beneficiary",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_orderDataHash",
                "type": "bytes32"
            }
        ],
        "name": "settleQROrderNative",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# Create contract object
my_contract = web3.eth.contract(
    address=contract_address,
    abi=contract_abi
)

@app.post('/resolve_order')
def resolve_order(request: dict):
    # Extract recipient and orderHash from the request
    recipient = request.get("recipient")
    order_hash = request.get("orderHash")

    if not recipient or not order_hash:
        raise HTTPException(status_code=400, detail="Missing recipient or orderHash in request.")

    try:
        # Validate recipient address
        if not web3.is_address(recipient):
            raise HTTPException(status_code=400, detail="Invalid recipient address.")

        # Ensure orderHash is a valid bytes32 format
        if not order_hash.startswith("0x") or len(order_hash) != 66:
            raise HTTPException(status_code=400, detail="Invalid orderHash format. Must be 32 bytes.")

        # Get current nonce for the sender's account
        nonce = web3.eth.get_transaction_count(from_address)

        # Get current gas price
        gas_price = web3.eth.gas_price

        # Build the transaction
        tx = my_contract.functions.settleQROrderNative(
            recipient,
            order_hash
        ).build_transaction({
            'from': from_address,
            'nonce': nonce,
            'gasPrice': gas_price,
            'chainId': web3.eth.chain_id
        })

        # Estimate gas required
        estimated_gas = web3.eth.estimate_gas({
            'from': from_address,
            'to': contract_address,
            'data': tx['data']
        })
        tx['gas'] = estimated_gas

        # Sign the transaction
        signed_tx = web3.eth.account.sign_transaction(tx, private_key=private_key)

        # Send the transaction
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)

        # Return the transaction hash
        return {'tx_hash': tx_hash.hex()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == '__main__':
    # Run the app with uvicorn server
    uvicorn.run(app, host='0.0.0.0', port=8000)
