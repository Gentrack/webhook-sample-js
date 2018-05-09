# Webhook Example in JavaScript
Node.js is required to run this sample application. The installer can be downloaded from [here](https://nodejs.org/en/).
## Clone this repository and enter the source directory:
```
git clone git@github.com:Gentrack/webhook-sample-js.git ~/webhook-app
cd ~/webhook-app

```
## Install package dependency:
```
npm install
```
## Import the public key for an application
Every Gentrack Platform event payload is signed using a private key assigned to an application. The webhook can use the application's public key to validate the signature, to verify the signer and the signed payload content.

The public key for an application can be found on the `Basic Information` page under `App Settings` for the application from the developer portal.
* Import the key by passing an environment variable `PUBLIC_KEY` to the webhook, or 
* Save the key to a file by the name of `pubkey.pem` in the current directory. 

## Start a development server:
```
npm start
```
The webhook will now process requests at the endpoint: `http://localhost:3001/webhook`
## Appendix: Test webhook locally using ngrok
1. Download [ngrok](https://ngrok.com/) for your operating system.
2. Start ngrok on http port 3001, taking note of the https forwarding URL from the console.
```
ngrok http 3001
```
4. Log in to the developer portal and create a new application. On the *Event Subscription* page, subscribe to events to test and set the endpoint URL to the ngrok https forwarding URL: e.g., `https://7d55765d.ngrok.io/webhook`.
5. Start webhook as per instructions above.
6. Send test events using the simulator from the *Event Subscription* page on the developer portal. Check event payload from the webhook.
