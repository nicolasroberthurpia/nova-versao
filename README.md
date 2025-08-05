# Dashboard Metalom

Sistema de gestão empresarial desenvolvido com Next.js 15, focado na gestão de produtos e tarefas.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Dashboard Principal**: Interface clean e moderna
- **Gestão de Produtos**: 
  - Lista de produtos com status e categorias
  - Modal de cadastro com navegação por abas
  - Sistema de status com ícones (Concluído, Pendente, Atrasado)
  - Tags de categoria harmonizadas
- **Sidebar de Navegação**: Menu lateral com ícones Lucide
- **Sistema de Autenticação**: Página de login

### 🚧 Em Desenvolvimento
- **Abas do Cadastro**: Medidas, Embalagem e Dados
- **Gestão de Tarefas**: Sistema completo de tasks
- **Persistência de Dados**: Integração com banco de dados

## 🛠️ Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Ícones**: Lucide React, Material Symbols
- **Fontes**: Inter (Google Fonts)

## 🎨 Design System

### Tipografia
- **Títulos**: 24px (font-bold)
- **Items**: 16px (font-medium) 
- **Labels**: 14px (font-medium)
- **Metadata**: 13px (font-normal)
- **Headers**: 12px (font-medium)

### Cores
- **Primária**: #111827 (preto suave)
- **Secundária**: #6B7280 (cinza médio)
- **Placeholders**: #6B7280
- **Status**: Verde (#28a745), Laranja (#fd7e14), Vermelho (#dc3545)

### Espaçamento
- **Grid**: Múltiplos de 8px
- **Inputs**: 40px altura, 6px border-radius
- **Tags**: 20px altura (h-5)

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx          # Layout principal com sidebar
│   ├── page.tsx            # Dashboard principal
│   ├── login/page.tsx      # Página de autenticação
│   ├── produtos/page.tsx   # Gestão de produtos
│   └── tarefas/page.tsx    # Gestão de tarefas
├── components/
│   ├── Sidebar.tsx         # Menu lateral de navegação
│   └── StatusBadge.tsx     # Componente de status (deprecated)
└── styles/
    └── globals.css         # Estilos globais
```

## 🔄 Navegação do Modal

O sistema de cadastro de produtos possui navegação intuitiva:
- **Clique normal**: Avança para próxima aba
- **Clique direito**: Abre menu para selecionar qualquer aba
- **Última aba**: Exibe botão "Salvar Produto"

## 📝 Status do Projeto

**Versão Atual**: 1.0.0  
**Última Atualização**: Janeiro 2025  
**Status**: Em desenvolvimento ativo

---

Desenvolvido por **Nicolas** - Sistema de gestão moderno e intuitivo para empresas.
