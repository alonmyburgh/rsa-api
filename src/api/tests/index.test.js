/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../index');

describe('RSA API', () => {
  describe('GET /rsa', () => {
    it('should get new key id', () => {
        return request(app)
        .get('/rsa')
        .send()
        .expect(200)
        .then((res) => {
          expect(res.body.keyId).be.a('string');
        });
    });

    it('should create two more keys', async () => {
        await request(app)
        .get('/rsa')
        .send();
        return request(app)
        .get('/rsa')
        .send()
        .expect(200)
        .then((res) => {
          expect(res.body.keyId).be.a('string');
        });
    });

      it('should get list of three keys', async () => {
        return request(app)
          .get('/rsa/keys')
          .send()
          .expect(200)
          .then((res) => {
            expect(res.body.keys).to.have.lengthOf(3);
          });
      });

      it('should remove one key verify and sign', async () => {
          const allKeysRsp = await request(app)
          .get('/rsa/keys')
          .send();

        await request(app)
          .delete('/rsa')
          .send({keyId: allKeysRsp.body.keys[1]})
          .expect(200);
        
        const allKeysRsp2 = await request(app)
          .get('/rsa/keys')
          .send()
          .expect(200);
          expect(allKeysRsp2.body.keys).to.have.lengthOf(2);

        const signRsp = await request(app)
          .post('/rsa/sign')
          .send({keyId: allKeysRsp2.body.keys[1], data: 'test'})
          .expect(200);
          expect(signRsp.body.signature).be.a('string');

        const VerifyRsp = await request(app)
          .post('/rsa/verify')
          .send({keyId: allKeysRsp2.body.keys[1], data: 'test', signature: signRsp.body.signature})
          .expect(200);
          expect(VerifyRsp.body.verified).to.equal(true);

        const VerifyRsp2 = await request(app)
          .post('/rsa/verify')
          .send({keyId: allKeysRsp2.body.keys[1], data: 'tester', signature: signRsp.body.signature})
          .expect(200);
          expect(VerifyRsp2.body.verified).to.equal(false);
      }); 
  }); 
});
