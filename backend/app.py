from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
import base64

app = Flask(__name__)
CORS(app)

# Educational demo state: one active email experiment at a time.
state = {
    "private_key": None,
    "public_key": None,
    "original_message": None,
    "received_message": None,
    "signature": None,
    "email": None,
}

def signature_to_text(signature: bytes) -> str:
    return base64.b64encode(signature).decode("utf-8")

def public_key_info(public_key):
    numbers = public_key.public_numbers()
    return {
        "algorithm": "RSA",
        "key_size": public_key.key_size,
        "public_exponent": numbers.e,
        "modulus_bits": numbers.n.bit_length(),
    }

@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/api/sign-send")
def sign_send():
    data = request.get_json(silent=True) or {}
    sender = data.get("sender", "").strip()
    receiver = data.get("receiver", "").strip()
    subject = data.get("subject", "").strip()
    message = data.get("message", "")

    if not sender or not receiver or not subject or not message.strip():
        return jsonify({"error": "Please fill in sender, receiver, subject, and message."}), 400

    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    public_key = private_key.public_key()

    # RSA-PSS signs the message using SHA-256.
    signature = private_key.sign(
        message.encode("utf-8"),
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )

    state.update({
        "private_key": private_key,
        "public_key": public_key,
        "original_message": message,
        "received_message": message,
        "signature": signature,
        "email": {
            "sender": sender,
            "receiver": receiver,
            "subject": subject,
        },
    })

    return jsonify({
        "success": True,
        "email": state["email"],
        "received_message": message,
        "signature": signature_to_text(signature),
        "signature_preview": signature_to_text(signature)[:72] + "...",
        "key_info": public_key_info(public_key),
        "steps": [
            "RSA 2048-bit key pair generated.",
            "The email was signed with the RSA private key.",
            "SHA-256 is used by the RSA-PSS signing operation.",
            "The signed email was sent to the receiver."
        ]
    })

@app.post("/api/verify")
def verify():
    if not state["public_key"] or not state["signature"]:
        return jsonify({"error": "Send and sign an email before verification."}), 400

    message = state["received_message"]
    try:
        state["public_key"].verify(
            state["signature"],
            message.encode("utf-8"),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return jsonify({
            "valid": True,
            "message": "Digital signature verified successfully.",
            "details": [
                "The signature matches the received email.",
                "The message has not changed since it was signed.",
                "The sender's signature is authentic for this experiment."
            ]
        })
    except Exception:
        return jsonify({
            "valid": False,
            "message": "Digital signature verification failed.",
            "details": [
                "The received message does not match the signed message.",
                "The email may have been modified after signing.",
                "The signature is not valid for the current message."
            ]
        })

@app.post("/api/tamper")
def tamper():
    if not state["email"]:
        return jsonify({"error": "Send an email before simulating tampering."}), 400

    original = state["received_message"]

    # Deterministic educational tampering: change a common time phrase,
    # otherwise append a clearly visible modification.
    replacements = [
        ("10 AM", "5 PM"),
        ("10:00 AM", "5:00 PM"),
        ("tomorrow", "next week"),
        ("meeting", "cancelled meeting"),
    ]

    modified = original
    for old, new in replacements:
        if old in modified:
            modified = modified.replace(old, new, 1)
            break

    if modified == original:
        modified = original + "\n\n[TAMPERED: Additional unauthorized text]"

    state["received_message"] = modified

    return jsonify({
        "success": True,
        "original_message": state["original_message"],
        "tampered_message": modified,
        "message": "The received email was modified after it was signed."
    })

@app.post("/api/reset")
def reset():
    state.update({
        "private_key": None,
        "public_key": None,
        "original_message": None,
        "received_message": None,
        "signature": None,
        "email": None,
    })
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
