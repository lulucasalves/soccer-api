function criarObjetoDinamico(lista) {
  const objetoDinamico = {};

  for (const item of lista) {
    const chave = Object.keys(item)[0];
    const valor = item[chave];
    objetoDinamico[chave] = valor;
  }

  return objetoDinamico;
}

module.exports = { criarObjetoDinamico };
