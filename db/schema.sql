-- ============================================================
-- 📚 CONCEITO: Schema do banco de dados (PostgreSQL)
--
-- Hierarquia: Curso → Turma → Aluno → Sorteios
--
-- 1) cursos     → ex: "Informática", "Administração"
-- 2) turmas     → ex: "2ºA", vinculada a um curso (curso_id)
-- 3) alunos     → cadastrados dentro de uma turma (turma_id)
-- 4) sorteios   → histórico permanente, sempre referenciando turma_id também
--                 (mesmo sendo derivável via aluno_id, guardamos direto para
--                 facilitar consultas como "histórico da turma X" sem JOIN extra)
--
-- O ciclo de sorteio (fila de rodadas) agora é uma COLUNA em `turmas`
-- (ciclo_atual), porque cada turma tem sua própria fila independente.
--
-- Rode este script depois de criar o banco:
--   psql -U postgres -d sorteador_limpeza -f db/schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS cursos (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS turmas (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(100) NOT NULL,                      -- ex: "2ºA - Manhã"
  curso_id      INT NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  ciclo_atual   INT NOT NULL DEFAULT 1,                      -- fila de rodadas desta turma
  criado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alunos (
  id                  SERIAL PRIMARY KEY,
  nome                VARCHAR(100) NOT NULL,
  turma_id            INT NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  ativo               BOOLEAN NOT NULL DEFAULT TRUE,
  ja_sorteado_ciclo   BOOLEAN NOT NULL DEFAULT FALSE,        -- relativo ao ciclo_atual da turma
  criado_em           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sorteios (
  id            SERIAL PRIMARY KEY,
  aluno_id      INT NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  turma_id      INT NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  ciclo         INT NOT NULL,
  data_sorteio  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_turmas_curso       ON turmas (curso_id);
CREATE INDEX IF NOT EXISTS idx_alunos_turma        ON alunos (turma_id);
CREATE INDEX IF NOT EXISTS idx_sorteios_turma_data ON sorteios (turma_id, data_sorteio DESC);
