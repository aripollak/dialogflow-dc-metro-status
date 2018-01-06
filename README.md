# Dialogflow DC Metro Status

This is intended to serve as an interface between Dialogflow (and by extension Google Assistant and others) and WMATA, the Washington, DC metro area transit system. You can try it out on [Google Assistant](https://assistant.google.com/services/a/id/13d16a79cba9362e) or on [the web](https://bot.dialogflow.com/f955895b-484e-4690-a71b-80d7eb8bc1ee).

To run this yourself, you must enable billing in your Google Cloud account for this project, or else you won't be able to make network requests.

## Setting up on Dialogflow

* Create a new project on [Dialogflow](https://www.dialogflow.com)
* Go to the Fulfillment page, and replace the conents of `index.js` and `package.json` with the files from this repository.
* Go to the Intents page and add a new intent with an action of `input.rail_status`, and check "Use webhook" under Fulfillment.

## Developing & testing locally

* Install npm or yarn
* Run `npm install` or `yarn install`
* Run `npm test` or `yarn test`
