/* eslint-disable no-useless-escape */
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as monaco from 'monaco-editor';

// Estilo do contêiner do editor
const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

// Configura a linguagem uma única vez fora do componente
const configureLucaoshowLanguage = () => {
  // Registra a linguagem
  monaco.languages.register({ id: 'lucaoshow' });

  // Define as regras de sintaxe
  monaco.languages.setMonarchTokensProvider('lucaoshow', {
    keywords: [
      'RECEBA', 'SE', 'SENAO', 'ENQUANTO', 'REPITA', 
      'verdadeiro', 'falso', 'NAO', 'E', 'OU', 'MOD'
    ],
    
    builtins: [
      'LEIA_NUM', 'LEIA_ALT', 'ESTA_SENTADO', 'CRIE_FIGURA',
      'CRIE_IMAGEM', 'COLIDIU', 'ALEATORIO', 'CONSULTE_CRONOMETRO',
      'ESCREVA', 'LIMPE', 'INICIE_COM_COR', 'INICIE_COM_IMAGEM',
      'REDEFINA_FIGURA', 'REDEFINA_IMAGEM', 'MOVA', 'DESTAQUE',
      'REVERTA_DESTAQUE', 'TOQUE', 'ESPERE', 'ESPERE_SENTAR',
      'ESPERE_LEVANTAR', 'INICIE_CRONOMETRO', 'PARE_CRONOMETRO'
    ],

    operators: [
      '=', '<>', '>', '<', '>=', '<=',
      '+', '-', '*', '/', '^', ':', ','
    ],

    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, { 
          cases: {
            '@keywords': 'keyword',
            '@builtins': 'type',
            '@default': 'identifier'
          }
        }],
        [/[0-9]+/, 'number'],
        [/".*?"/, 'string'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
        [/@symbols/, 'operator'],
      ],

      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment']
      ],
    },
  });

  // Configuração do editor para a linguagem
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
      { open: '"', close: '"' }
    ],
  });

  // Provider de autocompletion
  monaco.languages.registerCompletionItemProvider('lucaoshow', {
    triggerCharacters: [' ', '(', '.', '='], // Garante que a sugestão será disparada ao digitar esses caracteres.
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const suggestions = [
        ...['RECEBA', 'SE', 'SENAO', 'ENQUANTO', 'REPITA'].map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
        })),
        {
          label: 'LEIA_NUM',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'LEIA_NUM("${1:mensagem}")',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Lê um número do usuário',
          documentation: 'Função que solicita um número ao usuário'
        },
        {
          label: 'ESCREVA',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'ESCREVA(${1:valor})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Exibe um valor na tela',
          documentation: 'Função que exibe um valor na tela'
        },
        {
          label: 'SE-SENAO',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'SE (${1:condicao}) {',
            '\t${2:// código}',
            '} SENAO {',
            '\t${3:// código}',
            '}'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Estrutura condicional SE-SENAO',
          documentation: 'Cria uma estrutura condicional completa'
        }
      ];
      
      return { suggestions };
    }
  });
};

// Configura a linguagem apenas uma vez
configureLucaoshowLanguage();


// Componente do editor
const MonacoEditor = ({ onChange, value, readOnly = false }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Criar instância do Monaco Editor
    monaco.editor.create(containerRef.current, {
      value: value || '"Programa em Lucaoshow"\n\n',
      language: 'lucaoshow',
      theme: 'vs-dark',
      minimap: { enabled: false },
      fontSize: 14,
      automaticLayout: true,
      tabSize: 2,
      quickSuggestions: true,
      suggestOnTriggerCharacters: true, 
      acceptSuggestionOnEnter: "on",  
      tabCompletion: "on",
      wordWrap: 'on',
      lineNumbers: 'on',
      contextmenu: true,
      mouseWheelZoom: true,
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
    });
    

    // Adicionar listener para mudanças no conteúdo
    const disposable = editorRef.current.onDidChangeModelContent(() => {
      onChange?.(editorRef.current.getValue());
    });

    // Adicionar suporte a redimensionamento
    const resizeObserver = new ResizeObserver(() => {
      editorRef.current.layout();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      disposable.dispose();
      resizeObserver.disconnect();
      editorRef.current.dispose();
    };
  }, []);

  // Atualizar conteúdo quando `value` mudar
  useEffect(() => {
    if (editorRef.current && value !== undefined && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return <EditorContainer ref={containerRef} />;
};

MonacoEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
};

export default MonacoEditor;
