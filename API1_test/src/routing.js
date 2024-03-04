const express = require("express");
const router = express.Router();
const { RecommenderController } = require("./controllers");

recomender = new RecommenderController();

// OpenAPI get
router.get("/OpenAI", recomender.get_open_ai_response);
router.get("/DefaultResponses", recomender.get_database_response);
router.get("/Endpoint", recomender.get_endpoint_response);

module.exports = router;
