-- ============================================================
-- 📚 Banco completo do Sorteador de Limpeza — versão Supabase
--
-- Como usar:
--   1. No Supabase, abra o projeto → SQL Editor → New query
--   2. Cole este arquivo inteiro e clique em Run
--
-- Cria as tabelas (cursos, turmas, alunos, sorteios, usuarios)
-- e o professor master (admin) com a senha padrão 123456.
-- Pode rodar mais de uma vez: nada é apagado nem duplicado.
-- ============================================================

CREATE TABLE IF NOT EXISTS cursos (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS turmas (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(100) NOT NULL,
  curso_id      INT NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
  ciclo_atual   INT NOT NULL DEFAULT 1,
  criado_em     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alunos (
  id                  SERIAL PRIMARY KEY,
  nome                VARCHAR(100) NOT NULL,
  turma_id            INT NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  ativo               BOOLEAN NOT NULL DEFAULT TRUE,
  ja_sorteado_ciclo   BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sorteios (
  id            SERIAL PRIMARY KEY,
  aluno_id      INT NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  turma_id      INT NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  ciclo         INT NOT NULL,
  data_sorteio  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuarios (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  senha_hash  TEXT NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'professor' CHECK (role IN ('admin', 'professor')),
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_turmas_curso       ON turmas (curso_id);
CREATE INDEX IF NOT EXISTS idx_alunos_turma        ON alunos (turma_id);
CREATE INDEX IF NOT EXISTS idx_sorteios_turma_data ON sorteios (turma_id, data_sorteio DESC);

-- ── Segurança (RLS) ──────────────────────────────────────────
-- O Supabase expõe as tabelas do schema "public" numa API pública.
-- Ligando o RLS sem nenhuma política, essa API não consegue ler nada
-- (nem os hashes de senha). O nosso backend conecta como "postgres",
-- que ignora o RLS, então continua funcionando normalmente.
ALTER TABLE cursos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas   ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sorteios ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- ── Professor master (admin) ─────────────────────────────────
-- Senha: 123456 (hash bcrypt abaixo — a senha nunca fica em texto puro)
INSERT INTO usuarios (nome, email, senha_hash, role)
VALUES (
  'Cristina Stanck',
  'cristina.alves@edu.sc.senai.br',
  '$2b$12$n5Ydp/0yz5yZ2IUjnxybp.slpB7iVKaR2m3mjWYRkamZb.OkdLYoe',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
