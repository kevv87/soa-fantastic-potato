/**
 * @swagger
 * /api/OpenAI:
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
 *@swagger
 * /api/Endpoint:
 *   get:
 *     summary: Get recommendations using Classmates Endpoint
 *     parameters:
 *       - name: endpoint_function
 *         in: query
 *         description: Name of the GET function to call
 *         required: true
 *         schema:
 *           type: string
 *       - name: id
 *         in: query
 *         description: Id
 *         required: true
 *         schema:
 *           type: string
 *       - name: tipo
 *         in: query
 *         description: Name of the type
 *         required: true
 *         schema:
 *           type: string
 *       - name: comida
 *         in: query
 *         description: Name of the food
 *         required: true
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
 *     summary: Get recommendations using Default Responses
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
 */

const { PeerIface, OpenAiIface, DatabaseIface } = require('./interfaces');
const defaultResponses = require('./defaultResponses');

class RecommenderController {
  constructor() {
    this.peer_iface = new PeerIface();
    this.open_ai_iface = new OpenAiIface();
    this.database_iface = new DatabaseIface(defaultResponses);

    // Bind 'this' to each method
    // WA to async functions not having `this`
    // this.get_peer_response = this.get_peer_response.bind(this);
    this.get_open_ai_response = this.get_open_ai_response.bind(this);
    this.get_database_response = this.get_database_response.bind(this);
  }

  async get_peer_response(req, res) {
    const { endpoint_function, id, tipo, comida } = req.query;
    return await this.peer_iface.getRecomendacion(endpoint_function, id, tipo, comida, res);
  }

  async get_open_ai_response(req, res) {
    const { platilloPrincipal, bebida, postre } = req.query;
    res = this.open_ai_iface.getRecomendacion(platilloPrincipal, bebida, postre, res);
  }

  async get_database_response(req, res) {
    const { platilloPrincipal, bebida, postre } = req.query;
    this.database_iface.getRecomendacion(platilloPrincipal, bebida, postre, res);
  }
}

module.exports = { RecommenderController };
