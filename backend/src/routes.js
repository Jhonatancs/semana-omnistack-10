const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

/* MÉTODOS HTTP: GET, POST, PUT, DELETE */

/* Tipos de parâmetros 
 * Query params: req.query (filtros, ordenação, páginação, etc...)
 * Route params: req.params (identificar um recurso na alteração ou remoção)
 * Body: req.body (dados para criação ou alteração de um registro)
 */
routes.get('/devs',DevController.index);
routes.post('/devs', DevController.store);
routes.put('/devs', DevController.update);
routes.delete('/devs/:id',DevController.destroy);

routes.get('/search',SearchController.index)

module.exports = routes;