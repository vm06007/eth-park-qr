import requests

url = 'http://localhost:8000/resolve_order'

data = {
    'recipient': '0x641AD78BAca220C5BD28b51Ce8e0F495e85Fe689',
    'orderHash': '0x775eeba77f520181bbda9b9442a72f5f531ee171593e44cedd0d2cd6b5ce34b8',
}

response = requests.post(url, json=data)
print(response.json())