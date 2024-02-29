// routes/sample.js
/**
 * @swagger
 * tags:
 *   name: Sample
 *   description: Sample API
 */
/**
 * @swagger
 * /api/sample:
 *   post:
 *     summary: Get responses based on request
 *     tags: [Sample]
 *     requestBody:
 *       description: Request body
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platilloPrincipal:
 *                 type: string
 *               postre:
 *                 type: string
 *               bebida:
 *                 type: string
 *               modo:
 *                 type: integer
 *               endpoint:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               respuestaPrincipal: "Main Dish Response"
 *               respuestaPostre: "Dessert Response"
 *               respuestaBebida: "Beverage Response"
 */

const defaultResponses = require("./defaultResponses");

const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: "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",
});

/**
 * This function ask to openAI what is a good dish side for an especific dish
 * @param {*} platilloPrincipal string with the name of the dish, it could be a undefine
 * @param {*} bebida string with the name of the dish, it could be a undefine
 * @param {*} postre string with the name of the dish, it could be a undefine
 * @returns a json with openAI answer
 */
async function API_OpenAi(platilloPrincipal, bebida, postre) {
  //IMPORTANTE se debe agregar el prompt para devolver la info en el formato deseado
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "I want a recommendation for an accompaniment to " +
          platilloPrincipal,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0]["message"]["content"];
}

const responseController = {
  /**
   * This function is an interface for the externals API
   * @param {*} platilloPrincipal
   * @param {*} bebida
   * @param {*} postre
   * @returns a json with the especific request
   */

  // Obtains responses from the defaultResponses file
  getPredefinedResponse: function (category) {
    // Obtains a response depending on the category
    const responses = defaultResponses[category] || [];
    // Random selection from the data
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  },

  // Handles the nullable values for default responses
  requestDefaultResponses: function (platilloPrincipal, bebida, postre) {
    respuestaPrincipal = platilloPrincipal
      ? platilloPrincipal
      : responseController.getPredefinedResponse("platilloPrincipal");

    respuestaBebida = bebida
      ? bebida
      : responseController.getPredefinedResponse("bebida");

    respuestaPostre = postre
      ? postre
      : responseController.getPredefinedResponse("postre");

    return {
      respuestaPrincipal,
      respuestaPostre,
      respuestaBebida,
    };
  },

  // Handles the nullable values for classmate response
  requestEndpoint: function (platilloPrincipal, bebida, postre) {
    return {
      respuestaPrincipal: getPredefinedResponse("platilloPrincipal"),
      respuestaPostre: getPredefinedResponse("postre"),
      respuestaBebida: getPredefinedResponse("bebida"),
    };
  },

  // Handles the nullable values for the OpenAPI response
  requestOpenAPI: async function (platilloPrincipal, bebida, postre) {
    const resp = await API_OpenAi(platilloPrincipal, bebida, postre);

    return {
      recomendacion: resp,
    }; //openai
  },
};

// OpenAPI get
router.get("/sample/OpenAPI", async (req, res) => {
  const { platilloPrincipal, bebida, postre } = req.query;

  //se debe definir como identificar si se dieron una o dos opciones (esto puede ser que si uno de los platos viene en blanco se ignora)
  const respuesta = await responseController.requestOpenAPI(
    platilloPrincipal,
    bebida,
    postre
  );
  res.json(respuesta);
});

// Default Responses get
router.get("/sample/DefaultResponses", async (req, res) => {
  const { platilloPrincipal, bebida, postre } = req.query;

  //se debe definir como identificar si se dieron una o dos opciones (esto puede ser que si uno de los platos viene en blanco se ignora)
  const respuesta = await responseController.requestDefaultResponses(
    platilloPrincipal,
    bebida,
    postre
  );
  res.json(respuesta);
});

// Classmates Endpoint get
router.get("/sample/Endpoint", async (req, res) => {
  const { platilloPrincipal, bebida, postre } = req.query;
  //se debe definir como identificar si se dieron una o dos opciones (esto puede ser que si uno de los platos viene en blanco se ignora)
  const respuesta = await responseController.requestEndpoint(
    platilloPrincipal,
    bebida,
    postre
  );

  res.json(respuesta);
});

module.exports = router;
