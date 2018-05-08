# Webhook Example in JavaScript
Node.js is required to run this sample application. The installer can be downloaded from [here](https://nodejs.org/en/).
## Clone this repository and enter the source directory:
```
git clone git@github.com:Gentrack/webhook-sample-js.git ~/webhook-app
cd ~/webhook-app

```
## Install page dependency:
```
npm install
```
## Save the public key for an application

The public key for an application can be found on the `Basic Information` page under `App Settings`.
Save the key to a file called `pubkey.pem` in the current directory.

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
