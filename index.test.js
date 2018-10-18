// console.log = () => {};

const mockRequestPromise = jest.fn()
jest.mock('request-promise', () => {
  return mockRequestPromise;
});

const index = require('./index.js')

const railStatusRequest = {
  body: {
    originalDetectIntentRequest: {
      payload: { user: {} },
      version: '2',
    },
    queryResult: {
      intent: {
        displayName: 'Metro rail status',
      },
      outputContexts: []
    },
  },
  get: () => { return null; },
};

test('input.rail_status responds when getting an error from WMATA', (done) => {
  const expectedSpeech = 'There was a problem communicating with WMATA. Please try again later.'
  const response = responseExpectingSpeech(expectedSpeech, done)
  mockRequestPromise.mockImplementation(() => Promise.reject(new Error('WMATA error')));
  jest.spyOn(console, 'error').mockImplementation();
  index.dialogflowFirebaseFulfillment(railStatusRequest, response);
});

test('input.rail_status responds when getting blank incidents from WMATA', (done) => {
  const response = responseExpectingSpeech('Everything is fine!', done)
  mockRequestPromise.mockImplementation(() => Promise.resolve({ Incidents: [] }));
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
  const expectedSpeech = 'Yellow and Green Lines: Things are happening.' +
    ' Red Line: Things may be happening';
  const response = responseExpectingSpeech(expectedSpeech, done)
  mockRequestPromise.mockImplementation(() => Promise.resolve(wmataIncidentsResponse));
  index.dialogflowFirebaseFulfillment(railStatusRequest, response);
});

function responseExpectingSpeech(expectedSpeech, done) {
  const handleStatus = {
    send: (body) => {
      expect(body).toMatchObject({ speech: expectedSpeech});
      done();
    }
  };
  return {
    append: () => {},
    status: () => { return handleStatus },
  }; 
};
