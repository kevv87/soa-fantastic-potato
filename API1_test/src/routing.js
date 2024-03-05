const express = require('express');
const router = express.Router();
const { RecommenderController } = require('./controllers');

recomender = new RecommenderController();

// OpenAPI get
<<<<<<< HEAD
router.get('/OpenAI', recomender.get_open_ai_response);
router.get('/DefaultResponses', recomender.get_database_response);
router.get('/Endpoint', async (req, res) => res.send(await recomender.get_peer_response(req, res)));
=======
router.get("/OpenAI", recomender.get_open_ai_response);
router.get("/DefaultResponses", recomender.get_database_response);
router.get("/Endpoint", recomender.get_peer_response);
>>>>>>> origin/error_handling

module.exports = router;
