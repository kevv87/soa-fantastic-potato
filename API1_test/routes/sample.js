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


const express = require('express');
const router = express.Router();
const {OpenAI}=require("openai");
const openai = new OpenAI({apiKey : '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'});
/**
 * This function ask to openAI what is a good dish side for an especific dish
 * @param {*} platilloPrincipal string with the name of the dish, it could be a undefine 
 * @param {*} bebida string with the name of the dish, it could be a undefine 
 * @param {*} postre string with the name of the dish, it could be a undefine 
 * @returns a json with openAI answer 
 */
async function API_OpenAi(platilloPrincipal, bebida, postre) { //IMPORTANTE se debe agregar el prompt para devolver la info en el formato deseado
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "I want a recommendation for an accompaniment to "+platilloPrincipal}],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0]["message"]["content"];
}


const interfaceController = {
    /**
     * This function is an interface for the externals API
     * @param {*} platilloPrincipal 
     * @param {*} bebida 
     * @param {*} postre 
     * @param {*} mode this string could be 1 or 2, 1 for an openAI request, 2 for an external API request
     * @param {*} endpoint this param could be a undefine, but the function is to especify a endpoint for an external API
     * @returns a json with the especific request
     */
    pickAPI: async function(platilloPrincipal, bebida, postre,mode, endpoint) {
        if(mode=="1"){
            const resp = await API_OpenAi(platilloPrincipal,bebida,postre);
            return {
                respuestaPrincipal:"pollo1",
                respuestaPostre: "postre1",
                respuestaBebida: "bebida1",
                recomendacion: resp
              } //openai
        }
        else if(mode =="2"){ //IMPORTANTE se debe realizar la conexión con API externo 
            return {
                respuestaPrincipal:"pollo2",
                respuestaPostre: "postre2",
                respuestaBebida: "bebida2",
                endpointo:endpoint
              } //api externo
        }
        
    },
  };

const recomendationController = {
    /**
     * This interface controls if the request is in the local data base or with an external API
     * @param {*} platilloPrincipal 
     * @param {*} bebida 
     * @param {*} postre 
     * @param {*} mode 
     * @param {*} endpoint 
     * @returns a json with the response
     */
    pickMode: function(platilloPrincipal, bebida, postre,mode, endpoint) {
        if(mode=="0"){
            return {
                respuestaPrincipal:platilloPrincipal,
                respuestaPostre: postre,
                respuestaBebida: bebida,
              } //IMPORTANTE se debe agregar la base local o el diccionario 
        }
        else{
            return  interfaceController.pickAPI(platilloPrincipal, bebida, postre,mode,endpoint) //controlador de apis
        }
        
    },
  };

router.post('/sample', async (req, res) => {
  const { platilloPrincipal,bebida, postre, modo, endpoint } = req.body;
  //se debe definir como identificar si se dieron una o dos opciones (esto puede ser que si uno de los platos viene en blanco se ignora)
  const respuesta = await recomendationController.pickMode(platilloPrincipal, bebida, postre,modo,endpoint);

  res.json(respuesta);
});

module.exports = router;
