const { PeerIface, OpenAiIface, DatabaseIface } = require("./interfaces");
const defaultResponses = require("./defaultResponses");

class RecommenderController {
    constructor() {
        this.peer_iface = new PeerIface();
        this.open_ai_iface = new OpenAiIface();
        this.database_iface = new DatabaseIface(defaultResponses);

        // Bind 'this' to each method
        // WA to async functions not having `this`
        this.get_peer_response = this.get_peer_response.bind(this);
        this.get_open_ai_response = this.get_open_ai_response.bind(this);
        this.get_database_response = this.get_database_response.bind(this);
    }

    async get_peer_response (req, res) {
        res = this.peer_iface.get(req, res);
    }

    async get_open_ai_response (req, res) {
        const { platilloPrincipal, bebida, postre } = req.query;
        res = this.open_ai_iface.getRecomendacion(
            platilloPrincipal, bebida, postre, res);
    }

    async get_database_response (req, res) {
        const { platilloPrincipal, bebida, postre } = req.query;
        this.database_iface.getRecomendacion(
            platilloPrincipal, bebida, postre, res);
    }
}

module.exports = { RecommenderController };
