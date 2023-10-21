const vars = {
  identificador_do_calendario: ".sportName", // Onde encontro se carregou ou não a página
  tabela_do_calendario: ".sportName.soccer", // Onde fica a tabela principal do calendário
  celula_calendario_partida: ".event__match", // Onde fica o card inteiro que possui os dados
  time_de_casa_calendario: ".event__participant--home", // Onde fica o time de casa no card
  time_de_fora_calendario: ".event__participant--away", // Onde fica o time de fora no card
  resumo_pre_jogo_identificador: ".container__detailInner", // Identificador de resumo pré jogo
  nome_resumo_participante_casa:
    ".duelParticipant__home .participant__participantName", // Nome do participante de casa
  nome_resumo_participante_fora:
    ".duelParticipant__away .participant__participantName", // Nome do participante de fora
  resumo_arbitro:
    ".matchInfoData .matchInfoItem:nth-child(1) .matchInfoItem__value", // Arbitro que irá apitar o jogo
  resumo_estadio:
    ".matchInfoData .matchInfoItem:nth-child(2) .matchInfoItem__value", // Estadio onde acontecera o jogo
  identificador_tabela_brasileirao: ".tableWrapper", // Tabela do brasileirao
  participante_brasileirao: ".tableCellParticipant__block", // Onde fica o link do time com nome e escudo
  logo_participante_brasileirao: ".tableCellParticipant__image", // Logo do time
  identificador_resultados_time: ".sportName", // Identificador do time em resultados
  partida_resultados_time: ".event__match--static", // Card com informações de partidas
  analise_de_jogo_identificador: "#detail .section", // Identificador de analise de jogo
  analise_resultados_jogo: ".detailScore__wrapper span", // Onde fica o resultado da partida
  filtro_analise_jogo: ".filter__group", // Filtro de análise de jogos
  estatistica_cards: "._row_1gfjz_9", // Cards de estatisticas
  estatistica_card_nome: "._categoryName_11si3_5", // Cards de estatisticas nome
  estatistica_card_valor_casa: "._homeValue_v26p1_10", // Cards de estatisticas valor casa
  estatistica_card_valor_fora: "._awayValue_v26p1_14", // Cards de estatisticas valor fora
  identificador_formacao: ".lf__header.section__title", // Identificador de formação
  formacao_valor: ".lf__headerPart", // Valores das formações
  eventos_indentificador: ".smv__verticalSections", // Identificador de eventos
  lista_eventos_casa: ".smv__participantRow.smv__homeParticipant", // Lista de eventos que ocorrem em casa
  evento_gol_casa: ".smv__incidentHomeScore", // Evento de gol em casa
  lista_eventos_fora: ".smv__participantRow.smv__awayParticipant", // Lista de eventos que ocorrem fora
  evento_gol_fora: ".smv__incidentAwayScore", // Evento de gol fora
  evento_cartao: ".card-ico", // Evento cartão
  evento_gol_anulado: ".var", // Evento de gol anulado
  evento_assistencia: ".smv__assist a", // Evento de assistencia de jogador
  evento_nome_jogador_envolvido: ".smv__playerName div", // Nome do jogador do evento
  evento_identificador_gol_contra: ".smv__subIncident", // Gol contra identificador
  evento_identificador_cartao_amarelo: ".yellowCard-ico", // Cartão amarelo identificador
};

module.exports = { vars };
