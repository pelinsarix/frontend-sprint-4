import { useParams } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import CardPacienteBackground from "../assets/CardPacienteBackground.png";
import CardExercicios from "../components/CardExercicios";

/**
 * Componente de estilo para o bloco principal que envolve toda a página do paciente.
 * Organiza os elementos de forma flexível e centralizada.
 */
const BlockPaciente = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

/**
 * Componente de estilo para o perfil do paciente, exibindo a foto, informações e botões de ação.
 * Organiza o layout em três seções: foto, dados pessoais e botões.
 */
const ProfilePaciente = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    width: 90vw;
    height: 30vh;
    border-radius: 1vw;
    box-shadow: 0 0 1vw rgba(0, 0, 0, 0.1);
    margin-top: 5vh;
    justify-content: space-evenly;

    & div:nth-child(2) {
        display: flex;
        flex-direction: column;
        width: 40vw;
        gap: 2vh;
        text-align: start;

        & h1 {
            font-size: 2vw;
            color: #414141;
            font-weight: 300;
            margin: 0;
        }

        & p {
            font-size: 1.5vw;
            color: #414141;
            font-weight: 300;
            margin: 0;
        }
    }

    & div:nth-child(3) {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        width: 20vw;
        gap: 3vh;

        & button {
            width: 20vw;
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
`;

/**
 * Componente de estilo para a foto do paciente, exibida como um círculo com uma imagem de fundo.
 */
const FotoPaciente = styled.div`
    width: 10vw;
    height: 10vw;
    border-radius: 50%;
    background-image: url(${CardPacienteBackground});
    background-position: center;    
    background-repeat: no-repeat;
    background-size: 50vh;
`;

/**
 * Componente de estilo para o grupo de botões de navegação entre as abas "Exercícios" e "Resultados".
 * Exibe botões para alternar entre diferentes seções de conteúdo.
 */
const ButtonGroup = styled.div`
    width: 90vw;
    display: flex;
    gap: 2vw;
    margin-top: 3vh;
    justify-content: start;

    & button {
        background-color: ${(props) => (props.active ? "#414141" : "white")};
        color: ${(props) => (props.active ? "white" : "#414141")};
        font-size: 1.1vw;
        cursor: pointer;
        padding: 0.5vw 2vw;
        border: none;
        border-radius: 0.5vw;
        transition: all 0.3s ease-in-out;
        box-shadow: 0 0 0.5vw rgba(0, 0, 0, 0.1);

        &:hover {
            background-color: #414141;
            color: white;
        }
    }
`;

/**
 * Componente de estilo para a seção de conteúdo, onde os exercícios ou gráficos são exibidos com um layout flexível.
 */
const ContentSection = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.7vw;
    width: auto;
    margin-top: 3vh;
`;

/**
 * Componente principal da página de perfil do paciente.
 * Exibe as informações do paciente, como nome, idade, foto, e permite alternar entre abas de Exercícios e Resultados.
 * 
 * @returns {JSX.Element} O layout completo da página de perfil do paciente.
 */
const Paciente = () => {
    const { id } = useParams(); // Obtém o ID do paciente da URL
    const [activeTab, setActiveTab] = useState("exercicios"); // Estado para controlar a aba ativa

    return (
        <BlockPaciente>
            <ProfilePaciente>
                <FotoPaciente />
                <div>
                    <h1>José da Silva</h1>
                    <p>76 Anos</p>
                </div>
                <div>
                    <button>Ver informações</button>
                    <button>Editar informações</button>
                </div>
            </ProfilePaciente>

            <ButtonGroup>
                <button onClick={() => setActiveTab("exercicios")} active={activeTab === "exercicios"}>Exercícios</button>
                <button onClick={() => setActiveTab("resultados")} active={activeTab === "resultados"}>Resultados</button>
            </ButtonGroup>

            <ContentSection>
                {activeTab === "exercicios" ? (
                    <>
                        <CardExercicios />
                        <CardExercicios />
                        <CardExercicios />
                    </>
                ) : (
                    <>
                        Gráfico 1
                        Gráfico 2
                        Gráfico 3
                    </>
                )}
            </ContentSection>
        </BlockPaciente>
    );
}

export default Paciente;
