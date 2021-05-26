const express = require('express');
const { getAllKeys } = require('../../utils/keyStore');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} rsa/keys/ List Keys
   * @apiDescription Get a list of keys
   * @apiVersion 1.0.0
   * @apiName ListKeys
   * @apiGroup Keys
   *
   * @apiSuccess {string[]} key List.
   */
  .get((req, res) => {
    res.status(200).send({keys: getAllKeys()});
  })

  module.exports = router;