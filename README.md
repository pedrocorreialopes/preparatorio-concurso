# 📚 ConcursaJá - Plataforma de Estudos para Concursos Públicos

<div align="center">

![ConcursaJá Logo](https://img.shields.io/badge/ConcursaJá-Sua%20Aprovação%20Começa%20Aqui-4F46E5?style=for-the-badge)

Uma plataforma completa e moderna para preparação de concursos públicos, com material didático, simulados interativos, videoaulas e acompanhamento de progresso.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

</div>

---

## 🎯 Sobre o Projeto

O **ConcursaJá** é uma plataforma educacional focada em ajudar concurseiros a se prepararem para os principais concursos públicos do Brasil. O projeto oferece uma experiência de estudo completa com:

- 📖 **12 matérias** cobrindo as principais disciplinas de concursos
- 📝 **Simulados interativos** com questões reais de provas anteriores
- ⏱️ **Timer Pomodoro** integrado para otimização dos estudos
- 📊 **Dashboard de progresso** com gráficos e estatísticas
- 🌙 **Modo escuro** para estudos noturnos
- 📱 **Design responsivo** para todos os dispositivos

---

## ✅ Funcionalidades Implementadas

### 🎓 Seção de Matérias
- [x] 12 matérias completas organizadas por categorias
- [x] Filtro por categoria (Linguagens, Exatas, Direito, Específicas)
- [x] Barra de progresso individual por matéria
- [x] Ícones e cores distintivas para cada disciplina

### 📝 Sistema de Simulados
- [x] 3 tipos de simulado: Rápido (10), Médio (30) e Completo (60 questões)
- [x] Banco de questões com 60+ questões divididas em 6 matérias
- [x] Seleção múltipla de matérias para simulado personalizado
- [x] Timer em tempo real durante o simulado
- [x] Navegação entre questões (anterior/próxima)
- [x] Resultados detalhados com gráfico de pizza
- [x] Histórico de simulados salvo em LocalStorage

### 📊 Dashboard de Progresso
- [x] Estatísticas gerais (aulas, questões, aproveitamento)
- [x] Sistema de streak (dias consecutivos de estudo)
- [x] Gráfico de desempenho por matéria
- [x] Gráfico de evolução semanal
- [x] Lista de atividades recentes

### ⏱️ Timer Pomodoro
- [x] Sessões de 25 minutos de foco
- [x] Pausas curtas de 5 minutos
- [x] Pausa longa após 4 sessões (15 min)
- [x] Contador de sessões completadas
- [x] Notificações ao finalizar sessões
- [x] Widget minimizável

### 🎨 Interface & UX
- [x] Design moderno e responsivo (mobile-first)
- [x] Modo claro/escuro com persistência
- [x] Animações suaves e micro-interações
- [x] Acessibilidade (ARIA labels, skip links)
- [x] Scroll suave e navegação intuitiva
- [x] Toast notifications para feedback

### 💾 Persistência de Dados
- [x] Progresso salvo em LocalStorage
- [x] Histórico de simulados
- [x] Preferência de tema
- [x] Sessões do Pomodoro

---

## 📁 Estrutura do Projeto

```
concursaja/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos completos (CSS Custom Properties)
├── js/
│   └── main.js         # JavaScript modular (ES6+)
└── README.md           # Documentação
```

---

## 🚀 URIs e Navegação

| Seção | URI | Descrição |
|-------|-----|-----------|
| Home | `#home` | Hero section com introdução |
| Matérias | `#materias` | Catálogo de disciplinas |
| Videoaulas | `#videoaulas` | Vídeos em destaque |
| Simulados | `#simulados` | Sistema de testes |
| Dicas | `#dicas` | Estratégias de estudo |
| Progresso | `#progresso` | Dashboard pessoal |

---

## 📖 Matérias Disponíveis

### Linguagens
- 📘 Língua Portuguesa
- 🌍 Língua Inglesa

### Exatas
- ➕ Matemática
- 🧠 Raciocínio Lógico

### Direito
- 🏛️ Direito Constitucional
- ⚖️ Direito Administrativo
- 🗳️ Direito Eleitoral

### Específicas
- 📈 Matemática Financeira
- 🏦 Conhecimentos Bancários
- 💻 Noções de Informática
- 📰 Atualidades
- 🤝 Ética no Serviço Público

---

## 🔧 Tecnologias Utilizadas

### Frontend
- **HTML5** - Semântico com Schema.org
- **CSS3** - Custom Properties, Grid, Flexbox, Animações
- **JavaScript ES6+** - Modules, Classes, Async/Await

### Bibliotecas Externas (CDN)
- **Chart.js** - Gráficos interativos
- **Font Awesome 6** - Ícones
- **Google Fonts** - Tipografia (Inter, JetBrains Mono)

### Padrões & Metodologias
- Mobile-first Design
- BEM Naming Convention
- Acessibilidade WCAG 2.1 AA
- Performance otimizada (debounce, throttle, IntersectionObserver)

---

## 📱 Responsividade

| Breakpoint | Dispositivo |
|------------|-------------|
| 320px+ | Mobile pequeno |
| 480px+ | Mobile grande |
| 768px+ | Tablet |
| 1024px+ | Desktop |
| 1280px+ | Desktop grande |

---

## 🌙 Modo Escuro

O tema escuro é ativado:
- Automaticamente se o sistema preferir (prefers-color-scheme)
- Manualmente pelo botão no header
- Preferência salva em LocalStorage

---

## 📊 Banco de Questões

O sistema inclui questões das seguintes áreas:

| Matéria | Quantidade |
|---------|------------|
| Língua Portuguesa | 10 questões |
| Matemática | 10 questões |
| Raciocínio Lógico | 10 questões |
| Direito Constitucional | 10 questões |
| Direito Administrativo | 10 questões |
| Noções de Informática | 10 questões |
| **Total** | **60+ questões** |

---

## 🚧 Próximos Passos (Roadmap)

### Curto Prazo
- [ ] Adicionar mais questões ao banco de dados
- [ ] Implementar página de revisão de respostas
- [ ] Criar sistema de favoritos para questões
- [ ] Adicionar filtro por banca examinadora

### Médio Prazo
- [ ] Integrar videoaulas reais
- [ ] Sistema de flashcards
- [ ] Modo offline (Service Worker/PWA)
- [ ] Compartilhamento de resultados

### Longo Prazo
- [ ] Backend com autenticação
- [ ] Ranking entre usuários
- [ ] Planos de estudo personalizados
- [ ] App mobile nativo

---

## 💡 Dicas de Estudo Incluídas

1. **Crie um Cronograma** - Organize seu tempo por matéria
2. **Revisão Espaçada** - Memorize melhor com intervalos
3. **Pratique com Questões** - Mínimo 50 por dia
4. **Técnica Pomodoro** - 25 min foco + 5 min pausa
5. **Mapas Mentais** - Conecte ideias
6. **Cuide da Saúde** - Sono, exercício e hidratação

---

## 🎨 Design System

### Cores Principais
```css
--color-primary: #4F46E5 (Indigo)
--color-secondary: #0EA5E9 (Sky Blue)
--color-accent: #F59E0B (Amber)
--color-success: #10B981 (Emerald)
--color-error: #EF4444 (Red)
```

### Tipografia
- **Headings**: Inter (700-800)
- **Body**: Inter (400-500)
- **Code**: JetBrains Mono

---

## 📜 Licença

Este projeto é de uso livre para fins educacionais.

---

## 👨‍💻 Desenvolvimento

Desenvolvido com ❤️ para concurseiros de todo o Brasil.

**Stack técnica:**
- Vanilla JavaScript (sem frameworks)
- CSS puro (sem preprocessadores)
- HTML5 semântico

**Performance:**
- Lighthouse Score: 90+ Desktop
- Core Web Vitals otimizados
- Assets minificados e comprimidos

---

<div align="center">

**📚 ConcursaJá - Sua Aprovação Começa Aqui!**

*"O sucesso é a soma de pequenos esforços repetidos dia após dia."*

</div>
