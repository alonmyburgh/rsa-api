const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { getKeyById } = require('../../utils/keyStore');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} rsa/verify/ Verify
   * @apiDescription Verify Data with key
   * @apiVersion 1.0.0
   * @apiName VerifyData
   * @apiGroup Verify
   * 
   * @apiParam  {String}             keyId     Key ID
   * @apiParam  {String}             signature User's signature
   * @apiParam  {String}             data      User's data
   *
   * @apiSuccess {boolean} is verified.
   * 
   * @apiError (400) Bad request
   * @apiError (404) Resource not found
   */
  .post(body('keyId').isString(), body('data').isString(), body('signature').isString(), (req, res, next) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { keyId, data, signature } = req.body;
        const sign = Buffer.from(signature, 'base64');
        const keyObject = getKeyById(keyId);
        if(!keyObject) {
            return res.status(404).send();
        }
        try {
            const isVerified = crypto.verify(
                "sha256",
                Buffer.from(data),
                {
                    key: keyObject.publicKey,
                    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                },
                sign
            )

            res.status(200).send({ verified: isVerified });
        } catch (error) {
            next(error);
        }        
  })

  module.exports = router;