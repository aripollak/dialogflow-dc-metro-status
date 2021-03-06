'use strict';

const WMATA_API_KEY = process.env.WMATA_API_KEY || 'e13626d03d8e4c03ac07f95541b3091b';
const WMATA_INCIDENTS_URL = 'https://api.wmata.com/Incidents.svc/json/Incidents';

const { dialogflow } = require('actions-on-google');
const functions = require('firebase-functions');
const rp = require('request-promise-native');

const app = dialogflow({ debug: true });
app.intent('Metro rail status', handleRailStatus);
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

async function handleRailStatus(conv) {
  try {
    const json = await getWmataUrl(WMATA_INCIDENTS_URL, conv)
    conv.close(wmataIncidentsToTextResponse(json.Incidents))
  } catch(err) {
    logAndRespondWithError(err, conv);
  }
}

async function getWmataUrl(url, conv) {
  const json = await
    rp({ uri: WMATA_INCIDENTS_URL, headers: { api_key: WMATA_API_KEY }, json: true });
  console.log('WMATA response: ' + JSON.stringify(json));
  return json;
}

function logAndRespondWithError(err, conv) {
  console.error(err);
  conv.close('There was a problem communicating with WMATA. Please try again later.');
}

function wmataIncidentsToTextResponse(incidents) {
  if(incidents.length === 0) {
    return 'Everything is fine!';
  } else {
    return incidents.map(incident => incident.Description).join(".\n").
      replace(/btwn/g, 'between').replace(/svc/g, 'service');
  }
}
