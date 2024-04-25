const { analiseIndicator } = require("../../analise.json");
const ExcelJS = require("exceljs");
const path = require("path");

exports.generateExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Rodada");

  // Adicione alguns dados ao Excel
  worksheet.addRow([
    "Time",
    "Chance gol",
    "Chance gol local",
    "Gols sofridos totais",
    "Gols sofridos local",
    "Gols totais",
    "Gols local",
    "Adversarios gols sofridos",
    "Adversarios gols sofridos local",
    "Diferença",
    "Diferença local",
  ]);

  for (const match of analiseIndicator) {
    worksheet.addRow([
      match.casa.time,
      match.chanceGolCasa,
      match.chanceGolCasaLocal,
      match.casa.golsSofridosTotais,
      match.casa.golsSofridosLocal,
      match.casa.golsFeitosTotais,
      match.casa.golsFeitosLocal,
      match.fora.golsSofridosTotais,
      match.fora.golsSofridosLocal,
      match.chanceGolCasa >= match.chanceGolFora
        ? match.diferencaChance
        : -match.diferencaChance,
      match.chanceGolCasaLocal >= match.chanceGolForaLocal
        ? match.diferencaLocalChance
        : -match.diferencaLocalChance,
    ]);
  }

  // Salve o arquivo Excel
  const filePath = `${new Date().getTime()}-output.xlsx`;
  await workbook.xlsx.writeFile(filePath);
  console.log(`Arquivo Excel gerado em: ${filePath}`);
};
