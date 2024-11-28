# -*- coding: utf-8 -*-

from app.compilador.analisador_sintatico.classes_auxiliares import NoInterno, NoFolha, SyntaxException, Token

class AnalisadorSintatico:

    def __init__(self, listaTokens):
        """
        Inicializa os atributos da classe.
        """
        self.tokens = listaTokens   # atributo tokens: contém a lista de objetos do tipo Token;
        self.tokenCorrente = None   # atributo tokenCorrente: contém o objeto Token que representa o token corrente;
        self.posicao = -1           # atributo posicao: inteiro que guarda o índice do token corrente (um dos tokens da lista de tokens)
        self.proximoToken()
    

    def proximoToken(self):
        """
        Avança o próximo token da lista de tokens.
        O token corrente ficará disponível no atributo tokenCorrente.
        """
        if self.posicao <= len(self.tokens)-2:  # Garante que vai estar sempre em uma faixa válida, caso contrário sempre retorna o último token (EOF)
            self.posicao += 1
            self.tokenCorrente = self.tokens[self.posicao]
    

    def lancarErro(self, tipoEsperado=None):
        """
        Método que lança uma exceção do tipo SyntaxException.
        Ele será chamado pelo método comparar() quando o token esperado for diferente do token corrente.
        """
        if tipoEsperado:
            raise SyntaxException(f"Token inesperado: \"{self.tokenCorrente.tipo}\" ({self.tokenCorrente.valor}), tipo esperado: \"{tipoEsperado}\", na linha {self.tokenCorrente.linha}")
        else:
            raise SyntaxException(f"Token inesperado: \"{self.tokenCorrente.tipo}\" ({self.tokenCorrente.valor}) na linha {self.tokenCorrente.linha}")
    

    def comparar(self, tipoEsperado):
        """
        Compara o tokenCorrente com o tipo esperado (tipoEsperado) do token. Caso sejam diferentes, lança uma exceção do tipo SyntaxException.

        OBS: Não é necessário modificar este método.
        """
        # print(f'  comparar: {self.tokenCorrente.tipo} {self.tokenCorrente.valor} {tipoEsperado}')  # remova o comentário se desejar visualizar as chamadas deste método. Pode ajudar na depuração
        tokenRetorno = self.tokenCorrente
        if self.tokenCorrente.tipo == tipoEsperado.upper():
            self.proximoToken()
        else:
            self.lancarErro(tipoEsperado)
        return tokenRetorno

    # Método inicial que começa a análise
    def analisar(self):
        programa = self.program()
        self.comparar('EOF')
        return programa

    # <program> ::= <str> <statement_list> EOF
    def program(self):
        descricao = self.str()
        stmts = self.statement_list()
        return NoInterno("program", descricao=descricao, statements=stmts)
    
    # <str> ::= DQUOTE TXT DQUOTE
    def str(self):
        self.comparar('DQUOTE')
        txt = self.comparar('TXT')
        self.comparar('DQUOTE')
        return NoFolha("string", txt.valor, txt.linha)
    
    # <statement_list> ::= <statement> <statement_list> | ε
    def statement_list(self):
        """
        Processa uma lista de declarações, incluindo tanto <statement> quanto <input_statement>.
        """
        if self.tokenCorrente.tipo in ['ID', 'SE', 'ENQUANTO', 'REPITA'] or \
        self.tokenCorrente.valor in ['ESCREVA', 'ESCREVA_LINHA', 'LIMPE', 'INICIE_COM_COR', 'INICIE_COM_IMAGEM',
                                        'REDEFINA_FIGURA', 'REDEFINA_IMAGEM', 'MOVA', 'DESTAQUE', 'REVERTA_DESTAQUE', 'TOQUE',
                                        'ESPERE', 'ESPERE_SENTAR', 'ESPERE_LEVANTAR', 'INICIE_CRONOMETRO', 'PARE_CRONOMETRO']:
            stmt = self.statement()
            stmtList = self.statement_list()
            return NoInterno("statementList", statement=stmt, prox=stmtList)

        # Verifica se é um <input_statement>
        elif self.tokenCorrente.valor in ['LEIA_NUM', 'LEIA_ALT', 'ESTA_SENTADO', 'CRIE_FIGURA', 'CRIE_IMAGEM', 'COLIDIU',
                                        'ALEATORIO', 'CONSULTE_CRONOMETRO', 'ESTA_BIPEDAL', 'ESTA_UNIPEDAL', 'ESTA_SEM_CARGA',
                                        'POSSUI_RECURSO', 'CONSULTE_RECURSO']:
            input_stmt = self.input_statement()
            stmtList = self.statement_list()
            return NoInterno("statementList", statement=input_stmt, prox=stmtList)

        return None


    
    # <statement> ::= <assign_statement> | <if_statement> | <while_statement> | <repeat_statement> | <command_statement>
    def statement(self):
        if self.tokenCorrente.tipo == 'ID':
            return self.assign_statement()
        elif self.tokenCorrente.tipo == 'SE':
            return self.if_statement()
        elif self.tokenCorrente.tipo == 'ENQUANTO':
            return self.while_statement()
        elif self.tokenCorrente.tipo == 'REPITA':
            return self.repeat_statement()
        elif self.tokenCorrente.valor in ['ESCREVA', 'ESCREVA_LINHA', 'LIMPE', 'INICIE_COM_COR', 'INICIE_COM_IMAGEM',
                                        'REDEFINA_FIGURA', 'REDEFINA_IMAGEM', 'MOVA', 'DESTAQUE', 'REVERTA_DESTAQUE', 'TOQUE',
                                        'ESPERE', 'ESPERE_SENTAR', 'ESPERE_LEVANTAR', 'INICIE_CRONOMETRO', 'PARE_CRONOMETRO']:
            return self.command_statement()
        else:
            self.lancarErro()

    
    # <assign_statement> ::= ID ASSIGN (<str> | <expression>)
    def assign_statement(self):
        id_token = self.comparar('ID')
        self.comparar('ASSIGN')
        if self.tokenCorrente.tipo == 'DQUOTE':
            valor = self.str()
        else:
            valor = self.expression()
        return NoInterno("assign", id=NoFolha("id", id_token.valor, id_token.linha), value=valor)
    
    # <block> ::= LBLOCK <statement_list> RBLOCK
    def block(self):
        self.comparar('LBLOCK')
        stmts = self.statement_list()
        self.comparar('RBLOCK')
        return NoInterno("block", statements=stmts)
    
    # <if_statement> ::= SE LPAR <expression> RPAR <block> [SENAO <block>]
    def if_statement(self):
        self.comparar('SE')
        self.comparar('LPAR')
        cond = self.expression()
        self.comparar('RPAR')
        then_block = self.block()
        else_block = None
        if self.tokenCorrente.tipo == 'SENAO':
            self.comparar('SENAO')
            else_block = self.block()
        return NoInterno("if", condition=cond, then_block=then_block, else_block=else_block)
    
    # <while_statement> ::= ENQUANTO LPAR <expression> RPAR <block>
    def while_statement(self):
        self.comparar('ENQUANTO')
        self.comparar('LPAR')
        cond = self.expression()
        self.comparar('RPAR')
        block = self.block()
        return NoInterno("while", condition=cond, block=block)
    
    # <repeat_statement> ::= REPITA LPAR <sum_expression> RPAR <block>
    def repeat_statement(self):
        self.comparar('REPITA')
        self.comparar('LPAR')
        times = self.sum_expression()
        self.comparar('RPAR')
        block = self.block()
        return NoInterno("repeat", times=times, block=block)

    # <command_statement> ::= ...
    def command_statement(self):
        if self.tokenCorrente.valor == 'ESCREVA':
            return self.escreva_statement()
        elif self.tokenCorrente.valor == 'ESCREVA_LINHA':
            return self.escreva_linha_statement()
        elif self.tokenCorrente.valor == 'LIMPE':
            return self.limpe_statement()
        elif self.tokenCorrente.valor == 'INICIE_COM_COR':
            return self.inicie_com_cor_statement()
        elif self.tokenCorrente.valor == 'INICIE_COM_IMAGEM':
            return self.inicie_com_imagem_statement()
        elif self.tokenCorrente.valor == 'REDEFINA_IMAGEM':
            return self.redefina_imagem_statement()
        elif self.tokenCorrente.valor == 'DESTAQUE':
            return self.destaque_statement()
        elif self.tokenCorrente.valor == 'REVERTA_DESTAQUE':
            return self.reverta_destaque_statement()
        elif self.tokenCorrente.valor == 'TOQUE':
            return self.toque_statement()
        elif self.tokenCorrente.valor == 'ESPERE':
            return self.espere_statement()
        elif self.tokenCorrente.valor == 'ESPERE_SENTAR':
            return self.espere_sentar_statement()
        elif self.tokenCorrente.valor == 'ESPERE_LEVANTAR':
            return self.espere_levantar_statement()
        elif self.tokenCorrente.valor == 'PARE_CRONOMETRO':
            return self.pare_cronometro_statement()
        elif self.tokenCorrente.valor == 'INICIE_CRONOMETRO':
            return self.inicie_cronometro_statement()
        elif self.tokenCorrente.valor == 'REDEFINA_FIGURA':
            return self.redefina_figura_statement()
        elif self.tokenCorrente.valor == 'MOVA':
            return self.mova_statement()
        else:
            self.lancarErro()

    def input_statement(self):
        if self.tokenCorrente.valor == 'LEIA_NUM':
            return self.leia_num_statement()
        elif self.tokenCorrente.valor == 'LEIA_ALT':
            return self.leia_alt_statement()
        elif self.tokenCorrente.valor == 'ESTA_SENTADO':
            return self.esta_sentado_statement()
        elif self.tokenCorrente.valor == 'CRIE_FIGURA':
            return self.crie_figura_statement()
        elif self.tokenCorrente.valor == 'CRIE_IMAGEM':
            return self.crie_imagem_statement()
        elif self.tokenCorrente.valor == 'COLIDIU':
            return self.colidiu_statement()
        elif self.tokenCorrente.valor == 'ALEATORIO':
            return self.aleatorio_statement()
        elif self.tokenCorrente.valor == 'CONSULTE_CRONOMETRO':
            return self.consulte_cronometro_statement()
        elif self.tokenCorrente.valor == 'ESTA_BIPEDAL':
            return self.esta_bipedal_statement()
        elif self.tokenCorrente.valor == 'ESTA_UNIPEDAL':
            return self.esta_unipedal_statement()
        elif self.tokenCorrente.valor == 'ESTA_SEM_CARGA':
            return self.esta_sem_carga_statement()
        elif self.tokenCorrente.valor == 'POSSUI_RECURSO':
            return self.possui_recurso_statement()
        elif self.tokenCorrente.valor == 'CONSULTE_RECURSO':
            return self.consulte_recurso_statement()
        else:
            self.lancarErro()

    def escreva_linha_statement(self):
        self.comparar('FUNC_OUT')  # ESCREVA_LINHA
        self.comparar('LPAR')
        if self.tokenCorrente.tipo == 'DQUOTE':
            valor = self.str()
        else:
            valor = self.expression()
        self.comparar('RPAR')
        return NoInterno("escrevaLinha", value=valor)

    
    def escreva_statement(self):
        self.comparar('FUNC_OUT')  # ESCREVA
        self.comparar('LPAR')
        if self.tokenCorrente.tipo == 'DQUOTE':
            valor = self.str()
        else:
            valor = self.expression()
        self.comparar('RPAR')
        return NoInterno("escreva", value=valor)
    
    # <expression> ::= <sum_expression> [OPREL <sum_expression>]
    def expression(self):
        esq = self.sum_expression()
        if self.tokenCorrente.tipo == 'OPREL':  # Operadores relacionais
            op = self.comparar('OPREL')
            dir = self.sum_expression()
            return NoInterno("expression", operator=op.valor, esq=esq, dir=dir)
        return esq

    # <sum_expression> ::= <mult_term> [OPSUM <mult_term> ...]
    def sum_expression(self):
        termo = self.mult_term()
        return self.sum_expression2(termo)

    def sum_expression2(self, esq):
        if self.tokenCorrente.tipo == 'OPSUM' or self.tokenCorrente.valor in ['OU', 'E']:  # Inclui operadores lógicos
            op = self.comparar(self.tokenCorrente.tipo)  # Pode ser OPSUM ou lógico
            dir = self.mult_term()
            novo_esq = NoInterno("sum", operator=op.valor, esq=esq, dir=dir)
            return self.sum_expression2(novo_esq)
        return esq

    
    # <mult_term> ::= <power_term> <mult_term2>
    def mult_term(self):
        termo = self.power_term()
        return self.mult_term2(termo)

    # <mult_term2> ::= (OPMUL | MOD) <power_term> <mult_term2> | ε
    def mult_term2(self, esq):
        if self.tokenCorrente.tipo in ['OPMUL', 'MOD']:
            op = self.comparar(self.tokenCorrente.tipo)
            dir = self.power_term()
            novo_esq = NoInterno("mult", operator=op.valor, esq=esq, dir=dir)
            return self.mult_term2(novo_esq)
        return esq

    # <power_term> ::= <factor> [OPPWR <factor>]
    def power_term(self):
        base = self.factor()
        if self.tokenCorrente.tipo == 'OPPWR':
            op = self.comparar('OPPWR')
            expoente = self.factor()
            return NoInterno("power", base=base, operator=op.valor, expoente=expoente)
        return base

    # <factor> ::= NUM | ID | LPAR <expression> RPAR | NAO <factor>
    def factor(self):
        if self.tokenCorrente.tipo == 'NAO':  # Operador lógico unário
            op = self.comparar('NAO')
            fator = self.factor()
            return NoInterno("not", operator=op.valor, operand=fator)
        elif self.tokenCorrente.tipo == 'NUM':
            num_token = self.comparar('NUM')
            return NoFolha("num", num_token.valor, num_token.linha)
        elif self.tokenCorrente.tipo == 'ID':
            id_token = self.comparar('ID')
            return NoFolha("id", id_token.valor, id_token.linha)
        elif self.tokenCorrente.tipo == 'LPAR':
            self.comparar('LPAR')
            expr = self.expression()
            self.comparar('RPAR')
            return expr
        else:
            self.lancarErro("NUM, ID, 'NAO' ou '('")


    # <limpe_statement> ::= FUNC_OUT LPAR RPAR
    def limpe_statement(self):
        self.comparar('FUNC_OUT') 
        self.comparar('LPAR')
        self.comparar('RPAR')
        return NoInterno("LIMPE")

    # <inicie_com_cor_statement> ::= FUNC_OUT LPAR <str> RPAR
    def inicie_com_cor_statement(self):
        self.comparar('FUNC_OUT') 
        self.comparar('LPAR')
        cor = self.str()  
        self.comparar('RPAR')
        return NoInterno("INICIE_COM_COR", cor=cor)
    
    # <inicie_com_imagem_statement> ::= FUNC_OUT LPAR <str> RPAR
    def inicie_com_imagem_statement(self):
        self.comparar('FUNC_OUT')  # INICIE_COM_IMAGEM
        self.comparar('LPAR')
        arq = self.str()  # Deve ser um <str>
        self.comparar('RPAR')
        return NoInterno("INICIE_COM_IMAGEM", arq=arq)

    # <redefina_imagem_statement> ::= FUNC_OUT LPAR <sum_expression>, <str>, <sum_expression>, <sum_expression> RPAR
    def redefina_imagem_statement(self):
        self.comparar('FUNC_OUT')  # REDEFINA_IMAGEM
        self.comparar('LPAR')
        ref = self.sum_expression()  # Número ou expressão
        self.comparar('COMMA')
        arq = self.str()  # Deve ser um <str>
        self.comparar('COMMA')
        x = self.sum_expression()
        self.comparar('COMMA')
        y = self.sum_expression()
        self.comparar('RPAR')
        return NoInterno("REDEFINA_IMAGEM", ref=ref, arq=arq, x=x, y=y)

    # <destaque_statement> ::= FUNC_OUT LPAR <sum_expression> RPAR
    def destaque_statement(self):
        self.comparar('FUNC_OUT')  # DESTAQUE
        self.comparar('LPAR')
        ref = self.sum_expression()  # Deve ser um número ou expressão
        self.comparar('RPAR')
        return NoInterno("DESTAQUE", ref=ref)

    # <reverta_destaque_statement> ::= FUNC_OUT LPAR RPAR
    def reverta_destaque_statement(self):
        self.comparar('FUNC_OUT')  # REVERTA_DESTAQUE
        self.comparar('LPAR')
        self.comparar('RPAR')
        return NoInterno("REVERTA_DESTAQUE")

    # <toque_statement> ::= FUNC_OUT LPAR <str> RPAR
    def toque_statement(self):
        self.comparar('FUNC_OUT')  # TOQUE
        self.comparar('LPAR')
        arq = self.str()
        self.comparar('RPAR')
        return NoInterno("TOQUE", arq=arq)

    # <espere_statement> ::= FUNC_OUT LPAR <sum_expression> RPAR
    def espere_statement(self):
        self.comparar('FUNC_OUT')  # ESPERE
        self.comparar('LPAR')
        t = self.sum_expression()  # Deve ser um número ou expressão
        self.comparar('RPAR')
        return NoInterno("ESPERE", t=t)

    # <espere_sentar_statement> ::= FUNC_OUT LPAR RPAR
    def espere_sentar_statement(self):
        self.comparar('FUNC_OUT')  # ESPERE_SENTAR
        self.comparar('LPAR')
        self.comparar('RPAR')
        return NoInterno("ESPERE_SENTAR")

    # <espere_levantar_statement> ::= FUNC_OUT LPAR RPAR
    def espere_levantar_statement(self):
        self.comparar('FUNC_OUT')  # ESPERE_LEVANTAR
        self.comparar('LPAR')
        self.comparar('RPAR')
        return NoInterno("ESPERE_LEVANTAR")

    # <inicie_cronometro_statement> ::= FUNC_OUT LPAR RPAR
    def inicie_cronometro_statement(self):
        self.comparar('FUNC_OUT')  # INICIE_CRONOMETRO
        self.comparar('LPAR')
        self.comparar('RPAR')
        return NoInterno("INICIE_CRONOMETRO")

    # <leia_num_statement> ::= FUNC_IN LPAR <str> RPAR
    def leia_num_statement(self):
        self.comparar('FUNC_IN')  # LEIA_NUM
        self.comparar('LPAR')
        msg = self.str()  # Argumento deve ser uma string
        self.comparar('RPAR')
        return NoInterno("LEIA_NUM", msg=msg)

    # <leia_alt_statement> ::= FUNC_IN LPAR <str> RPAR
    def leia_alt_statement(self):
        self.comparar('FUNC_IN')  # LEIA_ALT
        self.comparar('LPAR')
        msg = self.str()  # Argumento deve ser uma string
        self.comparar('RPAR')
        return NoInterno("LEIA_ALT", msg=msg)

    # <esta_sentado_statement> ::= FUNC_IN LPAR RPAR
    def esta_sentado_statement(self):
        self.comparar('FUNC_IN')  # ESTA_SENTADO
        self.comparar('LPAR')
        self.comparar('RPAR')
        return NoInterno("ESTA_SENTADO")

    # <esta_bipedal_statement> ::= FUNC_IN LPAR RPAR
    def esta_bipedal_statement(self):
        self.comparar('FUNC_IN')  # ESTA_BIPEDAL
        self.comparar('LPAR')
        self.comparar('RPAR')
        return NoInterno("ESTA_BIPEDAL")

    # <esta_unipedal_statement> ::= FUNC_IN LPAR <str> RPAR
    def esta_unipedal_statement(self):
        self.comparar('FUNC_IN')  # ESTA_UNIPEDAL
        self.comparar('LPAR')
        lado = self.str()  # Argumento deve ser uma string 
        self.comparar('RPAR')
        return NoInterno("ESTA_UNIPEDAL", lado=lado)

    # <esta_sem_carga_statement> ::= FUNC_IN LPAR RPAR
    def esta_sem_carga_statement(self):
        self.comparar('FUNC_IN')  # ESTA_SEM_CARGA
        self.comparar('LPAR')
        self.comparar('RPAR')
        return NoInterno("ESTA_SEM_CARGA")

    # <possui_recurso_statement> ::= FUNC_IN LPAR <str> RPAR
    def possui_recurso_statement(self):
        self.comparar('FUNC_IN')  # POSSUI_RECURSO
        self.comparar('LPAR')
        nome_recurso = self.str()  # Argumento deve ser uma string
        self.comparar('RPAR')
        return NoInterno("POSSUI_RECURSO", nome_recurso=nome_recurso)

    # <consulte_recurso_statement> ::= FUNC_IN LPAR <str> COMMA <sum_expression> RPAR
    def consulte_recurso_statement(self):
        self.comparar('FUNC_IN')  # CONSULTE_RECURSO
        self.comparar('LPAR')
        nome_recurso = self.str()  # Primeiro argumento deve ser uma string
        self.comparar('COMMA')
        id_valor = self.sum_expression()  # Segundo argumento pode ser uma expressão numérica
        self.comparar('RPAR')
        return NoInterno("CONSULTE_RECURSO", nome_recurso=nome_recurso, id_valor=id_valor)

    # <crie_figura_statement> ::= FUNC_IN LPAR <str> COMMA <sum_expression> COMMA <sum_expression> COMMA <str> COMMA <sum_expression> RPAR
    def crie_figura_statement(self):
        self.comparar('FUNC_IN')  # CRIE_FIGURA
        self.comparar('LPAR')
        tipo = self.str()
        self.comparar('COMMA')
        x = self.sum_expression()
        self.comparar('COMMA')
        y = self.sum_expression()
        self.comparar('COMMA')
        cor = self.str()
        self.comparar('COMMA')
        tamanho = self.sum_expression()
        self.comparar('RPAR')
        return NoInterno("CRIE_FIGURA", tipo=tipo, x=x, y=y, cor=cor, tamanho=tamanho)

    # <crie_imagem_statement> ::= FUNC_IN LPAR <str> COMMA <sum_expression> COMMA <sum_expression> RPAR
    def crie_imagem_statement(self):
        self.comparar('FUNC_IN')  # CRIE_IMAGEM
        self.comparar('LPAR')
        arq = self.str()
        self.comparar('COMMA')
        x = self.sum_expression()
        self.comparar('COMMA')
        y = self.sum_expression()
        self.comparar('RPAR')
        return NoInterno("CRIE_IMAGEM", arq=arq, x=x, y=y)

    # <colidiu_statement> ::= FUNC_IN LPAR <sum_expression> COMMA <sum_expression> RPAR
    def colidiu_statement(self):
        self.comparar('FUNC_IN')  # COLIDIU
        self.comparar('LPAR')
        ref1 = self.sum_expression()
        self.comparar('COMMA')
        ref2 = self.sum_expression()
        self.comparar('RPAR')
        return NoInterno("COLIDIU", ref1=ref1, ref2=ref2)

    # <aleatorio_statement> ::= FUNC_IN LPAR <sum_expression> COMMA <sum_expression> RPAR
    def aleatorio_statement(self):
        self.comparar('FUNC_IN')  # ALEATORIO
        self.comparar('LPAR')
        min_val = self.sum_expression()
        self.comparar('COMMA')
        max_val = self.sum_expression()
        self.comparar('RPAR')
        return NoInterno("ALEATORIO", min=min_val, max=max_val)

    # <consulte_cronometro_statement> ::= FUNC_IN LPAR RPAR
    def consulte_cronometro_statement(self):
        self.comparar('FUNC_IN')  # CONSULTE_CRONOMETRO
        self.comparar('LPAR')
        self.comparar('RPAR')
        return NoInterno("CONSULTE_CRONOMETRO")

    # <redefina_figura_statement> ::= FUNC_OUT LPAR <sum_expression> COMMA <str> COMMA <sum_expression> COMMA <sum_expression> COMMA <str> COMMA <sum_expression> RPAR
    def redefina_figura_statement(self):
        self.comparar('FUNC_OUT')  # REDEFINA_FIGURA
        self.comparar('LPAR')
        ref = self.sum_expression()
        self.comparar('COMMA')
        tipo = self.str()
        self.comparar('COMMA')
        x = self.sum_expression()
        self.comparar('COMMA')
        y = self.sum_expression()
        self.comparar('COMMA')
        cor = self.str()
        self.comparar('COMMA')
        tamanho = self.sum_expression()
        self.comparar('RPAR')
        return NoInterno("REDEFINA_FIGURA", ref=ref, tipo=tipo, x=x, y=y, cor=cor, tamanho=tamanho)

    # <mova_statement> ::= FUNC_OUT LPAR <sum_expression> COMMA <sum_expression> COMMA <sum_expression> RPAR
    def mova_statement(self):
        self.comparar('FUNC_OUT')  # MOVA
        self.comparar('LPAR')
        ref = self.sum_expression()
        self.comparar('COMMA')
        dx = self.sum_expression()
        self.comparar('COMMA')
        dy = self.sum_expression()
        self.comparar('RPAR')
        return NoInterno("MOVA", ref=ref, dx=dx, dy=dy)
     

