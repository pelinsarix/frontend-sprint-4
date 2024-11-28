import styled from "styled-components";
import CardExercicios from "../components/CardExercicios.jsx";
import { useNavigate } from "react-router-dom"; // Importando o hook de navegação

const ContainerHome = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const BlocoMain = styled.div`
    width: 90vw; /* Corrigido dvw para vw */
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

const Cards = styled.div`
    width: 90vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Home = () => {
    const navigate = useNavigate(); // Hook para navegação

    const handleGoToIDE = () => {
        navigate("/ide"); // Usando React Router para navegar
    };

    return (
        <ContainerHome>
            <BlocoMain>
                <h1>Avaliações</h1>
                <Botao onClick={handleGoToIDE}>Adicionar +</Botao>
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
};

export default Home;
