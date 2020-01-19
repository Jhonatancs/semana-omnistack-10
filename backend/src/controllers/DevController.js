const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const {findConnections, sendMessage } = require('../webSocket');

/**
 * funcoes: index, show, update, destroy
 */

 /* async espera a função estar completa antes de prosseguir */
module.exports = {
   
    /* função para listar os devs */
    async index(req, res){
        const devs = await Dev.find();
        return res.json(devs);
    },
    /* função para salvar o dev no DB */
    async store(req, res){
        
        /* pega os campos enviados */
        const { github_username, techs, latitude, longitude} = req.body;

        /* verifica se este dev ja está cadastrado */
        let dev = await Dev.findOne({github_username});

        if(!dev){
            /* faz a requisição na API do github para pegar os dados do dev */
            apiRes = await axios.get(`https://api.github.com/users/${github_username}`);
            
            /* pega os campos que retornaram da requisição */
            const { name = login, avatar_url, bio } = apiRes.data;

            /* transforma a string em array e limpa os espaços em branco desnecessarios */
            const techsArray = parseStringAsArray(techs);
            
            /* monta o array da localização */
            const location = {
                type: 'Point',
                coordinates:[longitude,latitude]
            }
            
            /* salva o dev no DB */
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            /**
             * filtrar as conexoes que estão há no maximo 10km de distancia
             * e que o novo dev tenha pelo menos uma das tecnologias filtradas
             */
            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techsArray,
            );

            sendMessage(sendSocketMessageTo,'new-dev', dev );
        }
        
        /* retorna o resultado para o client */
        return res.send(dev);
    },
    /* atualiza um dev */
    async update(req, res){

        /* pega os campos enviados */
        const { id, name, techs, latitude, longitude } = req.body;

        const pegaDev = Dev.findOne({_id: id});

        /* faz a requisição na API do github para pegar os dados do dev */
        apiRes = await axios.get(`https://api.github.com/users/${pegaDev.github_username}`);

        /* pega os campos que retornaram da requisição */
        const { avatar_url, bio } = apiRes.data;

        /* transforma a string em array e limpa os espaços em branco desnecessarios */
        const techsArray = parseStringAsArray(techs);

        /* monta o array da localização */
        const location = {
            type: 'Point',
            coordinates:[longitude,latitude]
        }

        /* atualiza os dados do dev no DB */
        const update = await Dev.update({_id:id},{ 
            name,
            bio,
            avatar_url,
            location,
            techs:techsArray
        });

        /* retorna o resultado para o client */
        return res.send(update);
    },
    /* deleta um dev */
    async destroy(req, res){
        
        const id = req.params.id;
        const d = await Dev.deleteOne({_id: id});
        
        /* se houver linha deletada */
        if(d.deletedCount == 1){
            return res.json({status:1,msg: "Dev deletado com sucesso"});
        }else{
            return res.json({status:0,msg: "Este Dev nao existe"});
        }
    }
};