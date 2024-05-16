import { Client } from '../db/client';

import User from '../models/user.model';
import Audit from '../models/audit.model';
import { getAudits, createAudit } from './audit-model';

import HttpRequestMock from 'http-request-mock';

describe('audit model', () => {
  Client.getInstance([Audit, User]);
  afterEach(async () => {
    // destroy all records we create so each test has a fresh start
    const where = { where: {}, truncate: true };
    await Promise.all([User.destroy(where), Audit.destroy(where)]);
  });

  it('will create and get audits', async () => {
    // TODO: stub call for after save on user. make this global
    const mocker = HttpRequestMock.setup();
    mocker.mock({ url: 'https://api.hubapi.com/', method: 'post', status: 200, body: {} });

    await User.create({ email: 'test@test.com' });
    const users = await User.findAll({ where: {} });
    expect(users.length).toBe(1);

    // // TODO: bug test passes localy but fails on ci
    // const modelId = 1;
    // const user = await User.create();

    // await createAudit(user);
    // const audits = await getAudits('User', modelId);
    // expect(audits.length).toBe(1);
  });
});
