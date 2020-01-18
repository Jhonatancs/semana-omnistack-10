const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    /* busca os devs */
    async index(req, res) {
        /* Buscar todos os devs num raio de 10k e filtrar por tecnologias */

        const {latitude, longitude, techs } = req.query;
        
        const techsArray = parseStringAsArray(techs);
        
        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry:{
                        type:'Point',
                        coordinates:[longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            }
        }); 

        return res.json({devs});
    }
}