function calcularMedias(objeto) {
  const novoObjeto = {};

  for (const chave in objeto) {
    if (objeto.hasOwnProperty(chave)) {
      novoObjeto[chave] = {};

      for (const subChave in objeto[chave]) {
        if (objeto[chave].hasOwnProperty(subChave)) {
          if (typeof objeto[chave][subChave] === "number") {
            novoObjeto[chave][subChave] =
              objeto[chave][subChave] / objeto[chave]["numero_jogos"];
          } else {
            novoObjeto[chave][subChave] = objeto[chave][subChave];
          }
        }
      }
    }
  }

  return novoObjeto;
}

function mediaArbitro(objeto) {
  const novoObjeto = {};

  for (const chave in objeto) {
    if (objeto.hasOwnProperty(chave)) {
      if (typeof objeto[chave] === "number") {
        novoObjeto[chave] = objeto[chave] / objeto["jogos_apitados"];
      } else {
        novoObjeto[chave] = objeto[chave];
      }
    }
  }

  return novoObjeto;
}

module.exports = { calcularMedias, mediaArbitro };
