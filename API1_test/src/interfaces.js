const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN,
});

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Example of an error
class RecomendacionNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.stack = new Error().stack;
    this.httpsCode = 502;
  }
}

class CategoryNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.stack = (new Error()).stack;
        this.httpsCode = 404;
    }
}

class OpenAIError extends Error {
    constructor(message, httpsCode) {
        super(message);
        this.httpsCode = httpsCode;
        this.name = this.constructor.name;
        this.stack = (new Error()).stack;
        
    }
}

class OpenAiIface {
  async _ask_openai(platilloPrincipal, bebida, postre) {
    let my_platillo = 'tengo un platillo principal: ' + platilloPrincipal;
    let my_bebida = 'tengo una bebida: ' + bebida;
    let my_postre = 'tengo un postre: ' + postre;

    let missingValues = [];

    if (!platilloPrincipal) {
      missingValues.push(' platillo principal');
      my_platillo = 'no tengo platillo principal ';
    }

    if (!bebida) {
      missingValues.push(' bebida');
      my_bebida = 'no tengo bebida ';
    }

    if (!postre) {
      missingValues.push(' postre');
      my_postre = 'no tengo postre ';
    }

    // TODO: Esto es un error, pero agarrarlo mas arriba
    if (missingValues.length == 0) {
      return 'Parece que ya tienes tu comida completa, ¡Provecho!';
    }

    const prompt =
      `Hola chat, ${my_platillo} ${my_bebida} ${my_postre},` +
      ` dame una recomendacion para${missingValues}` +
      ` parsea tu respuesta como un json que contenga los siguientes fields:` +
      ` platilloPrincipal, bebida, postre, y como valor una unica palabra` +
      ` con tu recomendacion`;

        // TODO: Aqui tambien el API puede tirarnos errores, como:
        //   - Unathorized - Creditos gastados, etc...
        // Aquí lo que hice fue nada más redirigir los errores que tiraba OpenAI para que no se cayera el servicio
        // y no tener que hacer 1 por 1 porque no tengo un key con créditos para probarlo xd
        try{
            const completion = await openai.chat.completions.create({
                messages: [
                {
                    role: "user",
                    content: prompt,
                },
                ],
                model: "gpt-3.5-turbo",
            });
            console.log(completion.choices[0]["status"]);
            return {
                input: prompt,
                // TODO: Otro error, el JSON de respuesta puede no ser parseable
                // Esto no tengo como probarlo porque no tengo creditos :c
                recomendacion: JSON.parse(completion.choices[0]["message"]["content"])
                
            }
        }catch(error){
            console.log(error.status);
            console.log(error.message);
            throw new OpenAIError(
                `OpenAI failed to do something: ${error.message}`, error.status);
        }
        
        
        
    }

    async getRecomendacion(platilloPrincipal, bebida, postre, res) {
        try{
            const open_ai_res = await this._ask_openai(platilloPrincipal, bebida, postre);
            console.log(open_ai_res);
            res.json(open_ai_res);
        }catch (error) {
            if (error instanceof OpenAIError) {
                console.log(
                    "OpenAPI couldnt send a response ");
                res.status(error.httpsCode);
                res.json({"message":error.message});
                
                res.end();
            } else {
                res.status(500);
                res.end();
                throw error;
            }
            
        }
    }
}

class PeerIface {
  // TODO: Add connection and details to PeerIface
  async getRecomendacion(endpoint_function, id, tipo, comida) {
    const apiUrl = `https://myservice.azurewebsites.net/${endpoint_function}?id=${id}&tipo=${tipo}&comida=${comida}`;

    // Return the promise returned by fetch
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Log the data (you can remove this line if not needed)
      return data;
    } catch (error) {
      // Log the error (you can remove this line if not needed)
      console.error('Fetch error:', error);
      // Propagate the error by rethrowing it
      throw error;
    }
  }
}

class DatabaseIface {
  constructor(defaultResponses) {
    this.defaultResponses = defaultResponses;
  }

    // Obtains responses from the defaultResponses file
    _getPredefinedResponse(category) {
        // Obtains a response depending on the category
        const responses = this.defaultResponses[category];
        if (!responses)
            throw new CategoryNotFoundError(
                `Not found category: ${category}`);
        if (responses.length == 0)
            throw new RecomendacionNotFoundError(
                `There are no recomendations for ${category}`);
        // Random selection from the data
        const randomIndex = Math.floor(Math.random() * responses.length);
        return responses[randomIndex];
    }

  async getRecomendacion(platilloPrincipal, bebida, postre, res) {
    console.log('Attempting to get recomendacion');
    try {
      const respuestaPrincipal = platilloPrincipal
        ? platilloPrincipal
        : this._getPredefinedResponse('platilloPrincipal');

      const respuestaBebida = bebida ? bebida : this._getPredefinedResponse('bebida');

      const respuestaPostre = postre ? postre : this._getPredefinedResponse('postre');

            res.json({
                respuestaPrincipal,
                respuestaPostre,
                respuestaBebida,
            });
            res.status(200);
        } catch (error) {
            if (error instanceof RecomendacionNotFoundError) {
                console.log(
                    "Recomendacion not found, telling requester we couldn't " + 
                    " find the resource");
                res.status(error.httpsCode);
                res.json({"message":error.message});
                console.error(error.message);
                
                res.end();
            }if (error instanceof CategoryNotFoundError) {
                console.log(
                    "Category not found, telling requester we couldn't " + 
                    " find the resource");
                res.status(error.httpsCode);
                res.json({"message":error.message});
                console.error(error.message);
                
                res.end();
            } else {
                res.status(500);
                res.end();
                throw error;
            }
        }
    }
  }
}

module.exports = { PeerIface, OpenAiIface, DatabaseIface };
