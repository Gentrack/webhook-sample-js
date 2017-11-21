const bodyParser = require("body-parser");
const crypto = require("crypto");
const express = require("express");

// get your application's public key from the developer portal
const publicKey = process.env.PUBLIC_KEY;
const port = process.env.PORT || 3001;

/*
A signature contains a time stamp and a hash value, in this format:
t=1504742008,v=dVLlVxcw1O/7m4GxeeaxyBxsj9AJpTeSmrdCywD2VsvIxRsB7AqBS9MNscuMYCuXs2/0TUnXgkzVPvWGQw73Jg==
The hash is computed as: hash = HMAC512(timestamp + "." + payload) 
*/
const verifySignature = (signature, key, payload) => {
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
    verifier.update(payload)
    const sigToVerify = digest.substr(2)
    if (!verifier.verify(publicKey, sigToVerify)) {
        throw new Error("Invalid signature");
    }

    return true;
};
const verifyCallback = (req, res, buf, encoding) => {
    const signature = req.headers["x-payload-signature"];
    verifySignature(signature, authToken, buf.toString());
};
const app = express();
app.use(bodyParser.json({
    verifyCallback,
}));
app.post("/webhook", (req, res) => {
    console.log(req.body);
/* 	
	req.body is a JSON object containing BillReady event data, e.g., 
	{
	  "billID": "123455",
	  "accountID": "466",
	  "accountName": "gateway-user",
	  "lastDate": "2017-08-24",
	  "lastBalance": 100,
	  "payments": 88,
	  "credits": 0,
	  "charges": 0,
	  "balance": 122,
	  "balanceDate": "2017-08-24",
	  "overdueAmount": 120,
	  "dueAmount": 0,
	  "dueDate": "2017-08-24",
	  "currency": "NZD"
	}
*/
    res.sendStatus(200);
});
app.listen(port, () => {
    console.log("Webhook started on " + port);
});