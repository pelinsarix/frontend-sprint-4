import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate para navegação programática
import CardExercicioBackground from "../assets/CardExercicioBackground.png";

/**
 * Container
 * Estiliza o contêiner que envolve o card de exercício. O contêiner é responsivo, com dimensões definidas em unidades relativas
 * à largura e altura da tela. Ele inclui animações de transição e efeitos visuais ao passar o mouse sobre o card.
 * 
 * @property {string} width - Define a largura do contêiner como 29.5% da largura da tela.
 * @property {string} height - Define a altura do contêiner como 40% da altura da tela.
 * @property {string} display - Define o layout do contêiner como flexível e organiza seus itens verticalmente.
 * @property {string} justify-content - Distribui o conteúdo verticalmente com espaçamento entre os itens.
 * @property {string} align-items - Alinha os itens ao centro do eixo transversal.
 * @property {string} border-radius - Define bordas arredondadas no contêiner.
 * @property {string} background-color - Define o fundo do contêiner como branco.
 * @property {string} transition - Define a animação de transição para suavizar mudanças de estilo.
 * @property {string} overflow - Controla o que acontece quando o conteúdo excede as dimensões do contêiner.
 */
const Container = styled.div`
    width: 29.5vw;
    height: 40vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.5vw;
    background-color: white;
    transition: all ease-in-out 0.3s; 
    overflow: hidden;

    & h1 {
        display: flex;
        font-size: 1.2vw;
        color: #414141;
        font-weight: lighter;
        text-align: center;
        align-items: center;        
    }

    & img {
        scale: 1.1;
        height: 80%;
        border-radius: 0.5vw;
        transition: all ease-in-out 0.3s;
    }

    &:hover {
        cursor: pointer;
        transform: scale(1.01);
        transition: 0.3s;

        & img {
            height: 100%;
            filter: brightness(50%);    
        }

        & h1 {
            font-size: 2vw;
            font-weight: normal;
            color: white;
            position: absolute;
            height: 90%;
        }
    }
`;

/**
 * CardExercicios
 * Componente que representa um card interativo de exercícios. Ao clicar no card, o usuário é redirecionado para a página de um exercício específico.
 * A animação de hover altera a escala e o brilho da imagem, além de mudar a aparência do título.
 * 
 * @returns {JSX.Element} O componente do card de exercício, incluindo imagem e título. O card é clicável e redireciona o usuário para uma página de exercício.
 */
const CardExercicios = () => {
    const navigate = useNavigate(); // Hook para navegação programática

    /**
     * handleCardClick
     * Função que é chamada ao clicar no card, realizando a navegação para a página do exercício específico.
     * 
     * @returns {void} Não retorna nada. Realiza a navegação programática.
     */
    const handleCardClick = () => {
        navigate('/exercicio/1'); // Navega para a página do exercício com ID 1
    };

    return (
        <Container onClick={handleCardClick}>
            <img src={CardExercicioBackground} alt="CardExercicioBackground" />
            <h1>Card Exercicios</h1>
        </Container>
    );
}

export default CardExercicios;