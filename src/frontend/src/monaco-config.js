import * as monaco from 'monaco-editor';

// Register the language
monaco.languages.register({ id: 'lucaoshow' });

// Language configuration
monaco.languages.setLanguageConfiguration('lucaoshow', {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/']
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"', notIn: ['string', 'comment'] }
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' }
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*\\/\\*\\s*#region\\b\\s*(.*?)\\s*\\*\\/'),
      end: new RegExp('^\\s*\\/\\*\\s*#endregion\\b.*\\*\\/')
    }
  }
});

// Define syntax highlighting rules
monaco.languages.setMonarchTokensProvider('lucaoshow', {
  defaultToken: '',
  tokenPostfix: '.lucaoshow',

  // Definição de palavras-chave por categoria
  keywords: [
    'RECEBA', 'SE', 'SENAO', 'ENQUANTO', 'REPITA',
    'verdadeiro', 'falso',
    'NAO', 'E', 'OU', 'MOD'
  ],

  typeKeywords: ['num', 'alt', 'txt'],

  builtinFunctions: [
    'LEIA_NUM', 'LEIA_ALT', 'ESTA_SENTADO', 'CRIE_FIGURA', 'CRIE_IMAGEM',
    'COLIDIU', 'ALEATORIO', 'CONSULTE_CRONOMETRO', 'ESCREVA', 'LIMPE',
    'INICIE_COM_COR', 'INICIE_COM_IMAGEM', 'REDEFINA_FIGURA', 'REDEFINA_IMAGEM',
    'MOVA', 'DESTAQUE', 'REVERTA_DESTAQUE', 'TOQUE', 'ESPERE', 'ESPERE_SENTAR',
    'ESPERE_LEVANTAR', 'INICIE_CRONOMETRO', 'PARE_CRONOMETRO',
    'ESTA_BIPEDAL', 'ESTA_UNIPEDAL', 'ESTA_SEM_CARGA', 'POSSUI_RECURSO',
    'CONSULTE_RECURSO', 'ESCREVA_LINHA'
  ],

  operators: [
    '=', '<>', '>', '<', '>=', '<=',
    '+', '-', '*', '/', '^', ':', ','
  ],

  // Symbols that can be used as operators
  // eslint-disable-next-line no-useless-escape
  symbols: /[=><!~?:&|+\-*\/\^%;,]+/,

  // Caracteres que podem iniciar um número
  digits: /\d+(_+\d+)*/,

  // Escapar caracteres dentro de strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // Tokenizer
  tokenizer: {
    root: [
      // Identificadores e palavras-chave
      [/[a-zA-Z_$][\w$]*/, {
        cases: {
          '@keywords': 'keyword',
          '@builtinFunctions': 'predefined',
          '@typeKeywords': 'type',
          '@default': 'identifier'
        }
      }],

      // Whitespace
      { include: '@whitespace' },

      // Números
      [/(@digits)/, 'number'],

      // Delimitadores e parênteses
      // eslint-disable-next-line no-useless-escape
      [/[{}()\[\]]/, '@brackets'],
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      }],

      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }]
    ],

    comment: [
      [/[^/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],
      ["\\*/", 'comment', '@pop'],
      [/[/*]/, 'comment']
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment']
    ]
  }
});

// Configuração do autocompletion
const createDependencyProposals = (range) => {
  // Define propostas para funções built-in
  const functionProposals = [
    {
      label: 'LEIA_NUM',
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: 'Lê um número do usuário',
      insertText: 'LEIA_NUM("${1:mensagem}")',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range
    },
    {
      label: 'ESCREVA',
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: 'Exibe um valor na tela',
      insertText: 'ESCREVA(${1:valor})',
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range
    },
    {
      label: 'SE-SENAO',
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: 'Estrutura condicional completa',
      insertText: [
        'SE (${1:condição}) {',
        '\t${2:// código}',
        '} SENAO {',
        '\t${3:// código}',
        '}'
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range
    },
    {
      label: 'ENQUANTO',
      kind: monaco.languages.CompletionItemKind.Snippet,
      documentation: 'Loop while',
      insertText: [
        'ENQUANTO (${1:condição}) {',
        '\t${2:// código}',
        '}'
      ].join('\n'),
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range
    }
  ];

  return functionProposals;
};

// Register completions provider
monaco.languages.registerCompletionItemProvider('lucaoshow', {
  provideCompletionItems: (model, position) => {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    };

    return {
      suggestions: createDependencyProposals(range)
    };
  }
});

// Register hover provider
monaco.languages.registerHoverProvider('lucaoshow', {
  provideHover: (model, position) => {
    const word = model.getWordAtPosition(position);
    
    if (!word) return null;

    const documentation = {
      'LEIA_NUM': 'Função bloqueante que exibe um prompt de entrada de dados e retorna um valor do tipo num.',
      'ESCREVA': 'Função que exibe um valor na tela, sem pular linha ao final.',
      'SE': 'Estrutura condicional para executar código baseado em uma condição.',
      'SENAO': 'Bloco alternativo da estrutura condicional SE.',
      'ENQUANTO': 'Estrutura de repetição que executa enquanto uma condição for verdadeira.',
      'REPITA': 'Estrutura de repetição que executa um número específico de vezes.'
    }[word.word];

    if (documentation) {
      return {
        contents: [
          { value: `**${word.word}**` },
          { value: documentation }
        ]
      };
    }

    return null;
  }
});

export default monaco;