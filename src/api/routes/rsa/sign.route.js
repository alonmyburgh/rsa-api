const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { getKeyById } = require('../../utils/keyStore');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} rsa/sign/ Sign
   * @apiDescription Sign Data with key
   * @apiVersion 1.0.0
   * @apiName SignData
   * @apiGroup Sign
   * 
   * @apiParam  {String}             keyId     Key ID
   * @apiParam  {String}             data      User's data
   *
   * @apiSuccess {string} signature.
   * 
   * @apiError (400) Bad request
   * @apiError (404) Resource not found
   */
  .post(body('keyId').isString(), body('data').isString(), (req, res, next) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { keyId, data } = req.body;
        const keyObject = getKeyById(keyId);
        if(!keyObject) {
            return res.status(404).send();
        }
        try {
            const signature = crypto.sign("sha256", Buffer.from(data), {
                key: keyObject.privateKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            });

            res.status(200).send({ signature: signature.toString("base64") });
        } catch (error) {
            next(error);
        }        
  })

  module.exports = router;