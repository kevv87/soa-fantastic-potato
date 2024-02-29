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
   * @param {*} mode this string could be 1 or 2, 1 for an openAI request, 2 for an external API request
   * @param {*} endpoint this param could be a undefine, but the function is to especify a endpoint for an external API
   * @returns a json with the especific request
   */

  getPredefinedResponse: function (category) {
    // Obtener una respuesta predeterminada según la categoría (postre, plato principal, bebida)
    const responses = defaultResponses[category] || [];
    // Elegir una respuesta aleatoria
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  },

  requestDefaultResponses: function (platilloPrincipal, bebida, postre) {
    return {
      respuestaPrincipal:
        responseController.getPredefinedResponse("platilloPrincipal"),
      respuestaPostre: responseController.getPredefinedResponse("postre"),
      respuestaBebida: responseController.getPredefinedResponse("bebida"),
    };
  },

  requestEndpoint: function (platilloPrincipal, bebida, postre) {
    return {
      respuestaPrincipal: getPredefinedResponse("platilloPrincipal"),
      respuestaPostre: getPredefinedResponse("postre"),
      respuestaBebida: getPredefinedResponse("bebida"),
    };
  },

  requestOpenAPI: async function (platilloPrincipal, bebida, postre) {
    const resp = await API_OpenAi(platilloPrincipal, bebida, postre);
    return {
      respuestaPrincipal: "pollo1",
      respuestaPostre: "postre1",
      respuestaBebida: "bebida1",
      recomendacion: resp,
    }; //openai
  },
};

router.get("/sample/OpenAPI", async (req, res) => {
  const { platilloPrincipal, bebida, postre } = req.query;

  console.log("Platillo Principal", platilloPrincipal);
  console.log("Bebida", bebida);
  console.log("Postre", postre);

  //se debe definir como identificar si se dieron una o dos opciones (esto puede ser que si uno de los platos viene en blanco se ignora)
  const respuesta = await responseController.requestOpenAPI(
    platilloPrincipal,
    bebida,
    postre
  );
  res.json(respuesta);
});

router.get("/sample/DefaultResponses", async (req, res) => {
  const { platilloPrincipal, bebida, postre } = req.query;

  console.log("Platillo Principal", platilloPrincipal);
  console.log("Bebida", bebida);
  console.log("Postre", postre);

  //se debe definir como identificar si se dieron una o dos opciones (esto puede ser que si uno de los platos viene en blanco se ignora)
  const respuesta = await responseController.requestDefaultResponses(
    platilloPrincipal,
    bebida,
    postre
  );
  res.json(respuesta);
});

router.get("/sample/Endpoint", async (req, res) => {
  const { platilloPrincipal, bebida, postre } = req.query;

  console.log("Platillo Principal", platilloPrincipal);
  console.log("Bebida", bebida);
  console.log("Postre", postre);

  //se debe definir como identificar si se dieron una o dos opciones (esto puede ser que si uno de los platos viene en blanco se ignora)
  const respuesta = await responseController.requestEndpoint(
    platilloPrincipal,
    bebida,
    postre
  );

  res.json(respuesta);
});

module.exports = router;
