/**
 * @fileoverview Test the toManagebacxUrl helper function to ensure that every possible url is converted correctly 
 * @author SardonyxApp
 * @license MIT 
 */

const { toManagebacUrl } = require('../helpers/helpers');

require('dotenv').config();

describe('Dashboard', () => {
  test('/student', done => {
    expect(toManagebacUrl('/api/dashboard')).toBe('/student');
    done();
  });
});

describe('Classes', () => {
  test('/student/classes/:resourceId/overview', done => {
    expect(toManagebacUrl(`/api/class/${process.env.CLASS_ID}/overview`)).toBe(`/student/classes/${process.env.CLASS_ID}`);
    done();
  });

  test('/student/classes/:resourceId/assignments', done => {
    expect(toManagebacUrl(`/api/class/${process.env.CLASS_ID}/assignments`)).toBe(`/student/classes/${process.env.CLASS_ID}/assignments`);
    done();
  });

  test('/student/classes/:resourceId/discussions', done => {
    expect(toManagebacUrl(`/api/class/${process.env.CLASS_ID}/messages`)).toBe(`/student/classes/${process.env.CLASS_ID}/discussions`);
    done();
  });
});

describe('Groups', () => {
  test('/student/groups/:resourceId/overview', done => {
    expect(toManagebacUrl(`/api/group/${process.env.CLASS_ID}/overview`)).toBe(`/student/groups/${process.env.CLASS_ID}`);
    done();
  });

  test('/student/groups/:resourceId/discussions', done => {
    expect(toManagebacUrl(`/api/group/${process.env.CLASS_ID}/messages`)).toBe(`/student/groups/${process.env.CLASS_ID}/discussions`);
    done();
  });
});

describe('Assignments or events', () => {
  test('/student/classes/:resourceId/assignments/:subresourceId', done => {
    expect(toManagebacUrl(`/api/class/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)).toBe(`/student/classes/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`);
    done();
  });

  test('/student/ib/events/:resourceId/', done => {
    expect(toManagebacUrl(`/api/event/${process.env.EVENT_ID}`)).toBe(`/student/ib/events/${process.env.EVENT_ID}`);
    done();
  });

  // Not testing class events here, because none have existed.

  test('/student/groups/:resourceId/events/:subresourceId', done => {
    expect(toManagebacUrl(`/api/group/${process.env.GROUP_ID}/events/${process.env.GROUP_EVENT_ID}`)).toBe(`/student/groups/${process.env.GROUP_ID}/events/${process.env.GROUP_EVENT_ID}`);
    done();
  })
});

describe('Messages', () => {
  test('/student/classes/:resourceId/discussions/:subresourceId', done => {
    expect(toManagebacUrl(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}`)).toBe(`/student/classes/${process.env.CLASS_ID}/discussions/${process.env.CLASS_MESSAGE_ID}`);
    done();
  });

  test('/student/groups/:resourceId/discussions/:subresourceId', done => {
    expect(toManagebacUrl(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}`)).toBe(`/student/groups/${process.env.GROUP_ID}/discussions/${process.env.GROUP_MESSAGE_ID}`);
    done();
  });

  test('/student/classes/:resourceId/discussions/:subresourceId/replies', done => {
    expect(toManagebacUrl(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}/reply`)).toBe(`/student/classes/${process.env.CLASS_ID}/discussions/${process.env.CLASS_MESSAGE_ID}/replies`);
    done();
  });

  test('/student/groups/:resourceId/discussions/:subresourceId/replies', done => {
    expect(toManagebacUrl(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}/reply`)).toBe(`/student/groups/${process.env.GROUP_ID}/discussions/${process.env.GROUP_MESSAGE_ID}/replies`);
    done();
  });

  // reply id is not an env variable
  test('/student/classes/:resourceId/discussions/:subresourceId/replies/:subitemId', done => {
    expect(toManagebacUrl(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}/reply/123456`)).toBe(`/student/classes/${process.env.CLASS_ID}/discussions/${process.env.CLASS_MESSAGE_ID}/replies/123456`);
    done();
  });

  test('/student/groups/:resourceId/discussions/:subresourceId/replies/:subitemId', done => {
    expect(toManagebacUrl(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}/reply/123456`)).toBe(`/student/groups/${process.env.GROUP_ID}/discussions/${process.env.GROUP_MESSAGE_ID}/replies/123456`);
    done();
  });
});

describe('CAS', () => {
  test('/student/ib/activity/cas', done => {
    expect(toManagebacUrl('/api/cas')).toBe('/student/ib/activity/cas');
    done();
  });

  test('/student/ib/activity/cas/:casId', done => {
    expect(toManagebacUrl(`/api/cas/${process.env.CAS_ID}/overview`)).toBe(`/student/ib/activity/cas/${process.env.CAS_ID}`);
    done();
  });

  test('/student/ib/activity/cas/:casId/answers', done => {
    expect(toManagebacUrl(`/api/cas/${process.env.CAS_ID}/answers`)).toBe(`/student/ib/activity/cas/${process.env.CAS_ID}/answers`);
    done();
  });

  test('/student/ib/activity/cas/:casId/reflections', done => {
    expect(toManagebacUrl(`/api/cas/${process.env.CAS_ID}/reflections`)).toBe(`/student/ib/activity/cas/${process.env.CAS_ID}/reflections`);
    done();
  });

  // reflection id is not an env variable 
  test('/student/ib/activity/cas/:casId/reflections/:subresourceId', done => {
    expect(toManagebacUrl(`/api/cas/${process.env.CAS_ID}/reflections/123456`)).toBe(`/student/ib/activity/cas/${process.env.CAS_ID}/reflections/123456`);
    done();
  });
});