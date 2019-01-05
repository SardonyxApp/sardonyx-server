/**
 * @fileoverview This is a utility to send test messages to any managebac group. 
 * @author SardonyxApp
 * @license MIT
 */

const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

const topic = "Test message from Sardonyx";
const messageWithoutStyle = 'Hello. This is a test message sent through Sardonyx\'s Managebac integration feature. These tests are used to ensure the functionality and stability of Sardonyx when it is shipped. I apologize for any disturbances: please kindly ignore this message. For more information, please visit https://sardonyx.app .';
const messageWithStyle = 'Hello. This is a test message sent through Sardonyx\'s Managebac integration feature. These tests are used to ensure the functionality and stability of Sardonyx when it is shipped. I apologize for any disturbances: please kindly ignore this message. For more information, please visit https://sardonyx.app . \n \n TESTS: \ This line should be a normal text. \n This line should be formatted as a quote. \n This line should be formatted as code. \n This line is a heading. \n This line is a subheading. \n This line is a subsubheading? \n This line should be bold. \n This line should be italicized. \n This line should be striked out. \n This line should be should a list. \n This line should be a list too. \n This line should be linked to sardonyx.app. \n Tables are not going to be supported anytime soon. \n RTL is not going to be supported anytime soon.';
const notifyViaEmail = 0;
const privateMessage = 0;

describe('Send messages', () => {
  test('POST /api/group/:resourceId/messages should send message', done => {
    request(app)
      .post(`/api/group/${process.env.GROUP_ID}/messages`)
      .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
      .set('Message-Data', `{"topic": "${topic}", "body": "${messageWithoutStyle}", "notifyViaEmail": "${notifyViaEmail}", "privateMessage": "${privateMessage}"}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});