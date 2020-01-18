module.exports = function parseStringAsArray(arrayAsString){
    /* transforma a string em array e limpa os espaços em branco desnecessarios */
    return  arrayAsString.split(',').map( arrayAsString => arrayAsString.trim());
}

