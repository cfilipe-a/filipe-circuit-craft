# Instruções para IA — Criação e Edição de Projetos no Portfólio

Este documento orienta a IA responsável por criar ou atualizar páginas individuais de projetos neste portfólio estático (React + Vite + TanStack Start).

**Regra fundamental:** o dono do portfólio não programa as páginas manualmente. A IA conduz toda a coleta por conversa, propõe a estrutura, aguarda confirmação e executa toda a implementação técnica no código.

---

## 1. Papel da IA e regras de conduta

1. **Inspecione o repositório antes de alterar qualquer arquivo:**
   - Verifique a branch atual (`git branch --show-current`). Só trabalhe na branch solicitada pelo usuário e nunca altere a `main` diretamente sem autorização explícita.
   - Leia `AGENTS.md` (regras de dependências via `bun.lock` e histórico git — nunca rode `npm install` nem faça commit de `package-lock.json`).
   - Leia os arquivos reais do sistema de projetos:
     - `src/data/projects/types.ts`
     - `src/data/projects/index.ts`
     - `src/data/projects/modelo.ts`
     - `src/components/project/ProjectTemplate.tsx`
     - `src/components/project/ProjectBlocks.tsx`
     - `src/components/project/Lightbox.tsx`
     - `src/routes/projetos.$slug.tsx`
     - `vite.config.ts`
2. **Converse antes de codar:**
   - Colete as informações por meio de perguntas objetivas, **preferencialmente uma por vez**, sem sobrecarregar o usuário.
   - Solicite os arquivos reais do projeto (fotos, diagramas, PDFs, vídeos locais, trechos de código/firmware, links de repositório) conforme forem necessários para os blocos escolhidos.
3. **Nunca invente informações:**
   - Não crie métricas, resultados numéricos, especificações de hardware, nomes de componentes, URLs de repositórios ou links de PDF que não tenham sido fornecidos ou confirmados pelo usuário.
   - Se um dado não existir ou não estiver disponível, omita o campo/bloco correspondente ou registre explicitamente como pendência antes de publicar.
4. **Proposta e confirmação obrigatórias:**
   - Após coletar as informações e materiais, apresente ao usuário uma **proposta de composição da página** (cabeçalho, ordem dos blocos selecionados, layout da galeria, tratamento de documentos/vídeo/código, necessidade ou não de bloco customizado, e configuração na Home) e **aguarde a confirmação explícita** antes de editar os arquivos.
5. **Preserve a identidade visual:**
   - Utilize os tokens editoriais existentes em `src/styles.css` (`ed-bg`, `ed-bg2`, `ed-line`, `ed-line-strong`, `ed-fg`, `ed-muted`, `ed-accent`, `ed-ink`) e componentes existentes.
   - Não adicione botões ou links externos no cabeçalho do projeto (`ProjectTemplate.tsx`). Links externos ficam exclusivamente dentro de seus blocos (`documents` e `code`).
   - Não adicione novas dependências sem autorização prévia do usuário via Lovable (`AGENTS.md`).

---

## 2. Roteiro conversacional recomendado (uma pergunta por vez)

Conduza a coleta seguindo esta sequência adaptável (pulando o que não se aplicar):

1. **Identidade básica:** Nome do projeto, slug desejado para a URL (`/projetos/<slug>`), categoria (`"Hardware & PCB"`, `"Embarcados"` ou `"Dados"`), estágio (`"Lab / Protótipo"`, `"Validado em Bancada"` ou `"Em Produção"`) e resumo curto (1–2 frases).
2. **Metadados do cabeçalho (opcional):** Até 4 itens curtos (ex.: Ano, MCU/Plataforma, Ferramentas, Status).
3. **Imagem de capa (opcional):** Qual imagem principal deve abrir a página e se haverá legenda técnica.
4. **Seleção e ordem dos blocos:** Pergunte quais blocos fazem sentido para este projeto e em qual ordem devem aparecer:
   - Visão geral (`overview`)
   - Especificações técnicas (`specs`)
   - Galeria (`gallery`)
   - Esquemático / documentação (`documents`)
   - Código / firmware (`code`)
   - Vídeo demonstrativo local (`video`)
   - Resultados (`results`)
   - Bloco personalizado específico deste projeto (`custom`), se algum conteúdo exigir layout próprio.
