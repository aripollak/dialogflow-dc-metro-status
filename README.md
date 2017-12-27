# dialogflow-dc-metro-status

This is intended to serve as an interface between Dialogflow (and by extension Alexa and Google Assistant) and WMATA, the Washington, DC metro area transit system..
For this to work properly, you need to enable billing in your Google Cloud account for this project, or else you won't be able to make network requests.

## Setting up on Dialogflow

* Set up a new project on www.dialogflow.com
* Go to the Fulfillment page, and paste the contents of `index.js` and `package.json` into their respective fields.
* Go to the Intents page and add a new intent, with an action of `input.rail_status`, and check "Use webhook" under Fulfillment.
