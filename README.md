# Central de Ajuda do SINFRALOG · SINFRA-MT

Site estático de apoio aos usuários do SINFRALOG, o Sistema de Gestão de Infraestrutura e Logística da Secretaria de Estado de Infraestrutura e Logística de Mato Grosso (SINFRA-MT), mantido pela UNIGEP.

Reúne, em um único lugar, tutoriais passo a passo por módulo do sistema, vídeos oficiais, normas (instruções normativas e portarias), dúvidas frequentes e os contatos da equipe. Todo o conteúdo vive no repositório, em MDX e TypeScript, sem back-end nem CMS. A busca é feita no navegador sobre todo o conteúdo.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-9-007FFF?logo=mui&logoColor=white)
![MDX](https://img.shields.io/badge/MDX-3-FCB32C?logo=mdx&logoColor=black)
![Tests](https://img.shields.io/badge/testes-Vitest_·_Testing_Library-2E7D32)

Sistema em produção: [sinfralog.sinfra.mt.gov.br](https://sinfralog.sinfra.mt.gov.br/login/) · Suporte: [suporte.sinfra.mt.gov.br](https://suporte.sinfra.mt.gov.br)

---

## Sumário

[Objetivo](#objetivo) · [Páginas e conteúdo](#páginas-e-conteúdo) · [Arquitetura](#arquitetura) · [Tecnologias](#tecnologias) · [Estrutura](#estrutura-do-repositório) · [Como executar](#como-executar) · [Como adicionar conteúdo](#como-adicionar-conteúdo) · [Testes](#testes) · [Deploy](#deploy) · [Decisões](#decisões-de-projeto) · [Limitações](#limitações-conhecidas) · [Troubleshooting](#troubleshooting)

---

## Objetivo

Dar ao usuário do SINFRALOG um caminho rápido para a resposta: qual tela abrir, que campo preencher, qual norma embasa o procedimento e com quem falar quando o tutorial não resolve.

Público: quem opera o SINFRALOG no dia a dia e a equipe da UNIGEP, que mantém o conteúdo.

---

## Páginas e conteúdo

As rotas estão em `src/App.tsx`; todas usam a casca `MainLayout` (barra superior com busca, conteúdo e rodapé).

| Página | Rota | O que mostra |
|--------|------|--------------|
| Início | `/` | Herói com imagens rotativas, busca, grade de módulos e seção de dúvidas frequentes (`#duvidas`) |
| Módulos | `/modulos` | Catálogo dos módulos do SINFRALOG |
| Módulo | `/modulos/:moduloSlug` | Tutoriais do módulo, ordenados pelo campo `order` |
| Tutorial | `/modulos/:moduloSlug/:tutorialSlug` | Leitor de tutorial dividido em etapas, com navegação lateral, imagens ampliáveis e links para o anterior e o próximo |
| Vídeos | `/videos` | Vídeos do canal oficial, agrupados por módulo, incorporados via `youtube-nocookie` |
| Busca | `/busca?q=` | Resultados agrupados por tipo: tutoriais, módulos, FAQ, documentação, contatos e vídeos |
| Documentação | `/documentacao` | Instruções normativas e portarias em PDF, com link para o suporte |
| Contatos | `/contatos` | Equipe da UNIGEP com e-mail institucional |
| 404 | `*` | Página não encontrada, também usada quando o módulo ou tutorial não existe |

Volume atual do conteúdo:

| Tipo | Quantidade | Onde fica |
|------|-----------:|-----------|
| Módulos | 6 | `src/content/modules.ts` |
| Tutoriais (MDX) | 33 | `src/content/tutorials/<modulo>/<slug>.mdx` |
| Imagens de tutorial (PNG) | 231 | `public/tutorials/<modulo>/<slug>/` |
| Vídeos | 15 | `src/content/videos.ts` |
| Normas (PDF) | 9 | `public/documentacao/normas-do-sinfralog/` e `src/content/documentation.ts` |
| Dúvidas frequentes | 4 | `src/content/faq.ts` |
| Contatos | 8 | `src/content/contacts.ts` |

---

## Arquitetura

SPA em React 19 servida como arquivos estáticos. Não há servidor de aplicação, banco de dados nem autenticação. O conteúdo é compilado junto com o código.

### Conteúdo

- **Tutoriais** são arquivos MDX com frontmatter (`title`, `description`, `order`, `tags` opcional). O `src/lib/tutorials.ts` carrega todos com `import.meta.glob` em modo eager, duas vezes: uma como componente React, outra como texto bruto (`?raw`) para alimentar a busca. O slug do módulo e do tutorial vem do caminho do arquivo.

- **Frontmatter** é extraído pelos plugins `remark-frontmatter` e `remark-mdx-frontmatter` configurados no `vite.config.ts`. O plugin MDX recebe um filtro para ignorar importações com `?raw`; sem isso, o Vitest transformaria o texto bruto em componente e a busca perderia o conteúdo.

- **Etapas do tutorial** não estão no frontmatter: `TutorialPage.tsx` lê os filhos do artigo renderizado e cria uma etapa para cada título `##` ou `###` do MDX. Um `#` que repete o título do tutorial é ocultado. Os títulos do MDX são rebaixados um nível na renderização (`#` vira `h2`, `##` vira `h3`) para que o cabeçalho da página seja o único `h1`.

- **Imagens** dentro do MDX são substituídas pelo componente `TutorialImage` (`src/components/mdx/index.tsx`), que abre a imagem ampliada em um diálogo com animação a partir da miniatura e respeita `prefers-reduced-motion`.

- **Módulos, vídeos, normas, FAQ e contatos** são arrays TypeScript em `src/content/`, tipados em `src/types/content.ts`.

### Busca

`src/lib/searchIndex.ts` monta, em tempo de carga, um índice em memória com todos os tipos de conteúdo. A consulta normaliza acentos e caixa, exige que todos os termos apareçam no documento e ordena por: termos presentes no título primeiro, depois pela posição da primeira ocorrência. A barra de busca sugere resultados a partir de 2 caracteres e guarda as 5 consultas mais recentes em `localStorage`.

### Tema e design system

- Modos `auto`, `light` e `dark`, persistidos em `localStorage` (`central:theme-mode`). Um script inline no `index.html` aplica `data-theme` antes do React montar, evitando o flash de tema errado. A troca usa `document.startViewTransition` quando disponível.

- Duas paletas SINFRA (`src/theme.ts`), tokens de tipografia, raio, movimento e espaçamento, regra de grade de 4 px e tema MUI gerado por `buildTheme(mode)`. A fonte IBM Plex Sans é servida localmente (`src/assets/fonts/`).

- Fundo animado em CSS puro (`src/styles/fundo.css`), com três manchas em gradiente radial, sem `filter: blur`.

### Duas pastas "public"

| Pasta | Tratamento | Conteúdo |
|-------|-----------|----------|
| `public/` | Copiada como está para `dist/`; referenciada por caminho absoluto (`/tutorials/...`) | PNGs dos tutoriais, PDFs das normas, favicon |
| `src/public/` | Processada pelo Vite (hash no nome, importada por `import.meta.glob`) | Imagens do herói em WebP e logotipo |

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| UI | React 19 · TypeScript 6 · MUI 9 (`@mui/material`, `@mui/icons-material`) · Emotion |
| Roteamento | React Router 7 (`BrowserRouter`) |
| Conteúdo | MDX 3 (`@mdx-js/rollup`) · `remark-frontmatter` · `remark-mdx-frontmatter` |
| Build | Vite 8 |
| Testes | Vitest 4 · Testing Library · jsdom · `@testing-library/jest-dom` |

Versões exatas no `package.json` e no `package-lock.json`. Não há ESLint, Prettier, CI nem Storybook configurados. Testado com Node 24; não há `.nvmrc`.

---

## Estrutura do repositório

```
CENTRAL/
├── index.html                   ← script inline de tema + contêiner do fundo animado
├── vite.config.ts               ← plugins MDX e React, alias "@" → src, config do Vitest
├── tsconfig.json                ← strict, ES2022, paths "@/*"
├── public/
│   ├── documentacao/normas-do-sinfralog/   ← PDFs das normas
│   ├── tutorials/<modulo>/<slug>/          ← PNGs dos tutoriais
│   └── logo-mt.png
├── src/
│   ├── main.tsx · App.tsx       ← bootstrap, providers e rotas
│   ├── pages/                   ← Home · Modules · ModuleDetail · TutorialPage · Videos · SearchResults · Documentation · Contacts · NotFound
│   ├── layout/                  ← MainLayout · TopNavBar · Footer
│   ├── components/              ← SearchBar, SearchSuggestions, CartaoCatalogo, TutorialCard, FAQItem, ThemeModeToggle, ...
│   │   └── mdx/                 ← componentes injetados no MDX (TutorialImage)
│   ├── content/                 ← modules · videos · documentation · faq · contacts · tutorials/**/*.mdx
│   ├── lib/                     ← tutorials (carga do MDX) · searchIndex · tutorialSteps · initials
│   ├── hooks/                   ← useRecentQueries · useScrollToHash
│   ├── theme.ts · theme/        ← tokens, paletas, buildTheme · ThemeModeProvider, themeMode
│   ├── styles/                  ← fonts.css · fundo.css
│   ├── assets/fonts/            ← IBM Plex Sans (woff2)
│   ├── public/                  ← imagens do herói e logotipo (processadas pelo Vite)
│   ├── types/content.ts
│   └── test/                    ← setup do Vitest, polyfill de matchMedia, renderComTema
└── tests/                       ← espelha src: components · pages · layout · lib · content · theme
```

---

## Como executar

Pré-requisito: Node 24 (ou outra versão recente com suporte a ES2022).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | O que faz |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento do Vite com HMR |
| `npm run build` | `tsc --noEmit` seguido de `vite build`; gera `dist/` |
| `npm run preview` | Serve o `dist/` localmente para conferir o build |
| `npm run typecheck` | Só a checagem de tipos |
| `npm test` | Vitest em modo watch |
| `npx vitest run` | Suíte completa uma única vez |

Não há variáveis de ambiente nem arquivo `.env`.

---

## Como adicionar conteúdo

### Tutorial

1. Confirme que o módulo existe em `src/content/modules.ts`. A pasta do tutorial precisa ter exatamente o `slug` do módulo.

2. Crie `src/content/tutorials/<modulo>/<slug>.mdx` com o frontmatter:

   ```mdx
   ---
   title: "Cadastro de Contratos: Dados Gerais"
   description: "Guia para orientar o uso de Cadastro de Contratos no SINFRALOG."
   order: 01
   tags: ["contratos", "cadastro"]
   ---
   ```

   `order` define a posição dentro do módulo. `tags` é opcional e entra na busca.

3. Coloque as imagens em `public/tutorials/<modulo>/<slug>/` e referencie por caminho absoluto: `![Imagem 1 - Dados Gerais](/tutorials/<modulo>/<slug>/01.png)`. O texto alternativo aparece no diálogo de ampliação.

4. Estruture o texto com `##` para cada etapa. Cada `##` ou `###` vira uma etapa com navegação própria; o conteúdo antes do primeiro título vira a etapa "Introdução". Um `#` que repita o título do tutorial (por exemplo, `# Cadastro de Contratos` em "Cadastro de Contratos: Dados Gerais") é ocultado automaticamente.

O tutorial aparece na página do módulo e na busca sem nenhum registro adicional.

### Módulo

Adicione um item em `src/content/modules.ts` com `slug`, `title`, `description` e `icon`. O ícone é resolvido pelo mapa em `src/components/HomeModuleTile.tsx`; um nome fora do mapa cai no ícone `Folder`. Para usar um ícone novo, importe-o do `@mui/icons-material` e inclua no mapa.

### Vídeo

Adicione em `src/content/videos.ts` com o `id` do YouTube, `title`, `description` e `module` (slug de um módulo ou `diario-de-obras`, categoria extra tratada em `src/pages/Videos.tsx`).

### Norma

Coloque o PDF em `public/documentacao/normas-do-sinfralog/` e registre em `src/content/documentation.ts`, na seção correspondente, com `title`, `href` absoluto e `description` opcional.

### Dúvida frequente e contato

Edite `src/content/faq.ts` (`pergunta`, `resposta`, `categoria`) ou `src/content/contacts.ts` (`nome`, `setor`, `email`).

---

## Testes

Vitest com jsdom e Testing Library. Estado atual: 29 arquivos, 127 testes, todos passando.

| Grupo | Cobre |
|-------|-------|
| `tests/components` | Busca e sugestões (teclado, debounce, recentes), cartões, FAQ, alternador de tema, imagem ampliável, scroll ao topo |
| `tests/pages` | Home, Módulos, Módulo, Tutorial (etapas, títulos, navegação), Documentação |
| `tests/layout` | Barra superior (busca ao rolar, via stub de `IntersectionObserver`) e rodapé |
| `tests/lib` | Índice de busca, carga dos tutoriais, normalização de etapas, iniciais |
| `tests/content` | Integridade dos módulos e contatos |
| `tests/theme` | `buildTheme`, persistência e resolução do modo, provider |

Três testes atuam como guarda do design system lendo o código-fonte: `InternalPagePadding` (respiro padrão das páginas internas), `outlineUsage` e `radiusUsage` (uso dos tokens de foco e raio). Ao criar uma página interna, use a casca `PaginaInterna` para passar nesses testes.

O `src/test/setup.ts` instala um polyfill de `matchMedia` e um stub controlável de `IntersectionObserver`, ausentes no jsdom.

---

## Deploy

A hospedagem ainda não está definida no repositório. O `npm run build` gera um site estático em `dist/`, que pode ir para qualquer servidor de arquivos, CDN ou armazenamento de objetos.

Uma única exigência do servidor: como o roteamento usa `BrowserRouter`, toda rota desconhecida precisa devolver o `index.html` (fallback de History API). Sem isso, recarregar `/modulos/gestao-contratos` responde 404. Exemplos: `try_files $uri /index.html;` no nginx, regra de rewrite no IIS, ou a opção de SPA das plataformas estáticas.

O build atual sai em um único bundle JS de cerca de 940 kB (250 kB gzip), porque todos os tutoriais são carregados em modo eager. O Vite emite aviso, mas o site funciona.

---

## Decisões de projeto

| Tema | Decisão |
|------|---------|
| Sem back-end | Conteúdo versionado no repositório; publicar é fazer o build. Sem CMS, banco ou API. |
| MDX | Tutoriais em Markdown com componentes React (imagem ampliável), frontmatter para metadados. |
| Carga eager | Todos os tutoriais entram no bundle para que a busca funcione offline do servidor e sem índice pré-gerado. |
| Busca | Índice em memória, substring com acentos normalizados; sem serviço externo. |
| Etapas | Derivadas dos títulos `h3`/`h4` do MDX em tempo de renderização, sem campo extra no frontmatter. |
| UI | MUI 9 com tema próprio e tokens em `src/theme.ts`; sem Tailwind. |
| Tema | `auto`/`light`/`dark` em `localStorage`, aplicado por script inline antes do React para evitar flash. |
| Vídeos | Incorporação via `youtube-nocookie.com`. A categoria `diario-de-obras` existe só na página de vídeos, pois o App Diário de Obras não tem tutoriais escritos. |
| Acessibilidade | Um único `h1` por página, `prefers-reduced-motion` respeitado nas animações, rótulos ARIA nos controles de etapa e de imagem. |
| Armazenamento local | Só o modo do tema e as 5 buscas recentes. |

---

## Limitações conhecidas

- Bundle único de cerca de 940 kB: não há code splitting por rota nem por tutorial.

- A busca é por substring: não há stemming, sinônimos nem tolerância a erros de digitação.

- As dúvidas frequentes têm 4 itens e vivem apenas na seção `#duvidas` da Home; não há página própria.

- Não há ESLint, Prettier, CI nem testes end-to-end.

---

## Troubleshooting

| Problema | O que fazer |
|---|---|
| Tutorial novo não aparece no módulo | A pasta em `src/content/tutorials/` precisa ter o mesmo `slug` do módulo em `modules.ts`. O `getTutorialsByModule` filtra por esse valor. |
| Imagem do tutorial responde 404 | O caminho deve começar com `/tutorials/` e o arquivo precisa estar em `public/tutorials/`, não em `src/public/`. |
| Tutorial aparece como uma etapa só | As etapas vêm de títulos `##` e `###`. Um MDX só com `#` e parágrafos gera apenas a etapa "Introdução". |
| Busca não encontra texto do corpo do tutorial | O texto bruto vem do glob `?raw`. Verifique o filtro do plugin MDX no `vite.config.ts`. |
| Recarregar uma rota interna dá 404 em produção | Falta o fallback para `index.html` no servidor. Veja [Deploy](#deploy). |
| Teste de padding ou raio falhou após criar uma página | Use a casca `PaginaInterna` e os tokens `radius.*` em vez de valores literais. |
| `npm run build` falha antes do Vite | O script roda `tsc --noEmit` primeiro; corrija os erros de tipo apontados. |
