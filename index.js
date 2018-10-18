'use strict';

const WMATA_API_KEY = process.env.WMATA_API_KEY || 'e13626d03d8e4c03ac07f95541b3091b';
const WMATA_INCIDENTS_URL = 'https://api.wmata.com/Incidents.svc/json/Incidents';

const { dialogflow } = require('actions-on-google');
const functions = require('firebase-functions');
const rp = require('request-promise');

const app = dialogflow({ debug: true });
app.intent('Metro rail status', handleRailStatus);
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

function handleRailStatus(conv) {
  return rp({ uri: WMATA_INCIDENTS_URL, headers: { 'api_key': WMATA_API_KEY}, json: true }).
    then((json) => {
      console.log('WMATA response: ' + JSON.stringify(json));
      conv.close(wmataIncidentsToTextResponse(json.Incidents));
    }, (err) => {
      console.error(err);
      conv.close('There was a problem communicating with WMATA. Please try again later.');
    });
}

function wmataIncidentsToTextResponse(incidents) {
  if(incidents.length === 0) {
    return 'Everything is fine!';
  } else {
    return incidents.map(incident => incident.Description).join('. ');
  }
}
