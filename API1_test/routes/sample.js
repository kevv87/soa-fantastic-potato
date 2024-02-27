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

async function main() {
  const completion =  openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });
  return "completion.choices[0]"
  console.log(completion.choices[0]);
}


const interfaceController = {
    
    pickAPI:  function(mode, endpoint) {
        if(mode=="1"){
            const ai_response=main();
          return {
                respuestaPrincipal:"pollo1",
                respuestaPostre: "postre1",
                respuestaBebida: "bebida1",
                endpointo:ai_response
              } //openai
        }
        else if(mode =="2"){
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
    
    pickMode: function(mode, endpoint) {
        if(mode=="0"){
            return {
                respuestaPrincipal:"pollo0",
                respuestaPostre: "postre0",
                respuestaBebida: "bebida0",
              } //base local
        }
        else{
            return interfaceController.pickAPI(mode,endpoint) //controlador de apis
        }
        
    },
  };

router.post('/sample', (req, res) => {
  const { platilloPrincipal,bebida, postre, modo, endpoint } = req.body;

  const respuesta = recomendationController.pickMode(modo,endpoint);
  // Example logic to generate responses based on request
  //const respuestaPrincipal = `Response for Main Dish: ${platilloPrincipal}`;
  //const respuestaPostre = `Response for Dessert: ${postre}`;
  //const respuestaBebida = `Response for Beverage Mode ${modo}: ${endpoint} ${bebida}`;

  res.json(respuesta);
});

module.exports = router;
