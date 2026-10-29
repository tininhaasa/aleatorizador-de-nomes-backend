-- ============================================================
-- 📚 Dados exportados do Neon em 2026-10-22
--
-- Rode DEPOIS do supabase.sql (que cria as tabelas).
-- Os ids originais são mantidos, para não quebrar os vínculos
-- curso → turma → aluno → sorteio. Rodar de novo não duplica nada.
-- ============================================================

BEGIN;

-- cursos (1 registros)
INSERT INTO cursos (id, nome, criado_em) VALUES
  (2, 'Desenvolvimento de Sistemas', '2026-06-25 20:14:09.603558')
ON CONFLICT (id) DO NOTHING;

-- turmas (2 registros)
INSERT INTO turmas (id, nome, curso_id, ciclo_atual, criado_em) VALUES
  (1, 'Vespertino', 2, 2, '2026-06-25 20:18:52.653497'),
  (2, 'Noturno', 2, 3, '2026-06-25 20:18:57.514047')
ON CONFLICT (id) DO NOTHING;

-- alunos (51 registros)
INSERT INTO alunos (id, nome, turma_id, ativo, ja_sorteado_ciclo, criado_em) VALUES
  (1, 'Adilson de Liz Junior', 2, TRUE, TRUE, '2026-06-25 20:27:19.571814'),
  (2, 'Arthur Moreira Pereira', 2, TRUE, TRUE, '2026-06-25 20:27:19.578569'),
  (3, 'Aynoã Andrade Farias da Silva', 2, TRUE, FALSE, '2026-06-25 20:27:19.579867'),
  (4, 'Caua Andrade Velho', 2, TRUE, FALSE, '2026-06-25 20:27:19.581373'),
  (5, 'Ana Luiza', 2, FALSE, FALSE, '2026-06-25 20:27:19.588476'),
  (6, 'Erik Steffen Stanchak', 2, TRUE, FALSE, '2026-06-25 20:27:19.593245'),
  (7, 'Gabriel Mota Antunes Ferreira', 2, TRUE, TRUE, '2026-06-25 20:27:19.597666'),
  (8, 'Bruno Emanoel de Andrade dos Santos', 2, TRUE, TRUE, '2026-06-25 20:27:19.603327'),
  (9, 'Deivid Samuel da Silva Pereira', 2, TRUE, TRUE, '2026-06-25 20:27:19.607461'),
  (10, 'Gustavo Sasso Xavier', 2, TRUE, TRUE, '2026-06-25 20:27:19.611761'),
  (11, 'Gustavo Andrade Lemony', 2, FALSE, FALSE, '2026-06-25 20:27:19.626299'),
  (12, 'Kaue Nahs Schutz', 2, TRUE, TRUE, '2026-06-25 20:27:19.639574'),
  (13, 'Kaio Esser Lopes', 2, TRUE, TRUE, '2026-06-25 20:27:19.641603'),
  (14, 'Lavínia Antunes Koerich', 2, FALSE, FALSE, '2026-06-25 20:27:19.647408'),
  (15, 'João Vitor Souza de Moraes', 2, TRUE, TRUE, '2026-06-25 20:27:19.647529'),
  (16, 'Mabily Diovana de Liz de Souza', 2, FALSE, FALSE, '2026-06-25 20:27:19.650279'),
  (17, 'Maria Eduarda de Pina Cardoso', 2, TRUE, TRUE, '2026-06-25 20:27:19.656082'),
  (18, 'Marina Ferreira Medeiros', 2, FALSE, FALSE, '2026-06-25 20:27:19.689159'),
  (19, 'Mateus do Amarante de Meira', 2, FALSE, TRUE, '2026-06-25 20:27:19.691288'),
  (20, 'Nauhana Cristine Branco da Costa', 2, FALSE, TRUE, '2026-06-25 20:27:19.694931'),
  (21, 'Nicolas Mendes de Campos', 2, TRUE, TRUE, '2026-06-25 20:27:19.697905'),
  (22, 'Ramon Vinicius Knoll', 2, TRUE, TRUE, '2026-06-25 20:27:19.70503'),
  (23, 'Stefani Almeida de Ramos', 2, TRUE, TRUE, '2026-06-25 20:27:19.705933'),
  (24, 'Vinícius Simones', 2, TRUE, TRUE, '2026-06-25 20:27:19.725758'),
  (25, 'Vitor Gabriel dos Santos Coelho', 2, FALSE, FALSE, '2026-06-25 20:27:19.729518'),
  (26, 'Wesley Vargas Teixeira', 2, TRUE, TRUE, '2026-06-25 20:27:19.733134'),
  (27, 'Alison Nunes Machado', 1, TRUE, FALSE, '2026-06-25 20:34:19.50888'),
  (28, 'Allan Petrick Pires Ortiz', 1, TRUE, FALSE, '2026-06-25 20:34:19.515801'),
  (29, 'Ana Beatriz Postai', 1, TRUE, FALSE, '2026-06-25 20:34:19.517262'),
  (30, 'Ana Vitória Medina Anhaia', 1, FALSE, FALSE, '2026-06-25 20:34:19.517708'),
  (31, 'Ana Júlia Spitza Ferrari', 1, TRUE, FALSE, '2026-06-25 20:34:19.520358'),
  (32, 'Arthur Balcker da Silva', 1, TRUE, FALSE, '2026-06-25 20:34:19.52608'),
  (33, 'Carla Vitória Varela Erckmann', 1, TRUE, FALSE, '2026-06-25 20:34:19.542747'),
  (34, 'Arthur dos Santos Hersing', 1, TRUE, FALSE, '2026-06-25 20:34:19.544704'),
  (35, 'Gabriel Marcon', 1, TRUE, FALSE, '2026-06-25 20:34:19.550444'),
  (36, 'Davi Fernandes Mescoito Gomes', 1, TRUE, FALSE, '2026-06-25 20:34:19.552572'),
  (37, 'Elisa Rita Thomas da Silva de Andrade', 1, TRUE, FALSE, '2026-06-25 20:34:19.552825'),
  (38, 'Heloisa Antunes Fausto', 1, TRUE, FALSE, '2026-06-25 20:34:19.566258'),
  (39, 'Gustavo Amaral Kuhnen', 1, TRUE, TRUE, '2026-06-25 20:34:19.576396'),
  (40, 'Igor Bernardo de Andrade Teixeira', 1, TRUE, FALSE, '2026-06-25 20:34:19.578247'),
  (41, 'Helena Antunes', 1, TRUE, FALSE, '2026-06-25 20:34:19.580537'),
  (42, 'Isabela Caroline da Luz de Liz', 1, TRUE, FALSE, '2026-06-25 20:34:19.587735'),
  (43, 'João Henrique Hames de Campos', 1, TRUE, FALSE, '2026-06-25 20:34:19.588494'),
  (44, 'Julia dos Santos da Silva', 1, TRUE, FALSE, '2026-06-25 20:34:19.60116'),
  (45, 'Laura Geovana da Silva Coelho', 1, FALSE, TRUE, '2026-06-25 20:34:19.618004'),
  (46, 'Lauani Mireli Córdova Velho', 1, TRUE, FALSE, '2026-06-25 20:34:19.621517'),
  (47, 'Manuela Eger Pereira', 1, TRUE, TRUE, '2026-06-25 20:34:19.6218'),
  (48, 'Pedro Henrick de Liz Koerich', 1, TRUE, FALSE, '2026-06-25 20:34:19.629616'),
  (49, 'Vinicius Martins Wiggers', 1, TRUE, FALSE, '2026-06-25 20:34:19.632577'),
  (50, 'Nauhana', 2, TRUE, TRUE, '2026-08-20 00:44:07.209378'),
  (51, 'Eduardo Augusto da Cruz Neto', 2, TRUE, FALSE, '2026-08-27 00:43:29.826808')
