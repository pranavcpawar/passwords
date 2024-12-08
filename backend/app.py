import os
import json
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from cdp import Cdp, Wallet

app = Flask(__name__)
CORS(app)

seed_file_name = "./encrypted_seed.json"
wallet_file_name = "./wallet.json"

@app.route("/")
def index():
    return "Hello, World!"

@app.route("/api")
def api():
    return "TESTING!"

def generate_wallet() -> Wallet:
    print("Generating wallet...")
    wallet = Wallet.create()
    print(f"Successfully generated wallet: {wallet}")

    print("Persisting wallet...")
    wallet_id_string = json.dumps(wallet.id)
    with open(wallet_file_name, "w") as f:
        f.write(wallet_id_string)
    wallet.save_seed(seed_file_name, encrypt=True)
    print("Successfully persisted wallet.")

    return wallet


def load_wallet():
    print("Importing existing wallet...")

    with open(wallet_file_name, "r") as f:
        wallet_id_string = f.read()
    wallet_id = json.loads(wallet_id_string)
    
    print(f"Successfully loaded wallet: {wallet_id}")

    return 0


# route to generate a new wallet
@app.route("/api/wallet/generate", methods=["POST"])
def api_generate_wallet():
    try:
        load_dotenv()
        api_key_name = os.environ.get("CDP_API_KEY_NAME")
        api_private_key = os.environ.get("CDP_API_KEY_PRIVATE_KEY")

        if not api_key_name or not api_private_key:
            raise ValueError(
                "Please set the CDP_API_KEY_NAME and CDP_API_KEY_PRIVATE_KEY environment variables."
            )

        private_key = api_private_key.replace("\\n", "\n")

        print(f"API Key Name: {api_key_name}")
        print(f"API Key Private Key: {private_key}")

        Cdp.configure(api_key_name, private_key)

        if os.path.exists(seed_file_name) and os.path.exists(wallet_file_name):
            return jsonify({"message": "Wallet already exists."}), 400

        wallet = generate_wallet()

        return (
            jsonify({"message": "Successfully generated wallet.", "wallet": {"address": wallet.addresses[0].address_id, "id": wallet.id}}),
            200,
        )

    except Exception as error:
        return jsonify({"message": f"Error loading .env file: {error}"}), 500


# route to import an existing wallet
@app.route("/api/wallet/load", methods=["GET"])
def api_import_wallet():
    try:
        if os.path.exists(seed_file_name) and os.path.exists(wallet_file_name):
            wallet = load_wallet()
            return (
                jsonify({"message": "Successfully imported wallet.", "wallet": {"address": wallet.addresses[0].address_id, "id": wallet.id}}),
                200,
            )
        else:
            return jsonify({"message": "Wallet not found."}), 404

    except Exception as error:
        return jsonify({"message": f"Error loading .env file: {error}"}), 500


#  route to check wallet status
@app.route("/api/wallet/status", methods=["GET"])
def api_wallet_status():
    if os.path.exists(seed_file_name) and os.path.exists(wallet_file_name):
        wallet = load_wallet()
        return jsonify({"message": "Wallet found.", "wallet": {"address": wallet.addresses[0].address_id, "id": wallet.id}}), 200
    else:
        return jsonify({"message": "Wallet not found."}), 404


if __name__ == "__main__":
    app.run()
