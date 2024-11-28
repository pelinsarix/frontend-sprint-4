# -*- coding: utf-8 -*-

"""
Módulo responsável por implementar o analisador léxico de uma linguagem específica.

Este módulo utiliza expressões regulares para identificar padrões léxicos, como números,
identificadores, palavras reservadas e operadores, transformando o código-fonte em
uma lista de tokens. Ele também trata a remoção de comentários e espaços em branco.

Classes:
    AnalisadorLexico: Representa o analisador léxico responsável pela análise de um
                      código-fonte fornecido.

Exceções:
    LexicalException: Exceção personalizada para erros durante a análise léxica.
"""

import re
from app.compilador.analisador_lexico.classes_auxiliares import Token, LexicalException

class AnalisadorLexico:
    """
    Implementa o analisador léxico para uma linguagem específica.

    O analisador léxico lê o código-fonte como entrada, remove comentários e espaços
    em branco, e identifica tokens baseados em padrões pré-definidos.

    Atributos:
        PATTERNS (dict): Padrões regulares para tokens, como números e identificadores.
        SYMBOL_TABLE (dict): Tabela de símbolos que mapeia strings para seus respectivos
                             tipos de tokens.
    """

    # Expressões regulares para os padrões léxicos
    PATTERNS = {
        'NUMBER': r'[0-9]+',
        'ID': r'[a-zA-Z][_a-zA-Z0-9]*',
        'WHITESPACE': r'[ \t\n\r]',
        'STRING_CONTENT': r'[^"]*'
    }

    # Tabela de símbolos completa
    SYMBOL_TABLE = {
        # Símbolos especiais
        ':': 'ASSIGN',
        ')': 'RPAR',
        '(': 'LPAR',
        '}': 'RBLOCK',
        '{': 'LBLOCK',
        ',': 'COMMA',
        '"': 'DQUOTE',

        # Operadores aritméticos
        '+': 'OPSUM',
        '-': 'OPSUM',
        '*': 'OPMUL',
        '/': 'OPMUL',
        '^': 'OPPOW',

        # Operadores relacionais simples
        '=': 'OPREL',
        '>': 'OPREL',
        '<': 'OPREL',

        # Operadores relacionais compostos
        '>=': 'OPREL',
        '<=': 'OPREL',
        '<>': 'OPREL',

        # Palavras reservadas
        'RECEBA': 'ASSIGN',
        'SE': 'SE',
        'SENAO': 'SENAO',
        'ENQUANTO': 'ENQUANTO',
        'REPITA': 'REPITA',
        'verdadeiro': 'ALT',
        'falso': 'ALT',
        'NAO': 'NAO',
        'E': 'OPMUL',
        'OU': 'OPSUM',
        'MOD': 'OPMUL',

        # Funções de entrada
        'LEIA_NUM': 'FUNC_IN',
        'LEIA_ALT': 'FUNC_IN',
        'ESTA_SENTADO': 'FUNC_IN',
        'CRIE_FIGURA': 'FUNC_IN',
        'CRIE_IMAGEM': 'FUNC_IN',
        'COLIDIU': 'FUNC_IN',
        'ALEATORIO': 'FUNC_IN',
        'CONSULTE_CRONOMETRO': 'FUNC_IN',
        'ESTA_BIPEDAL': 'FUNC_IN',
        'ESTA_UNIPEDAL': 'FUNC_IN', 
        'ESTA_SEM_CARGA': 'FUNC_IN',
        'POSSUI_RECURSO': 'FUNC_IN',
        'CONSULTE_RECURSO': 'FUNC_IN',

        # Funções de saída
        'ESCREVA': 'FUNC_OUT',
        'ESCREVA_LINHA': 'FUNC_OUT',
        'LIMPE': 'FUNC_OUT',
        'INICIE_COM_COR': 'FUNC_OUT',
        'INICIE_COM_IMAGEM': 'FUNC_OUT',
        'REDEFINA_FIGURA': 'FUNC_OUT',
        'REDEFINA_IMAGEM': 'FUNC_OUT',
        'MOVA': 'FUNC_OUT',
        'DESTAQUE': 'FUNC_OUT',
        'REVERTA_DESTAQUE': 'FUNC_OUT',
        'TOQUE': 'FUNC_OUT',
        'ESPERE': 'FUNC_OUT',
        'ESPERE_SENTAR': 'FUNC_OUT',
        'ESPERE_LEVANTAR': 'FUNC_OUT',
        'INICIE_CRONOMETRO': 'FUNC_OUT',
        'PARE_CRONOMETRO': 'FUNC_OUT'
    }

    def __init__(self, sourceCode):
        """
        Inicializa o analisador léxico com o código-fonte a ser analisado.

        Args:
            sourceCode (str): Código-fonte da linguagem a ser analisado.
        """
        self.code = sourceCode
        self.code = self.removeComments()
        self.current_pos = 0
        self.current_line = 1
        self.length = len(self.code)

    def removeComments(self):
        """
        Remove comentários do código-fonte.

        Suporta tanto comentários de linha (`//`) quanto de bloco (`/* */`).

        Returns:
            str: Código-fonte sem comentários.
        """
        code_without_comments = []
        i = 0
        while i < len(self.code):
            if self.code[i:i+2] == '//':
                while i < len(self.code) and self.code[i] != '\n':
                    i += 1
            elif self.code[i:i+2] == '/*':
                i += 2
                while i < len(self.code) - 1 and self.code[i:i+2] != '*/':
                    if self.code[i] == '\n':
                        code_without_comments.append('\n')
                    i += 1
                i += 2
            else:
                code_without_comments.append(self.code[i])
                i += 1
                
        return ''.join(code_without_comments)

    def skipWhitespace(self):
        """
        Avança no código-fonte ignorando espaços em branco.

        Incrementa a posição atual no código e atualiza a contagem de linhas.
        """
        while self.current_pos < self.length:
            char = self.code[self.current_pos]
            if char in ' \t\r':
                self.current_pos += 1
            elif char == '\n':
                self.current_pos += 1
                self.current_line += 1
            else:
                break

    def processString(self):
        """
        Processa uma string literal e gera tokens para o conteúdo da string.

        Returns:
            list[Token]: Lista contendo os tokens da string.
        Raises:
            LexicalException: Caso a string não seja encerrada corretamente.
        """
        tokens = []
        tokens.append(Token("DQUOTE", '"', self.current_line))
        self.current_pos += 1

        start_line = self.current_line
        string_content = ""

        while self.current_pos < self.length:
            if self.code[self.current_pos] == '"' and self.code[self.current_pos - 1] != '\\':
                break
            if self.code[self.current_pos] == '\n':
                self.current_line += 1
            string_content += self.code[self.current_pos]
            self.current_pos += 1

        if self.current_pos >= self.length:
            raise LexicalException(f"String não terminada na linha {start_line}")

        tokens.append(Token('TXT', string_content, start_line))
        tokens.append(Token("DQUOTE", '"', self.current_line))
        self.current_pos += 1

        return tokens

    def getIdentifierOrKeyword(self):
        """
        Processa um identificador ou palavra-chave, dando prioridade para palavras reservadas.

        Returns:
            Token: Um token correspondente à palavra-chave ou identificador.
        """
        start = self.current_pos

        # Continua lendo enquanto encontrar caracteres válidos para identificadores
        while self.current_pos < self.length and (
            self.code[self.current_pos].isalnum() or 
            self.code[self.current_pos] == '_'
        ):
            self.current_pos += 1

        token_value = self.code[start:self.current_pos]

        # Verifica primeiro se é uma palavra reservada
        if token_value in self.SYMBOL_TABLE:
            return Token(self.SYMBOL_TABLE[token_value], token_value, self.current_line)
        
        # Se não for palavra reservada, é um identificador
        return Token('ID', token_value, self.current_line)

    def getTokens(self):
        """
        Analisa o código-fonte e gera uma lista de tokens.

        Returns:
            list[Token]: Lista de tokens gerados.
        Raises:
            LexicalException: Caso encontre símbolos inválidos no código-fonte.
        """
        tokens = []
        self.current_pos = 0
        self.current_line = 1

        while self.current_pos < self.length:
            self.skipWhitespace()

            if self.current_pos >= self.length:
                break

            char = self.code[self.current_pos]
            # Processa strings
            if char == '"':
                tokens.extend(self.processString())
                continue

            # Processa identificadores e palavras reservadas primeiro
            if char.isalpha() or char == '_':
                token = self.getIdentifierOrKeyword()
                tokens.append(token)
                continue
            # Verifica operadores compostos
            if self.current_pos + 1 < self.length:
                two_char = char + self.code[self.current_pos + 1]
                if two_char in self.SYMBOL_TABLE:
                    tokens.append(Token(self.SYMBOL_TABLE[two_char], two_char, self.current_line))
                    self.current_pos += 2
                    continue
            # Verifica símbolos simples
            if char in self.SYMBOL_TABLE:
                tokens.append(Token(self.SYMBOL_TABLE[char], char, self.current_line))
                self.current_pos += 1
                continue

            # Processa números
            if char.isdigit():
                match = re.match(self.PATTERNS['NUMBER'], self.code[self.current_pos:])
                if match:
                    value = match.group(0)
                    tokens.append(Token('NUMBER', value, self.current_line))
                    self.current_pos += len(value)
                    continue

            # Se chegou aqui, encontrou um caractere inválido
            raise LexicalException(f"Símbolo inválido na linha {self.current_line}: {char}")

        tokens.append(Token("EOF", "EOF", self.current_line))
        return tokens