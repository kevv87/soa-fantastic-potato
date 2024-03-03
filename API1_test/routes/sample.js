// routes/sample.js
/**
 * @swagger
 * /api/OpenAPI:
 *   get:
 *     summary: Get recommendations using OpenAI
 *     parameters:
 *       - name: platilloPrincipal
 *         in: query
 *         description: Name of the main dish
 *         required: false
 *         schema:
 *           type: string
 *       - name: bebida
 *         in: query
 *         description: Name of the beverage
 *         required: false
 *         schema:
 *           type: string
 *       - name: postre
 *         in: query
 *         description: Name of the dessert
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               recomendacion: "Your Default Responses recommendation"
 *
 *
 * @swagger
 * /api/DefaultResponses:
 *   get:
 *     summary: Get recommendations using OpenAI
 *     parameters:
 *       - name: platilloPrincipal
 *         in: query
 *         description: Name of the main dish
 *         required: false
 *         schema:
 *           type: string
 *       - name: bebida
 *         in: query
 *         description: Name of the beverage
 *         required: false
 *         schema:
 *           type: string
 *       - name: postre
 *         in: query
 *         description: Name of the dessert
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               recomendacion: "Your Default Responses recommendation"
 */

const defaultResponses = require("./defaultResponses");

const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: "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",
});

/**
 * This function ask to openAI what is a good side dish for a especific dish
 * @param {*} platilloPrincipal string with the name of the main dish, it could be undefined
 * @param {*} bebida string with the name of the drink, it could be undefined
 * @param {*} postre string with the name of the dessert, it could be undefined
 * @returns a json with openAI answer
 */

async function API_OpenAi(platilloPrincipal, bebida, postre) {
  // IMPORTANTE: Agregar el prompt para devolver la información en el formato deseado

  let my_platillo = "tengo un platillo principal: " + platilloPrincipal;
  let my_bebida = "tengo una bebida: " + bebida;
  let my_postre = "tengo un postre: " + postre;

  let missingValues = [];

  if (!platilloPrincipal){
    missingValues.push(" platillo principal");
    (my_platillo = "no tengo platillo principal ");
  }

  if (!bebida) {
    missingValues.push(" bebida");
    my_bebida = "no tengo bebida ";
  }
  
  if (!postre) {
    missingValues.push(" postre");
    my_postre = "no tengo postre ";
  }

  if(missingValues.length == 0){
    return "Parece que ya tienes tu comida completa, ¡Provecho!";
  }

  const prompt = `Hola chat, ${my_platillo} ${my_bebida} ${my_postre}, dame una recomendacion para${missingValues}`;
    console.log(prompt);


  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return {
    input: prompt,
    recomendacion: completion.choices[0]["message"]["content"]
  }
};

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

    return resp //openai
  },
};

// OpenAPI get
router.get("/OpenAPI", async (req, res) => {
  const { platilloPrincipal, bebida, postre } = req.query;

  const respuesta = await responseController.requestOpenAPI(
    platilloPrincipal,
    bebida,
    postre
  );
  res.json(respuesta);
});

// Default Responses get
router.get("/DefaultResponses", async (req, res) => {
  try {
    const { platilloPrincipal, bebida, postre } = req.query;

    const respuesta = await responseController.requestDefaultResponses(
      platilloPrincipal,
      bebida,
      postre
    );
    res.json(respuesta);
  } catch (error) {
    console.error("Error in /DefaultResponses:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Classmates Endpoint get
router.get("/Endpoint", async (req, res) => {
  const { platilloPrincipal, bebida, postre } = req.query;
  const respuesta = await responseController.requestEndpoint(
    platilloPrincipal,
    bebida,
    postre
  );

  res.json(respuesta);
});

module.exports = router;
