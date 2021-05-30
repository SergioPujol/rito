const assert = require('assert');
const app = require('../../src/app');

describe('\'ritos\' service', () => {
  it('registered the service', () => {
    const service = app.service('ritos');

    assert.ok(service, 'Registered the service');
  });
});
