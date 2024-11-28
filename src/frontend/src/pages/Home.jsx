import styled from "styled-components";
import CardExercicios from "../components/CardExercicios.jsx";

/**
 * Container principal da página, utilizado para centralizar os componentes.
 */
const ContainerHome = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

/**
 * Bloco que contém o título da seção e o botão de ação. 
 * Responsável por organizar a área do cabeçalho da página.
 */
const BlocoMain = styled.div`
    width: 90dvw;
    height: 20vh;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & h1 {
        font-size: 1.5vw;
        color: #414141;
        font-weight: 300;
    }
`;

/**
 * Botão estilizado com animação de hover. Usado para adicionar novas avaliações ou interagir com a interface.
 */
const Botao = styled.button`
    background-color: white;
    border: none;
    color: #414141;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1.2vw;
    cursor: pointer;
    padding: 0.5vw 3vw;
    border-radius: 0.5vw;
    box-shadow: 0.2vw 0.2vw 0.5vw rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;

    &:hover {
        background-color: #414141;
        color: white;
    }
`;

/**
 * Container para os cartões de exercícios, com layout flexível.
 * Organiza os itens de forma espaçada entre si.
 */
const Cards = styled.div`
    width: 90vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

/**
 * Componente principal da página inicial. Exibe seções de avaliações e exercícios, 
 * cada uma com seu respectivo título e uma lista de cartões.
 * 
 * @returns {JSX.Element} O layout da página inicial.
 */
const Home = () => {
    return (
        <ContainerHome>
            <BlocoMain>
                <h1>Avaliações</h1>
                <Botao>Adicionar +</Botao>
            </BlocoMain>
            <Cards>
                <CardExercicios />
                <CardExercicios />
                <CardExercicios />
            </Cards>
            <BlocoMain>
                <h1>Exercícios</h1>
            </BlocoMain>
            <Cards>
                <CardExercicios />
                <CardExercicios />
                <CardExercicios />
            </Cards>
        </ContainerHome>
    );
}

export default Home;