5. **Coleta detalhada bloco a bloco (apenas dos blocos escolhidos):**
   - **Visão geral:** texto livre introdutório e/ou subtópicos (`Contexto & problema`, `Solução proposta`, `Arquitetura`, ou outros) + tags técnicas.
   - **Especificações técnicas:** quais categorias usar (pode usar `SPEC_CATEGORIES` ou criar nomes próprios), parâmetros e valores reais.
   - **Galeria:** arquivos de imagem, legendas e preferência entre grade (`"grid"`) ou imagem principal com miniaturas (`"spotlight"`).
   - **Esquemático / documentação:** arquivos (PDF, imagem de esquemático, diagrama), descrição e modo de cada item (`"view"`, `"download"` ou `"both"`).
   - **Código / firmware:** trechos de código (arquivo, linguagem, se permite copiar) e/ou link real do repositório externo.
   - **Vídeo demonstrativo:** arquivo de vídeo local (`.mp4`, `.webm`, etc.) e legenda opcional. Se não houver arquivo de vídeo, **não inclua** o bloco `video`.
   - **Resultados:** texto, métricas reais, tabela comparativa antes/depois, destaques e/ou imagens de validação.
6. **Integração na Home:** Pergunte se o projeto deve ficar **visível na Home** (`home.visible`), se deve ser **destaque** (`home.featured`), em qual **ordem** (`home.order`) e se deseja texto/tags/imagem próprios para o card da Home.
7. **Resumo e aprovação:** Mostre o plano completo da página e peça confirmação para implementar.

---

## 3. Arquitetura implementada no repositório

### Fonte única de dados (`src/data/projects/`)

- `src/data/projects/types.ts`: define `ProjectConfig`, `ProjectBlock`, `SPEC_CATEGORIES`, `HomeProjectCard` e `resolveProjectBlocks()`.
- `src/data/projects/index.ts`: registra todos os projetos em `export const PROJECTS: ProjectConfig[] = [...]` e fornece:
  - `getProjectBySlug(slug)`: usado pela rota individual `/projetos/$slug`.
  - `getVisibleHomeProjects()`: filtra `home.visible === true`, ordena por `featured` e depois `order`, e alimenta a seção `#projetos` da Home (`src/routes/index.tsx`).
  - `getNextVisibleProject(slug)`: gera o link opcional de próximo projeto no rodapé quando há 2 ou mais projetos visíveis na Home.
- `src/data/projects/discover-slugs.ts`: lido por `vite.config.ts` durante o build para descobrir automaticamente todos os projetos registrados em `PROJECTS` e incluí-los no prerender estático (`tanstackStart.pages`), **mesmo quando `home.visible` for `false`**.

### Template e componentes (`src/components/project/`)

- `ProjectTemplate.tsx`: renderiza:
  1. Barra superior fixa com link de retorno para `/#projetos` e marca `cfilipe.`.
  2. Cabeçalho do projeto (`category`, `stage`, `title`, `summary` e `meta` opcional) — **sem botões ou links externos**.
  3. Índice discreto (`nav[aria-label="Índice do projeto"]`) gerado automaticamente apenas para os blocos efetivamente renderizados, com numeração sequencial (`01`, `02`, ...). Blocos vazios ou omitidos nunca aparecem no índice.
  4. Capa opcional e lista ordenada de blocos renderizados por `ProjectBlockRenderer`.
  5. Navegação inferior (`Voltar aos projetos` e `Próximo` quando houver mais projetos visíveis).
- `ProjectBlocks.tsx`: implementa os blocos padrão (`overview`, `specs`, `gallery`, `documents`, `code`, `video`, `results`) e renderiza blocos `custom`.
- `Lightbox.tsx`: diálogo modal acessível com teclado (`Escape`, `ArrowLeft`, `ArrowRight`) usado por `gallery`, `documents` (quando imagem) e `results` (mídias).

---

## 4. Como implementar um novo projeto (passo a passo técnico da IA)

### Passo 1 — Organizar os ativos do projeto

- **Imagens e vídeos locais importados pelo bundler:** salve em `src/assets/projects/<slug>/` e importe via ES modules no arquivo de dados do projeto (ex.: `import imgPlaca from "@/assets/projects/meu-projeto/placa.jpg"` ou `import demoVideo from "@/assets/projects/meu-projeto/demo.mp4"`).
- **Documentos para visualização em iframe/download direto (como `.pdf`):** salve em `public/docs/projects/<slug>/arquivo.pdf` e referencie pelo caminho público `"/docs/projects/<slug>/arquivo.pdf"`.
- **Importante sobre vídeos:** o bloco `video` suporta vídeos locais via tag `<video controls>`. Se o usuário não fornecer arquivo local, omita o bloco `video` — nunca crie um bloco `video` vazio.

### Passo 2 — Criar o arquivo `src/data/projects/<slug>.ts`

Crie um arquivo exportando um `ProjectConfig` completo:

