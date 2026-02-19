const prompt = require("prompt-sync")();
const fs = require("fs");
const { calcularRank } = require("./rank");

const DB = "./jogadores.json";

function carregarJogadores() {
    if (!fs.existsSync(DB)) return [];
    return JSON.parse(fs.readFileSync(DB));
}

function salvarJogadores(lista) {
    fs.writeFileSync(DB, JSON.stringify(lista, null, 2));
}

function cadastrarJogador() {
    let nome = prompt("Nome do jogador: ");

    let vitorias = Number(prompt("Vitórias: "));
    let derrotas = Number(prompt("Derrotas: "));

    if (isNaN(vitorias) || isNaN(derrotas)) {
        console.log("❌ Valores inválidos.");
        return;
    }

    const resultado = calcularRank(vitorias, derrotas);

    let jogadores = carregarJogadores();
    jogadores.push({
        nome,
        vitorias,
        derrotas,
        saldo: resultado.saldo,
        nivel: resultado.nivel
    });

    salvarJogadores(jogadores);

    console.log(`\n🏆 ${nome} tem saldo de ${resultado.saldo} e está no nível ${resultado.nivel}\n`);
}

function listarRanking() {
    let jogadores = carregarJogadores();

    if (jogadores.length === 0) {
        console.log("Nenhum jogador cadastrado.");
        return;
    }

    jogadores.sort((a, b) => b.saldo - a.saldo);

    console.log("\n===== RANKING =====");
    jogadores.forEach((j, i) => {
        console.log(`${i+1}º ${j.nome} | Saldo: ${j.saldo} | Nível: ${j.nivel}`);
    });
    console.log("===================\n");
}

function menu() {
    while (true) {
        console.log("===== MENU =====");
        console.log("1 - Cadastrar jogador");
        console.log("2 - Ver ranking");
        console.log("0 - Sair");

        let opcao = prompt("Escolha: ");

        switch (opcao) {
            case "1":
                cadastrarJogador();
                break;
            case "2":
                listarRanking();
                break;
            case "0":
                console.log("Saindo...");
                return;
            default:
                console.log("Opção inválida.");
        }
    }
}

menu();
