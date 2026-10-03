# Digital Signature Virtual Lab

A Virtual Labs-style educational website for **Implement Digital Signatures for Emails**.

## What it does

1. Sender enters an email.
2. Flask generates an RSA 2048-bit key pair.
3. The email is signed using RSA-PSS with SHA-256.
4. The signed email is automatically displayed for the receiver.
5. Receiver verifies the signature.
6. The user can simulate tampering without retyping the email.
7. Verification succeeds for the unchanged message and fails after tampering.

## Requirements

- Python 3.10+
- Node.js 18+

## Run the backend

Open a terminal:

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

Then:

```bash
pip install -r requirements.txt
python app.py
```

The backend runs at:

`http://127.0.0.1:5000`

## Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite address shown in the terminal, normally:

`http://localhost:5173`

## Important

This is an educational demonstration. The backend keeps the current experiment state in memory and is not intended for real email communication or production security.

## Main experiment

Use:

- **Sign & Send Email** to create the signed message.
- **Verify Signature** to verify the unchanged message.
- **Simulate Tampering** to change the received message.
- **Verify Signature** again to observe failure.

## Deployment URL 

```bash
https://digital-signature-cryptography-frontend-114h28f2l-smvitm.vercel.app
```
