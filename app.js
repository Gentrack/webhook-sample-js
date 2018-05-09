const bodyParser = require("body-parser");
const crypto = require("crypto");
const express = require("express");
const fs=require("fs");
const port = process.env.PORT || 3001;

let publicKey = process.env.PUBLIC_KEY;
if(publicKey == null) {
    try {
        publicKey = String(fs.readFileSync("pubkey.pem"));
    } catch(e) {
        console.error("Failed to load public key: " + e)
        console.info("Must provide a public key to verify payload signature.")
        process.exit(1);
    }
}
/*
A signature contains a time stamp and a payload signature, in this format:
t=1504742008,v=dVLlVxcw1O/7m4GxeeaxyBxsj9AJpTeSmrdCywD2VsvIxRsB7AqBS9MNscuMYCuXs2/0TUnXgkzVPvWGQw73Jg==
The timestamp is the Unix time of the moment when the signature is created.
The signature is a private key signature of the SHA512 hash of the concatenation of the timestamp, a dot and the payload data.
The signature itself is Base64 encoded.

To verify a signature, we need:
- Obtain the public key for the application from the Developer Portal.
- Use the public key to verify the SHA512 hash of "timestamp + "." + payload". 
*/

const verifySignature = (signature, publicKey, payload) => {
    if (!signature) {
        throw new Error("Empty signature");
    }
    const parts = signature.split(",");
    if (parts.length !== 2) {
        throw new Error("Invalid format");
    }
    const timestamp = parts[0];
    const digest = parts[1];
    if (timestamp.substr(0, 2) !== "t=") {
        throw new Error("Invalid timestamp");
    }
    const t = Number(timestamp.substr(2, timestamp.length));
    if (isNaN(t)) {
        throw new Error("Invalid timestamp");
    }
    const now = new Date().getTime();
    if (t * 1000 >= now) {
        throw new Error("Timestamp validation error");
    }
    const verifier = crypto.createVerify("sha512")
    verifier.update(t + ".");
    verifier.update(payload)
    const sigToVerify = digest.substr(2)
    if (!verifier.verify(publicKey, sigToVerify, "base64")) {
        throw new Error("Invalid signature");
    }
    return true;
};
const verifyCallback = (req, res, buf, encoding) => {
    const signature = req.headers["x-payload-signature"];
    verifySignature(signature, publicKey, buf.toString());
    console.log("Webhook signature verified");
};
const app = express();
app.use(bodyParser.json({
    verify: verifyCallback,
}));
app.post("/webhook", (req, res) => {
    // req.body contains an event JSON payload
    console.log(req.body);
    res.sendStatus(200);
});
app.listen(port, () => {
    console.log("Webhook started on " + port);
});
