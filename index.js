'use strict';

const WMATA_API_KEY = 'e13626d03d8e4c03ac07f95541b3091b';
const WMATA_INCIDENTS_URL = 'https://api.wmata.com/Incidents.svc/json/Incidents'

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const rp = require('request-promise');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));

  let actionMap = new Map();
  actionMap.set('input.rail_status', handleRailStatus);

  app.handleRequest(actionMap);
});

function handleRailStatus(app) {
    rp({ uri: WMATA_INCIDENTS_URL, headers: { 'api_key': WMATA_API_KEY}, json: true }).
        then((json) => {
            console.log('WMATA response: ' + JSON.stringify(json));
            app.tell(wmataIncidentsToTextResponse(json.Incidents));
        }).catch(err => console.error(err));
}
  
function wmataIncidentsToTextResponse(incidents) {
    if(incidents.length === 0) {
        return 'No incidents reported';
    } else {
        return incidents.map(incident => incident.Description).join('. ');
    }
}
