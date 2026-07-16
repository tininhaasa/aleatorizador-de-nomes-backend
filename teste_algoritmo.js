// Simulação isolada do algoritmo de sorteio (sem banco de dados),
// agora com escopo por turma, para validar que os ciclos de
// turmas diferentes não interferem entre si.
// Rode com: node teste_algoritmo.js

function escolherAleatorios(lista, quantidade) {
  const copia = [...lista];
  const escolhidos = [];
  while (escolhidos.length < quantidade && copia.length > 0) {
    const indice = Math.floor(Math.random() * copia.length);
    escolhidos.push(copia[indice]);
    copia.splice(indice, 1);
  }
  return escolhidos;
}

// `turma` é um objeto { id, ciclo_atual, alunos: [{id, nome, ativo, ja_sorteado_ciclo}] }
function sortear(turma, ausentesIds) {
  const presentes = turma.alunos.filter(a => a.ativo && !ausentesIds.includes(a.id));
  if (presentes.length < 2) throw new Error('Menos de 2 presentes nesta turma');

  let elegiveis = presentes.filter(a => !a.ja_sorteado_ciclo);
  let cicloReiniciado = false;

  if (elegiveis.length < 2) {
    turma.alunos.forEach(a => { if (a.ativo) a.ja_sorteado_ciclo = false; });
    turma.ciclo_atual += 1;
    cicloReiniciado = true;
    elegiveis = presentes;
  }

  if (elegiveis.length < 2) throw new Error('Sem alunos suficientes mesmo após reset');

  const sorteados = escolherAleatorios(elegiveis, 2);
  sorteados.forEach(a => { a.ja_sorteado_ciclo = true; });

  return { sorteados: sorteados.map(a => a.nome), ciclo: turma.ciclo_atual, cicloReiniciado };
}

function criarTurma(id, nomes) {
  return {
    id,
    ciclo_atual: 1,
    alunos: nomes.map((nome, i) => ({ id: i + 1, nome, ativo: true, ja_sorteado_ciclo: false })),
  };
}

// ── TESTE 1: duas turmas avançam em ciclos DIFERENTES sem se misturar ──
console.log('=== TESTE 1: turmas independentes ===');
const turmaA = criarTurma('A', ['Ana', 'Bruno', 'Carla', 'Diego']);       // 4 alunos
const turmaB = criarTurma('B', ['Elis', 'Fábio', 'Gustavo', 'Helena', 'Igor', 'Julia']); // 6 alunos

// Turma A: só 2 sorteios já fecha o ciclo (4 alunos / 2 por sorteio)
let r = sortear(turmaA, []);
console.log(`Turma A sorteio 1: ${r.sorteados.join(' e ')} | ciclo ${r.ciclo}`);
r = sortear(turmaA, []);
console.log(`Turma A sorteio 2: ${r.sorteados.join(' e ')} | ciclo ${r.ciclo}`);
r = sortear(turmaA, []); // deve reiniciar o ciclo aqui (ciclo 2)
console.log(`Turma A sorteio 3: ${r.sorteados.join(' e ')} | ciclo ${r.ciclo}${r.cicloReiniciado ? ' (REINICIADO)' : ''}`);

// Turma B: ainda no ciclo 1 (6 alunos, só sorteamos 1 vez = 2 de 6)
r = sortear(turmaB, []);
console.log(`Turma B sorteio 1: ${r.sorteados.join(' e ')} | ciclo ${r.ciclo}`);

console.log(`\nEstado final: Turma A está no ciclo ${turmaA.ciclo_atual}, Turma B está no ciclo ${turmaB.ciclo_atual}`);
console.assert(turmaA.ciclo_atual === 2, 'FALHA: Turma A deveria estar no ciclo 2');
console.assert(turmaB.ciclo_atual === 1, 'FALHA: Turma B deveria continuar no ciclo 1');
console.log('✅ Ciclos avançam de forma independente por turma:', turmaA.ciclo_atual === 2 && turmaB.ciclo_atual === 1);

// ── TESTE 2: ausência não afeta a fila, e é isolada por turma ──
console.log('\n=== TESTE 2: ausência não afeta a fila ===');
const turmaC = criarTurma('C', ['Ana', 'Bruno', 'Carla', 'Diego']);
let r1 = sortear(turmaC, [4]); // Diego ausente
console.log('Sorteio 1 (Diego ausente):', r1.sorteados);
const diego = turmaC.alunos.find(a => a.nome === 'Diego');
console.assert(diego.ja_sorteado_ciclo === false, 'FALHA: Diego não deveria estar marcado');
console.log('✅ Diego continua elegível mesmo ausente:', diego.ja_sorteado_ciclo === false);

console.log('\nTodos os testes executados.');