- `slug`: identificador da URL (`/projetos/<slug>`).
- `category`: `"Hardware & PCB" | "Embarcados" | "Dados"`.
- `stage`: `"Lab / Protótipo" | "Validado em Bancada" | "Em Produção"`.
- `title`, `summary`, `meta?`, `cover?`.
- `home`: `{ visible, featured?, order, summary?, tags?, cover? }`.
- `blocks`: array na ordem desejada utilizando qualquer combinação dos tipos abaixo:
  - `{ type: "overview", id?, title?, intro?, topics?, tags? }`
  - `{ type: "specs", id?, title?, groups: [{ category, items: [{ label, value, note? }] }] }` (`SPEC_CATEGORIES` traz chaves prontas em `types.ts`, mas `category` aceita qualquer string).
  - `{ type: "gallery", id?, title?, layout?: "grid" | "spotlight", items: [{ src, alt, caption? }] }`
  - `{ type: "documents", id?, title?, items: [{ title, description?, format?, src, mode: "view" | "download" | "both", downloadFilename?, previewType?: "image" | "pdf" | "auto" }] }`
  - `{ type: "code", id?, title?, repository?: { label?, url, description? }, snippets?: [{ filename, language?, content, copyable? }] }`
  - `{ type: "video", id?, title?, src, poster?, caption? }`
  - `{ type: "results", id?, title?, summary?, metrics?, comparisons?, highlights?, media? }`
  - `{ type: "custom", id, title?, tocLabel?, component: MeuComponente }`

### Passo 3 — Bloco personalizado específico (quando necessário)

Se o projeto exigir um componente exclusivo (ex.: visualizador interativo, diagrama específico ou layout sob medida):

1. Crie o componente em `src/components/project/custom/<NomeComponente>.tsx` usando os mesmos tokens (`ed-bg`, `ed-bg2`, `ed-line`, `ed-fg`, `ed-muted`, `ed-accent`).
2. Não altere `ProjectTemplate.tsx` nem os demais projetos.
3. Insira `{ type: "custom", id: "ancora", title: "Título da seção", tocLabel: "Rótulo curto no índice", component: NomeComponente }` na posição desejada dentro de `blocks`.

*(Observação técnica: `src/routes/projetos.$slug.tsx` retorna apenas strings serializáveis no `loader` e lê `ProjectConfig` no componente cliente para que componentes React em `type: "custom"` funcionem sem erro de serialização no SSR/prerender.)*

### Passo 4 — Registrar em `src/data/projects/index.ts`

1. Importe o objeto do projeto em `src/data/projects/index.ts` com import estático nomeado (`import { meuProjeto } from "./meu-projeto";`).
2. Adicione `meuProjeto` ao array `export const PROJECTS: ProjectConfig[] = [...]`.
   - Mantenha a convenção de import nomeado `./<arquivo>` + entrada simples no array `PROJECTS`, pois `src/data/projects/discover-slugs.ts` lê esse padrão para gerar as rotas estáticas em `vite.config.ts`.
3. Caso este seja o primeiro projeto real e substitua o modelo inicial, confirme com o usuário antes de remover ou ocultar `modeloProject`.

### Passo 5 — Controle de Home, visibilidade, destaque e ordem

- **Exibir ou ocultar da Home:** ajuste `home.visible` (`true` exibe na Home; `false` oculta da Home).
- **Ocultar sem despublicar:** quando `home.visible` for `false`, o projeto sai de `getVisibleHomeProjects()`, mas continua presente em `PROJECTS`, acessível em `/projetos/<slug>` e pré-renderizado no build estático via `discoverProjectSlugs()`.
- **Destaque na Home:** defina `home.featured: true` para priorizar no topo (primeiro card grande na seção `#projetos` quando o filtro permite).
- **Ordem na Home:** defina `home.order` (menor número aparece antes entre itens com o mesmo `featured`).
- **Não altere o design da Home:** `src/routes/index.tsx` já consome `getVisibleHomeProjects()` diretamente.

---

## 5. Checklist obrigatório de validação (antes de entregar)

Após finalizar as alterações, a IA deve executar e verificar:

1. `npx tsc --noEmit` — zero erros de tipagem (`exactOptionalPropertyTypes` e `noUncheckedIndexedAccess` ativos).
2. `npx eslint --rule "prettier/prettier: off" src/` — zero erros e zero warnings.
3. `npm test` — atualizar/adicionar testes se houver novos projetos ou comportamentos relevantes e garantir todos passando.
4. `npm run build` — confirmar que o build conclui sem erros e que `[prerender]` gera `/` e `/projetos/<slug>` (incluindo projetos com `home.visible: false`).
5. Conferir no código/DOM renderizado:
   - Cabeçalho da página sem botões nem links externos.
   - Índice do projeto exibindo apenas os blocos presentes e apontando para `#id` existentes.
   - Blocos não utilizados ou vídeo vazio não renderizados.
   - Links externos com `target="_blank" rel="noopener noreferrer"`, downloads com `download` e lightbox funcional.
   - Comportamento na Home coerente com `visible`, `featured`, `order` e filtros de categoria.
6. Entregar ao usuário um resumo objetivo do que foi criado/alterado, resultado real dos testes/build e eventuais pendências de material.
