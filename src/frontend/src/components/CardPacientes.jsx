import styled from "styled-components";
import CardPacienteBackground from "../assets/CardPacienteBackground.png";
import { useNavigate } from "react-router-dom";

/**
 * Container
 * Estiliza o contêiner do card de paciente, incluindo a configuração do layout, animações de transição e efeitos visuais.
 * O card é responsivo e exibe informações sobre um paciente com uma imagem, nome, idade e um botão para navegação.
 * 
 * @property {string} width - Define a largura do contêiner como 29.5% da largura da tela.
 * @property {string} height - Define a altura do contêiner como 40% da altura da tela.
 * @property {string} display - Utiliza flexbox para organizar o conteúdo verticalmente.
 * @property {string} justify-content - Distribui o conteúdo verticalmente com espaço entre os itens.
 * @property {string} align-items - Alinha os itens ao centro do eixo transversal.
 * @property {string} border-radius - Define bordas arredondadas para o contêiner.
 * @property {string} background-color - Define o fundo do card como branco.
 * @property {string} transition - Define a animação de transição suave para mudanças de estilo.
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

    & .blockcard {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 90%;
        height: 30%;

        & .blocktext {
            display: flex;
            flex-direction: column;
            justify-content: start;

            & h1 {
                font-size: 1.5vw;
                color: #414141;
                font-weight: 300;
                margin: 0;
            }

            & h2 {
                font-size: 1.1vw;
                color: #414141;
                font-weight: 300;
                margin: 0;
            }
        }

        & button {
            background-color: white;
            border: 1px solid #414141;
            color: #414141;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 1.1vw;
            cursor: pointer;
            padding: 0.5vw 3vw;
            border-radius: 0.5vw;
            transition: all 0.3s ease-in-out;

            &:hover {
                background-color: #414141;
                color: white;
            }
        }
    }

    & img {
        scale: 1.1;
        height: 70%;
        border-radius: 0.5vw;
        transition: all ease-in-out 0.3s;
    }
`;

/**
 * CardPacientes
 * Componente que representa um card de paciente. O card exibe a imagem do paciente, seu nome, idade e um botão para navegação.
 * Ao clicar no botão "Ver Mais", o usuário é redirecionado para a página de detalhes do paciente.
 * 
 * @returns {JSX.Element} O componente do card de paciente, incluindo a imagem, o nome, a idade e o botão de navegação.
 */
const CardPacientes = () => {
    const navigate = useNavigate(); // Hook para navegação programática

    /**
     * handlePaciente
     * Função chamada ao clicar no botão "Ver Mais", que realiza a navegação para a página de detalhes do paciente.
     * 
     * @returns {void} Não retorna nada. Realiza a navegação para a página do paciente com ID 1.
     */
    const handlePaciente = () => {
        navigate("/paciente/1"); // Navega para a página de detalhes do paciente com ID 1
    };

    return (
        <Container>
            <img src={CardPacienteBackground} alt="CardPacienteBackground" />
            <div className="blockcard">
                <div className="blocktext">
                    <h1>José da Silva</h1>
                    <h2>76 Anos</h2>
                </div>
                <button onClick={handlePaciente}>Ver Mais</button>
            </div>
        </Container>
    );
}

export default CardPacientes;