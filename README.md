# FisioTrack - Manual de Uso e Guia Técnico

## Visão Geral do Projeto

O FisioTrack é uma aplicação web desenvolvida para fisioterapeutas que busca simplificar e otimizar o monitoramento do progresso de pacientes durante o tratamento. A aplicação resolve o problema de acompanhar a evolução da dor e o cumprimento de exercícios de forma organizada e acessível, permitindo que os fisioterapeutas gerenciem múltiplos pacientes, gerem avaliações personalizadas e visualizem gráficos de progresso em tempo real. Com uma interface intuitiva e recursos de monitoramento contínuo, o FisioTrack transforma o processo de acompanhamento terapêutico em uma experiência digital eficiente e profissional.

## Funcionalidades Principais

- **Autenticação segura para fisioterapeutas**: Sistema de login com credenciais para garantir que apenas profissionais autorizados tenham acesso aos dados dos pacientes.

- **Gestão completa de pacientes (Adicionar, Visualizar, Editar, Remover)**: Cadastro e gerenciamento completo do perfil dos pacientes com todas as informações essenciais.

- **Geração de links únicos de avaliação por paciente**: Cada paciente recebe um link personalizado para responder avaliações de forma independente e segura.

- **Interface simples para o paciente responder (checklist de exercícios e escala de dor)**: Formulário intuitivo que permite aos pacientes registrarem seu nível de dor e marcarem os exercícios realizados.

- **Painel de progresso individual com gráfico de evolução da dor**: Visualização gráfica da evolução do nível de dor ao longo do tempo, facilitando a análise do progresso do tratamento.

- **Histórico detalhado de todas as avaliações**: Registro completo de todas as avaliações realizadas, com datas, níveis de dor e observações detalhadas.

## Guia de Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn (gerenciador de pacotes)

### Passo a Passo de Instalação

1. **Clone o repositório**:
   ```bash
   git clone <URL-do-repositório>
   cd fisiotrack
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**:
   Abra seu navegador e acesse `http://localhost:8080`

## Como Usar o FisioTrack

### Acesso ao Sistema

1. **Login do Fisioterapeuta**:
   - Acesse a página inicial da aplicação
   - Utilize as credenciais de demonstração:
     - Email: `fisio@fisiotrack.com`
     - Senha: `fisio123`
   - Clique no botão "Entrar" para acessar o dashboard

### Gerenciamento de Pacientes

#### Adicionar Novo Paciente

1. No dashboard principal, clique na aba "Pacientes"
2. Clique no botão "Adicionar Novo Paciente"
3. Preencha os campos obrigatórios:
   - Nome completo
   - Email
   - Telefone
4. Clique em "Adicionar" para salvar

#### Visualizar Pacientes

1. Na lista de pacientes, você verá todos os cadastrados em formato de cards
2. Cada card exibe:
   - Nome do paciente
   - Email
   - Telefone
3. Passe o mouse sobre o card para ver os botões de ação

#### Editar Paciente

1. Passe o mouse sobre o card do paciente desejado
2. Clique no ícone de lápis (Editar)
3. Altere as informações necessárias
4. Clique em "Atualizar" para salvar as mudanças

#### Remover Paciente

1. Passe o mouse sobre o card do paciente desejado
2. Clique no ícone de lixeira (Remover)
3. Confirme a exclusão na janela de diálogo

### Criação e Envio de Avaliações

#### Criar Avaliação

1. Na lista de pacientes, clique no card do paciente desejado
2. Clique no botão "Criar Avaliação"
3. A avaliação será automaticamente criada com:
   - Data de criação atual
   - Prazo de validade de 7 dias
   - Status "Pendente"

#### Enviar Avaliação para o Paciente

1. Na lista de avaliações (aba "Avaliações"), localize a avaliação pendente
2. Clique no card da avaliação para abrir os detalhes
3. Clique no botão "Enviar para Paciente"
4. O paciente receberá um link único para responder a avaliação

#### Responder Avaliação como Fisioterapeuta

1. Na lista de avaliações, localize a avaliação pendente
2. Clique no card da avaliação para abrir os detalhes
3. Clique no botão "Registrar Dor"
4. Preencha:
   - Nível de dor (escala de 0 a 10)
   - Observações (opcional)
5. Clique em "Salvar Registro"

### Visualização de Progresso

#### Acessar o Painel de Progresso

1. Na lista de pacientes, clique no card do paciente desejado
2. O painel de progresso será exibido automaticamente

#### Interpretar o Gráfico de Evolução

- O gráfico mostra a evolução do nível de dor ao longo do tempo
- Linha azul: registros de dor (manuais ou avaliações)
- Eixo X: datas dos registros
- Eixo Y: nível de dor (0 a 10)
- Legendas indicam se o registro foi feito manualmente ou via avaliação online

#### Histórico Detalhado

- Abaixo do gráfico, você verá uma lista de todos os registros
- Cada item mostra:
  - Data do registro
  - Nível de dor
  - Tipo de registro (manual ou avaliação)
  - Observações (se houver)
  - Classificação da dor (leve, moderada, intensa)

### Gerenciamento de Avaliações

#### Listas de Avaliações

O sistema organiza as avaliações em três categorias:

1. **Pendentes**: Avaliações criadas mas não enviadas aos pacientes
2. **Enviadas**: Avaliações enviadas aos pacientes, aguardando resposta
3. **Concluídas**: Avaliações respondidas (pelo paciente ou fisioterapeuta)