ON CONFLICT (id) DO NOTHING;

-- sorteios (74 registros)
INSERT INTO sorteios (id, aluno_id, turma_id, ciclo, data_sorteio) VALUES
  (5, 7, 2, 1, '2026-06-25 20:33:04.419891'),
  (6, 4, 2, 1, '2026-06-25 20:33:04.419891'),
  (7, 12, 2, 1, '2026-06-26 00:33:09.515702'),
  (8, 25, 2, 1, '2026-06-26 00:33:09.515702'),
  (9, 9, 2, 1, '2026-06-26 00:34:06.953509'),
  (10, 20, 2, 1, '2026-06-26 00:34:06.953509'),
  (11, 45, 1, 1, '2026-07-01 19:48:17.564295'),
  (12, 37, 1, 1, '2026-07-01 19:48:17.564295'),
  (13, 40, 1, 1, '2026-07-01 19:48:41.729137'),
  (14, 28, 1, 1, '2026-07-01 19:48:41.729137'),
  (17, 21, 2, 1, '2026-07-02 00:31:24.68798'),
  (18, 8, 2, 1, '2026-07-02 00:31:24.68798'),
  (19, 1, 2, 1, '2026-07-02 23:57:55.093218'),
  (20, 13, 2, 1, '2026-07-02 23:57:55.093218'),
  (21, 47, 1, 1, '2026-07-08 20:21:49.157085'),
  (23, 32, 1, 1, '2026-07-08 20:21:59.717727'),
  (25, 3, 2, 1, '2026-07-09 00:19:15.025123'),
  (26, 5, 2, 1, '2026-07-09 00:19:15.025123'),
  (27, 43, 1, 1, '2026-07-09 19:12:13.474238'),
  (28, 44, 1, 1, '2026-07-09 19:12:13.474238'),
  (29, 2, 2, 1, '2026-07-10 00:41:45.040706'),
  (30, 22, 2, 1, '2026-07-10 00:41:45.040706'),
  (31, 15, 2, 1, '2026-07-16 00:08:05.458392'),
  (32, 17, 2, 1, '2026-07-16 00:08:05.458392'),
  (33, 6, 2, 2, '2026-07-16 23:20:41.36208'),
  (34, 17, 2, 2, '2026-07-16 23:20:41.36208'),
  (35, 23, 2, 2, '2026-07-16 23:21:47.435748'),
  (36, 2, 2, 2, '2026-07-16 23:21:47.435748'),
  (37, 22, 2, 2, '2026-07-29 00:34:05.338754'),
  (38, 8, 2, 2, '2026-07-29 00:34:05.338754'),
  (39, 26, 2, 2, '2026-07-29 00:34:48.770328'),
  (40, 3, 2, 2, '2026-07-29 00:34:48.770328'),
  (41, 13, 2, 2, '2026-07-29 00:36:07.098249'),
  (42, 24, 2, 2, '2026-07-29 00:36:07.098249'),
  (43, 20, 2, 2, '2026-07-30 00:40:32.633186'),
  (44, 7, 2, 2, '2026-07-30 00:40:32.633186'),
  (45, 41, 1, 1, '2026-07-30 20:05:38.52927'),
  (46, 42, 1, 1, '2026-07-30 20:05:38.52927'),
  (47, 12, 2, 2, '2026-07-31 00:39:06.600005'),
  (48, 15, 2, 2, '2026-07-31 00:39:06.600005'),
  (49, 19, 2, 2, '2026-07-31 00:39:54.503075'),
  (50, 9, 2, 2, '2026-07-31 00:39:54.503075'),
  (51, 10, 2, 2, '2026-08-05 00:54:18.845869'),
  (52, 1, 2, 2, '2026-08-05 00:54:18.845869'),
  (53, 21, 2, 2, '2026-08-13 00:44:12.421539'),
  (54, 16, 2, 2, '2026-08-13 00:44:12.421539'),
  (55, 5, 2, 2, '2026-08-13 00:44:26.680319'),
  (56, 4, 2, 2, '2026-08-13 00:44:26.680319'),
  (57, 39, 1, 1, '2026-08-19 20:16:07.725798'),
  (58, 34, 1, 1, '2026-08-19 20:16:07.725798'),
  (59, 49, 1, 1, '2026-08-19 21:18:11.168022'),
  (60, 35, 1, 1, '2026-08-19 21:18:11.168022'),
  (61, 22, 2, 3, '2026-08-20 00:50:40.788391'),
  (62, 12, 2, 3, '2026-08-20 00:50:40.788391'),
  (63, 31, 1, 1, '2026-08-26 20:22:18.208949'),
  (64, 27, 1, 1, '2026-08-26 20:22:18.208949'),
  (65, 24, 2, 3, '2026-08-27 00:44:05.989883'),
  (66, 17, 2, 3, '2026-08-27 00:44:05.989883'),
  (67, 38, 1, 1, '2026-09-02 20:28:23.34094'),
  (68, 48, 1, 1, '2026-09-02 20:28:23.34094'),
  (69, 39, 1, 2, '2026-09-15 20:13:00.619218'),
  (70, 47, 1, 2, '2026-09-15 20:13:00.619218'),
  (71, 50, 2, 3, '2026-09-17 00:50:25.578786'),
  (72, 8, 2, 3, '2026-09-17 00:50:25.578786'),
  (73, 21, 2, 3, '2026-09-30 00:47:25.079494'),
  (74, 7, 2, 3, '2026-09-30 00:47:25.079494'),
  (75, 13, 2, 3, '2026-10-01 00:53:37.232289'),
  (76, 9, 2, 3, '2026-10-01 00:53:37.232289'),
  (77, 1, 2, 3, '2026-10-08 00:42:44.62572'),
  (78, 10, 2, 3, '2026-10-08 00:42:44.62572'),
  (79, 15, 2, 3, '2026-10-15 00:46:12.780311'),
  (80, 2, 2, 3, '2026-10-15 00:46:12.780311'),
  (81, 23, 2, 3, '2026-10-21 00:47:09.706761'),
  (82, 26, 2, 3, '2026-10-21 00:47:09.706761')
ON CONFLICT (id) DO NOTHING;

-- Ajusta os contadores de id para continuar depois do maior id importado
SELECT setval(pg_get_serial_sequence('cursos', 'id'), COALESCE((SELECT MAX(id) FROM cursos), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('turmas', 'id'), COALESCE((SELECT MAX(id) FROM turmas), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('alunos', 'id'), COALESCE((SELECT MAX(id) FROM alunos), 0) + 1, false);
SELECT setval(pg_get_serial_sequence('sorteios', 'id'), COALESCE((SELECT MAX(id) FROM sorteios), 0) + 1, false);

COMMIT;
