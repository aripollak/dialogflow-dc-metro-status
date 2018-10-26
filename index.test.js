console.log = () => {};

const mockRequestPromise = jest.fn()
jest.mock('request-promise', () => {
  return mockRequestPromise;
});

const index = require('./index.js')

test('input.rail_status responds when getting an error from WMATA', (done) => {
  const expectedSpeech = 'There was a problem communicating with WMATA. Please try again later.'
  mockRequestPromise.mockImplementation(() => Promise.reject(new Error('WMATA error')));
  jest.spyOn(console, 'error').mockImplementation();
  const response = responseExpectingSpeech(expectedSpeech, done)
  index.dialogflowFirebaseFulfillment(railStatusRequest, response);
});

test('input.rail_status responds when getting blank incidents from WMATA', (done) => {
  mockRequestPromise.mockImplementation(() => Promise.resolve({ Incidents: [] }));
  const response = responseExpectingSpeech('Everything is fine!', done)
  index.dialogflowFirebaseFulfillment(railStatusRequest, response);
});

test('input.rail_status responds when getting non-blank incidents from WMATA', (done) => {
  const wmataIncidentsResponse = {
    Incidents: [
      {
        DateUpdated: "2018-01-06T07:35:57",
        Description: "Yellow and Green Lines: Things are happening",
        IncidentID: '6884D379-5075-493E-92E9-646EA90B10A6',
        IncidentType: "Alert",
        LinesAffected: "YL; GL;",
      },
      {
        DateUpdated: "2018-01-06T07:35:58",
        Description: "Red Line: Things may be happening",
        IncidentID: '6884D379-5075-493E-92E9-646EA90B10A7',
        IncidentType: "Alert",
        LinesAffected: "RL;",
      },
    ]
  };
  mockRequestPromise.mockImplementation(() => Promise.resolve(wmataIncidentsResponse));

  const expectedSpeech = 'Yellow and Green Lines: Things are happening.' +
    ' Red Line: Things may be happening';
  const response = responseExpectingSpeech(expectedSpeech, done)
  index.dialogflowFirebaseFulfillment(railStatusRequest, response);
});

const railStatusRequest = {
  body: {
    originalDetectIntentRequest: {
      payload: {},
    },
    queryResult: {
      intent: {
        displayName: 'Metro rail status',
      },
    },
  },
  get: () => {},
  headers: {},
}

function responseExpectingSpeech(expectedSpeech, done) {
  const result = {
    send: (body) => {
      expect(body).toMatchObject(expectedResponseBody(expectedSpeech));
      done();
    },
    setHeader: () => {},
  };

  result.status = () => { return result };
  return result;
}

function expectedResponseBody(speech) {
  return {
    payload: {
      google: {
        richResponse: {
          items: [{
            simpleResponse: {
              textToSpeech: speech}
          }]
        }
      }
    }
  };
}
