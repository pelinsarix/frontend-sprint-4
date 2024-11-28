from analisador_lexico import AnalisadorLexico, Token


def load_file(file_name):
    """
    Loads the content of a file given its name.
    Args:
        file_name (str): The name of the file to be loaded.
    Returns:
        str: The content of the file as a string.
    Raises:
        FileNotFoundError: If the file does not exist.
        IOError: If an I/O error occurs while reading the file.
    """
    
    caminho = f"arquivos_teste/{file_name}"
    with open(caminho, 'r') as arquivo:
        return arquivo.read()

def verify_tokens(tokens, tokens_esperados):
    """
    Verifies that the list of tokens matches the expected list of tokens.
    Args:
        tokens (list): The list of tokens obtained from the lexical analyzer.
        tokens_esperados (list): The list of expected tokens.
    Raises:
        AssertionError: If the number of tokens or the tokens themselves do not match the expected values.
    """
    
    if len(tokens) != len(tokens_esperados):
        diferencas = []
        for i in range(max(len(tokens), len(tokens_esperados))):
            token_obtido = tokens[i] if i < len(tokens) else "Nenhum"
            token_esperado = tokens_esperados[i] if i < len(tokens_esperados) else "Nenhum"
            if token_obtido != token_esperado:
                diferencas.append(
                    f"Posição {i + 1}: Esperado: {token_esperado}, Obtido: {token_obtido}"
                )

        diff_msg = "\n".join(diferencas)
        raise AssertionError(
            f"Quantidade de tokens incorreta. Esperado: {len(tokens_esperados)}, "
            f"Obtido: {len(tokens)}\nDiferenças:\n{diff_msg}"
        )


def test_comentarios_show():
    codigo = load_file("comentarios.show")
    analisador = AnalisadorLexico(codigo)

    tokens = analisador.getTokens()

    tokens_esperados = [
        Token("DQUOTE", "\"", 1),
        Token("TXT", "\nO programa comeca com uma string\n", 1),
        Token("DQUOTE", "\"", 3),
        Token("EOF", "EOF", 10)
    ]
    
    verify_tokens(tokens, tokens_esperados)

def test_atribuicao_show():
    codigo = load_file("atribuicao.show")
    analisador = AnalisadorLexico(codigo)

    tokens = analisador.getTokens()

    tokens_esperados = [
        Token("ID", "teste", 1),
        Token("ASSIGN", ":", 1),
        Token("ALT", "falso", 1),
        Token("ID", "numero1", 2),
        Token("ASSIGN", ":", 2),
        Token("NUMBER", "15", 2),
        Token("EOF", "EOF", 2)
    ]

    verify_tokens(tokens, tokens_esperados)


def test_blocos_show():
    codigo = load_file("blocos.show")
    analisador = AnalisadorLexico(codigo)

    tokens = analisador.getTokens()

    tokens_esperados = [
    Token("DQUOTE", "\"", 1),
    Token("TXT", "\nO programa comeca com uma string\n", 1),
    Token("DQUOTE", "\"", 3),
    Token("ID", "idade", 5),
    Token("ASSIGN", "RECEBA", 5),
    Token("NUMBER", "99", 5),
    Token("SE", "SE", 7),
    Token("LPAR", "(", 7),
    Token("ID", "idade", 7),
    Token("OPREL", ">", 7),
    Token("NUMBER", "50", 7),
    Token("RPAR", ")", 7),
    Token("LBLOCK", "{", 7),
    Token("FUNC_OUT", "ESCREVA", 8),
    Token("LPAR", "(", 8),
    Token("DQUOTE", "\"", 8),
    Token("TXT", "Idoso", 8),
    Token("DQUOTE", "\"", 8),
    Token("RPAR", ")", 8),
    Token("ID", "idoso", 9),
    Token("ASSIGN", ":", 9),
    Token("ALT", "verdadeiro", 9),
    Token("RBLOCK", "}", 10),
    Token("ID", "contador", 12),
    Token("ASSIGN", ":", 12),
    Token("NUMBER", "0", 12),
    Token("ENQUANTO", "ENQUANTO", 14),
    Token("LPAR", "(", 14),
    Token("ID", "idoso", 14),
    Token("OPMUL", "E", 14),
    Token("ID", "contador", 14),
    Token("OPREL", "<", 14),
    Token("NUMBER", "5", 14),
    Token("RPAR", ")", 14),
    Token("LBLOCK", "{", 14),
    Token("FUNC_OUT", "ESCREVA", 15),
    Token("LPAR", "(", 15),
    Token("DQUOTE", "\"", 15),
    Token("TXT", "Idoso contador", 15),
    Token("DQUOTE", "\"", 15),
    Token("RPAR", ")", 15),
    Token("ID", "contador", 16),
    Token("OPREL", "=", 16),
    Token("ID", "contador", 16),
    Token("OPSUM", "+", 16),
    Token("NUMBER", "1", 16),
    Token("RBLOCK", "}", 17),
    Token("EOF", "EOF", 17)
]

    verify_tokens(tokens, tokens_esperados)

def test_operacoes_show():
    codigo = load_file("operacoes.show")
    analisador = AnalisadorLexico(codigo)

    tokens = analisador.getTokens()

    tokens_esperados = [
        Token("ID", "numero1", 1),
        Token("ASSIGN", ":", 1),
        Token("NUMBER", "5", 1),
        Token("ID", "numero2", 2),
        Token("ASSIGN", "RECEBA", 2),
        Token("NUMBER", "10", 2),
        Token("ID", "numero3", 4),
        Token("OPREL", "=", 4),
        Token("ID", "numero1", 4),
        Token("OPSUM", "+", 4),
        Token("ID", "numero2", 4),
        Token("ID", "teste", 6),
        Token("ASSIGN", ":", 6),
        Token("ID", "numero3", 6),
        Token("OPREL", "=", 6),
        Token("OPREL", "=", 6),
        Token("NUMBER", "15", 6),
        Token("ID", "verdade", 7),
        Token("ASSIGN", "RECEBA", 7),
        Token("ID", "numero3", 7),
        Token("OPREL", ">", 7),
        Token("NUMBER", "10", 7),
        Token("ID", "maiorIgualAQuinze", 9),
        Token("ASSIGN", ":", 9),
        Token("ID", "numero3", 9),
        Token("OPREL", ">=", 9),
        Token("NUMBER", "15", 9),
        Token("EOF", "EOF", 10)
    ]

    verify_tokens(tokens, tokens_esperados)
