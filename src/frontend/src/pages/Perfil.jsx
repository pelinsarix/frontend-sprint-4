import styled from "styled-components";

/**
 * ContainerPerfil
 * Estiliza um contêiner flexível para centralizar seu conteúdo vertical e horizontalmente.
 * O contêiner ocupa 80% da altura da tela (80vh) e é usado para envolver o bloco de conteúdo principal do perfil.
 * 
 * @property {string} display - Define o layout do contêiner como flexível.
 * @property {string} justify-content - Alinha o conteúdo ao centro horizontalmente.
 * @property {string} align-items - Alinha o conteúdo ao centro verticalmente.
 * @property {string} height - Define a altura do contêiner como 80% da altura da tela (80vh).
 */
const ContainerPerfil = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
`;

/**
 * Block
 * Estiliza o bloco principal de conteúdo, com um fundo branco, bordas arredondadas e texto centralizado.
 * O bloco possui uma altura e largura específicas, com padding em unidades relativas para garantir responsividade.
 * 
 * @property {string} background-color - Define o fundo do bloco como branco.
 * @property {string} padding - Define o espaçamento interno (padding) nas direções vertical e horizontal.
 * @property {string} box-sizing - Inclui o padding e border no cálculo da largura e altura do bloco.
 * @property {string} display - Define o layout do bloco como flexível.
 * @property {string} border-radius - Define as bordas arredondadas do bloco.
 * @property {string} width - Define a largura do bloco como 50% da largura da tela.
 * @property {string} height - Define a altura do bloco como 60% da altura da tela.
 * @property {string} text-align - Alinha o texto dentro do bloco ao centro.
 * @property {string} font-size - Define o tamanho da fonte como 2vw, relativo à largura da tela.
 */
const Block = styled.div`
    background-color: #FFFFFF;
    padding: 2vh 5vw;
    box-sizing: border-box;
    display: flex;
    border-radius: 0.5vw;
    width: 50vw;
    height: 60vh;
    text-align: center;
    align-items: center;
    font-size: 2vw;
`;

/**
 * Perfil
 * Componente funcional que exibe uma mensagem informando que a função de desenvolvimento da aplicação não possui autenticação.
 * O conteúdo é exibido dentro de um bloco centralizado na tela.
 * 
 * @returns {JSX.Element} O componente que exibe o texto informativo sobre o perfil de desenvolvimento.
 */
const Perfil = () => {
    return (
        <ContainerPerfil>
            <Block>
                <p>Você está na função de desenvolvimento da aplicação, que não possui autenticação.</p>
            </Block>
        </ContainerPerfil>
    );
};

export default Perfil;