if __name__ == "__main__":
    """
    Testes para validar a implementação atual do analisador sintático.
    Teste 1: Programa simples com descrição e comando de escrita
    Teste 2: Programa com estruturas de controle e expressões
    """
    
    def executar_teste(nome, tokens, validacao_esperada):
        print(f"\n{'='*20} Teste: {nome} {'='*20}")
        print("Tokens de entrada:", tokens)
        try:
            sintatico = AnalisadorSintatico(tokens)
            resultado = sintatico.analisar()
            print("\nÁrvore sintática gerada:")
            print(resultado)
            if validacao_esperada(resultado):
                print("\n✅ Teste passou!")
            else:
                print("\n❌ Teste falhou: Árvore sintática não corresponde ao esperado")
        except SyntaxException as e:

            print(f"\n❌ Teste falhou: Erro sintático: {str(e)}")
        except Exception as e:
            print(f"\n❌ Teste falhou: Erro inesperado: {str(e)}")
        print("="*50)

    # Teste 1: Programa simples
    teste1_tokens = [
        Token("DQUOTE", "\"", 1),
        Token("TXT", "Programa de teste simples", 1),
        Token("DQUOTE", "\"", 1),
        Token("FUNC_OUT", "ESCREVA", 2),
        Token("LPAR", "(", 2),
        Token("DQUOTE", "\"", 2),
        Token("TXT", "Olá mundo!", 2),
        Token("DQUOTE", "\"", 2),
        Token("RPAR", ")", 2),
        Token("EOF", "EOF", 3)
    ]

    def validacao_teste1(arvore):
        # Verifica se a estrutura básica está correta
        if not isinstance(arvore, NoInterno) or arvore.op != "program":
            return False
        # Verifica se tem descrição
        if not hasattr(arvore, 'd') or 'descricao' not in arvore.d:
            return False
        # Verifica se tem statement list com comando de escrita
        if not hasattr(arvore, 'd') or 'statements' not in arvore.d:
            return False
        return True

    # Teste 2: Programa maior (FALTAM VOCÊS IMPLEMENTAREM MULT TERM)
    teste2_tokens = [
        Token("DQUOTE", "\"", 1),
        Token("TXT", "Programa de teste com estruturas de controle", 1),
        Token("DQUOTE", "\"", 1),
        Token("SE", "SE", 2),
        Token("LPAR", "(", 2),
        Token("ID", "x", 2),
        Token("OPREL", ">", 2),
        Token("NUM", "10", 2),
        Token("RPAR", ")", 2),
        Token("LBLOCK", "{", 2),
        Token("ENQUANTO", "ENQUANTO", 3),
        Token("LPAR", "(", 3),
        Token("ID", "y", 3),
        Token("OPREL", "<", 3),
        Token("NUM", "5", 3),
        Token("RPAR", ")", 3),
        Token("LBLOCK", "{", 3),
        Token("ID", "y", 4),
        Token("ASSIGN", ":", 4),
        Token("ID", "y", 4),
        Token("OPSUM", "+", 4),
        Token("NUM", "1", 4),
        Token("RBLOCK", "}", 5),
        Token("RBLOCK", "}", 6),
        Token("EOF", "EOF", 7)
    ]

    def validacao_teste2(arvore):
        # Verifica se a estrutura básica está correta
        if not isinstance(arvore, NoInterno) or arvore.op != "program":
            return False
        # Verifica se tem uma estrutura if
        statements = arvore.d.get('statements')
        if not statements or not isinstance(statements, NoInterno):
            return False
        # Verifica se dentro do if tem um while
        if_stmt = statements.d.get('statement')
        if not if_stmt or not isinstance(if_stmt, NoInterno) or if_stmt.op != "if":
            return False
        return True

    # Execução dos testes
    print("\nIniciando testes do analisador sintático...")
    print("Status atual: Implementado análise básica de programa, estruturas de controle e expressões")
    print("Pendente: Implementação completa de comandos específicos e funções da linguagem")
    
    executar_teste("Programa Simples", teste1_tokens, validacao_teste1)
    executar_teste("Programa com Estruturas de Controle", teste2_tokens, validacao_teste2)
    
    # Teste 3: Expressões matemáticas envolvendo multiplicação, divisão e exponenciação
    teste3_tokens = [
        Token("NUM", "2", 1),
        Token("OPPWR", "**", 1),
        Token("NUM", "3", 1),
        Token("OPMUL", "*", 1),
        Token("NUM", "4", 1),
        Token("OPMUL", "/", 1),
        Token("NUM", "2", 1),
        Token("EOF", "EOF", 2)
    ]

    def validacao_teste3(arvore):
        # Verifica se a estrutura básica da árvore é um nó de multiplicação
        if not isinstance(arvore, NoInterno) or arvore.op != "mult":
            return False
        # Verifica se o lado esquerdo da multiplicação é a exponenciação correta
        if not isinstance(arvore.d['esq'], NoInterno) or arvore.d['esq'].op != "power":
            return False
        # Verifica se o lado direito é uma divisão
        if not isinstance(arvore.d['dir'], NoInterno) or arvore.d['dir'].op != "mult":
            return False
        return True

    # Execução dos testes
    executar_teste("Expressões Matemáticas", teste3_tokens, validacao_teste3)