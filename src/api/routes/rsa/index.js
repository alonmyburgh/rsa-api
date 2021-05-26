const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { storeKeyById, getKeyById, removeKeyById } = require('../../utils/keyStore');
const keysRoutes = require('./keys.route');
const signRoutes = require('./sign.route');
const verifyRoutes = require('./verify.route');

const router = express.Router();

router.route('/')
/**
   * @api {get} rsa/ Generate
   * @apiDescription Generate new key
   * @apiVersion 1.0.0
   * @apiName Generate
   * @apiGroup rsa
   *
   * @apiSuccess {string} key ID.
   *
 */
.get((req, res) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
    });
    const keyId = uuidv4();
    storeKeyById(keyId, { publicKey, privateKey});
    res.status(200).send({keyId});
})

/**
   * @api {delete} rsa/ delete
   * @apiDescription Delete key by id
   * @apiVersion 1.0.0
   * @apiName Delete
   * @apiGroup rsa
   *
   * @apiParam  {string}         [keyId]     Key ID
   * 
   * @apiSuccess 200 code
   *
   * @apiError (400) Bad request
   * @apiError (404) Resource not found
 */
.delete(body('keyId').isString(), (req, res, next) => {
     try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { keyId } = req.body;
        const isKeyExists = getKeyById(keyId);
        if(!isKeyExists) {
            return res.status(404).send();
        }
        
        removeKeyById(keyId);
     } catch (error) {
         next(error);
     }
    res.status(200).send();
});

router.use('/keys', keysRoutes);
router.use('/sign', signRoutes);
router.use('/verify', verifyRoutes);

module.exports = router;