#### Detalhes da Avaliação

Clique em qualquer avaliação para ver:
- Informações do paciente
- Data de criação
- Data de expiração
- Status atual
- Registro de dor (se houver)
- Respostas de exercícios (se houver)

## Tecnologias Utilizadas

### Frontend

- **React**: Biblioteca principal para construção da interface
- **TypeScript**: Superset do JavaScript com tipagem estática
- **React Router**: Gerenciamento de rotas e navegação
- **Tailwind CSS**: Framework CSS para estilização responsiva
- **shadcn/ui**: Biblioteca de componentes UI baseada em Radix UI
- **Lucide React**: Biblioteca de ícones
- **Recharts**: Biblioteca para criação de gráficos
- **Sonner**: Biblioteca para notificações toast

### Backend e Dados

- **Dexie**: Banco de dados IndexedDB para armazenamento local
- **React Query**: Gerenciamento de estado e cache de dados
- **date-fns**: Biblioteca para manipulação de datas

### Ferramentas de Desenvolvimento

- **Vite**: Ferramenta de build e desenvolvimento rápido
- **ESLint**: Análise de código para qualidade e padrões
- **PostCSS**: Processamento de CSS com plugins
- **Autoprefixer**: Adição de prefixos CSS automaticamente

## Estrutura do Projeto

```
src/
├── components/           # Componentes React reutilizáveis
│   ├── ui/              # Componentes da biblioteca shadcn/ui
│   ├── patient-card.tsx # Card de paciente
│   ├── patient-list.tsx # Lista de pacientes
│   ├── assessment-list.tsx # Lista de avaliações
│   └── ...
├── pages/               # Páginas da aplicação
│   ├── Index.tsx        # Dashboard principal
│   ├── Login.tsx        # Página de login
│   └── NotFound.tsx     # Página 404
├── hooks/               # Custom hooks React
│   ├── useAuth.ts       # Hook de autenticação
│   ├── usePatients.ts   # Hook de gestão de pacientes
│   ├── useAssessments.ts # Hook de gestão de avaliações
│   └── ...
├── types/               # Definições de TypeScript
│   ├── patient.ts       # Interface Patient
│   ├── assessment.ts    # Interface Assessment
│   └── ...
├── lib/                 # Utilitários e configurações
│   ├── utils.ts         # Funções utilitárias
│   └── database.ts      # Configuração do banco de dados
├── utils/               # Funções utilitárias específicas
│   └── toast.ts         # Funções de notificação
└── App.tsx              # Componente principal da aplicação
```

## Configuração do Ambiente

### Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configuração. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=FisioTrack
```

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run preview`: Visualiza a build de produção
- `npm run lint`: Executa a análise de código

## Melhores Práticas e Boas Práticas

### Desenvolvimento

1. **Utilize TypeScript**: Sempre que possível, utilize tipagem forte para evitar erros
2. **Componentes Modulares**: Mantenha os componentes pequenos e focados em uma única responsabilidade
3. **Custom Hooks**: Extraia lógica reutilizável em custom hooks
4. **Estilização Consistente**: Utilize as classes do Tailwind CSS de forma consistente

### Performance

1. **Code Splitting**: Utilize lazy loading para componentes pesados
2. **Memoização**: Utilize `React.memo` e `useMemo` para otimizar renderizações
3. **Virtualização**: Para listas grandes, considere virtualização
4. **Imagens Otimizadas**: Utilize formatos modernos e compressão

### Acessibilidade

1. **Semântica HTML**: Use tags HTML semanticamente corretas
2. **Contraste de Cores**: Garanta contraste adequado para texto
3. **Teclado**: Garanta que toda interface seja navegável por teclado
4. **Screen Readers**: Forneça texto alternativo e descrições adequadas

## Solução de Problemas

### Problemas Comuns

#### Login não funciona

1. Verifique se as credenciais estão corretas
2. Confirme se o servidor está rodando
3. Limpe o cache do navegador

#### Dados não persistem

1. Verifique se o IndexedDB está habilitado no navegador
2. Confirme se não há restrições de armazenamento
3. Verifique se não há erros no console

#### Gráficos não aparecem

1. Verifique se há dados suficientes para exibir o gráfico
2. Confirme se as bibliotecas de gráficos estão carregadas
3. Verifique se não há erros de dados nos registros

### Depuração

1. **Console do Navegador**: Utilize o console para verificar erros
2. **React DevTools**: Instale a extensão para inspecionar componentes
3. **Network Tab**: Verifique requisições e respostas de API
4. **IndexedDB Viewer**: Use extensões para inspecionar o banco de dados local

## Contribuição

### Processo de Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -am 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrões de Código

- Utilize ESLint e Prettier para formatação
- Siga as convenções de nomenclatura do projeto
- Escreva testes para novas funcionalidades
- Atualize a documentação quando necessário

## Licença

Este projeto está sob licença [MIT](LICENSE). Veja o arquivo LICENSE para mais detalhes.

## Suporte

Para suporte e dúvidas:

- Email: suporte@fisiotrack.com
- Issues: Abra uma issue no GitHub
- Documentação: Consulte este README e a documentação interna do código

## Versão

**Versão**: 1.0.0  
**Data**: 2024  
**Última Atualização**: [Data da última atualização]