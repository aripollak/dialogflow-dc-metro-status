# dialogflow-dc-metro-status

This is intended to serve as an interface between Dialogflow (and by extension Alexa and Google Assistant) and WMATA, the Washington, DC metro area transit system. You can try it out on [Google Assistant](https://assistant.google.com/services/a/id/13d16a79cba9362e) or on [the web](https://bot.dialogflow.com/f955895b-484e-4690-a71b-80d7eb8bc1ee).

To run this yourself, you need to enable billing in your Google Cloud account for this project, or else you won't be able to make network requests.

## Setting up on Dialogflow

* Set up a new project on www.dialogflow.com
* Go to the Fulfillment page, and paste the contents of `index.js` and `package.json` into their respective fields.
* Go to the Intents page and add a new intent, with an action of `input.rail_status`, and check "Use webhook" under Fulfillment.
