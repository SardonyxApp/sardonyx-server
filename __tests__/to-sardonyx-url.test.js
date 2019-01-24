/**
 * @fileoverview Test the toSardonyxUrl helper function to ensure that every possible url is converted correctly 
 * @author SardonyxApp
 * @license MIT 
 */

const { toSardonyxUrl } = require('../helpers/helpers');

require('dotenv').config();

describe('Dashboard', () => {
  test('/student', done => {
    expect(toSardonyxUrl('/student')).toBe('/api/dashboard');
    done();
  });
});

describe('Classes', () => {
  test('/student/classes/:resourceId/overview', done => {
    expect(toSardonyxUrl(`/student/classes/${process.env.CLASS_ID}`)).toBe(`/api/class/${process.env.CLASS_ID}/overview`);
    done();
  });

  test('/student/classes/:resourceId/assignments', done => {
    expect(toSardonyxUrl(`/student/classes/${process.env.CLASS_ID}/assignments`)).toBe(`/api/class/${process.env.CLASS_ID}/assignments`);
    done();
  });

  test('/student/classes/:resourceId/discussions', done => {
    expect(toSardonyxUrl(`/student/classes/${process.env.CLASS_ID}/discussions`)).toBe(`/api/class/${process.env.CLASS_ID}/messages`);
    done();
  });
});

describe('Groups', () => {
  test('/student/groups/:resourceId/overview', done => {
    expect(toSardonyxUrl(`/student/groups/${process.env.CLASS_ID}`)).toBe(`/api/group/${process.env.CLASS_ID}/overview`);
    done();
  });

  test('/student/groups/:resourceId/discussions', done => {
    expect(toSardonyxUrl(`/student/groups/${process.env.CLASS_ID}/discussions`)).toBe(`/api/group/${process.env.CLASS_ID}/messages`);
    done();
  });
});

describe('Assignments or events', () => {
  test('/student/classes/:resourceId/assignments/:subresourceId', done => {
    expect(toSardonyxUrl(`/student/classes/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)).toBe(`/api/class/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`);
    done();
  });

  test('/student/ib/events/:resourceId/', done => {
    expect(toSardonyxUrl(`/student/ib/events/${process.env.EVENT_ID}`)).toBe(`/api/event/${process.env.EVENT_ID}`);
    done();
  });

  // Not testing class events here, because none have existed.

  test('/student/groups/:resourceId/events/:subresourceId', done => {
    expect(toSardonyxUrl(`/student/groups/${process.env.GROUP_ID}/events/${process.env.GROUP_EVENT_ID}`)).toBe(`/api/group/${process.env.GROUP_ID}/events/${process.env.GROUP_EVENT_ID}`);
    done();
  })
});

describe('Messages', () => {
  test('/student/classes/:resourceId/discussions/:subresourceId', done => {
    expect(toSardonyxUrl(`/student/classes/${process.env.CLASS_ID}/discussions/${process.env.CLASS_MESSAGE_ID}`)).toBe(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}`);
    done();
  });

  test('/student/groups/:resourceId/discussions/:subresourceId', done => {
    expect(toSardonyxUrl(`/student/groups/${process.env.GROUP_ID}/discussions/${process.env.GROUP_MESSAGE_ID}`)).toBe(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}`);
    done();
  });

  test('/student/classes/:resourceId/discussions/:subresourceId/replies', done => {
    expect(toSardonyxUrl(`/student/classes/${process.env.CLASS_ID}/discussions/${process.env.CLASS_MESSAGE_ID}/replies`)).toBe(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}/reply`);
    done();
  });

  test('/student/groups/:resourceId/discussions/:subresourceId/replies', done => {
    expect(toSardonyxUrl(`/student/groups/${process.env.GROUP_ID}/discussions/${process.env.GROUP_MESSAGE_ID}/replies`)).toBe(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}/reply`);
    done();
  });

  // reply id is not an env variable
  test('/student/classes/:resourceId/discussions/:subresourceId/replies/:subitemId', done => {
    expect(toSardonyxUrl(`/student/classes/${process.env.CLASS_ID}/discussions/${process.env.CLASS_MESSAGE_ID}/replies/123456`)).toBe(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}/reply/123456`);
    done();
  });

  test('/student/groups/:resourceId/discussions/:subresourceId/replies/:subitemId', done => {
    expect(toSardonyxUrl(`/student/groups/${process.env.GROUP_ID}/discussions/${process.env.GROUP_MESSAGE_ID}/replies/123456`)).toBe(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}/reply/123456`);
    done();
  });
});

describe('CAS', () => {
  test('/student/ib/activity/cas', done => {
    expect(toSardonyxUrl('/student/ib/activity/cas')).toBe('/api/cas');
    done();
  });

  test('/student/ib/activity/cas/:casId', done => {
    expect(toSardonyxUrl(`/student/ib/activity/cas/${process.env.CAS_ID}`)).toBe(`/api/cas/${process.env.CAS_ID}/overview`);
    done();
  });

  test('/student/ib/activity/cas/:casId/answers', done => {
    expect(toSardonyxUrl(`/student/ib/activity/cas/${process.env.CAS_ID}/answers`)).toBe(`/api/cas/${process.env.CAS_ID}/answers`);
    done();
  });

  test('/student/ib/activity/cas/:casId/reflections', done => {
    expect(toSardonyxUrl(`/student/ib/activity/cas/${process.env.CAS_ID}/reflections`)).toBe(`/api/cas/${process.env.CAS_ID}/reflections`);
    done();
  });

  // reflection id is not an env variable 
  test('/student/ib/activity/cas/:casId/reflections/:subresourceId', done => {
    expect(toSardonyxUrl(`/student/ib/activity/cas/${process.env.CAS_ID}/reflections/123456`)).toBe(`/api/cas/${process.env.CAS_ID}/reflections/123456`);
    done();
  });
});