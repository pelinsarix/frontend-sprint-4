import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaClock } from "react-icons/fa6";
import Chair from "../assets/chairImage.png";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

/**
 * Container principal do componente que organiza o layout da interface.
 */
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 5vh 0;
    width: 100%;
    background-color: #f7f7f7;
    font-family: "Roboto", sans-serif;

    .contentExercicio {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70vw;
    }
`;

/**
 * Cabeçalho que exibe o título do exercício.
 */
const Header = styled.div`
    width: 70vw;
    text-align: start;
    font-size: 2vw;
    font-weight: medium;
    margin-bottom: 10vh;
    color: #464646;
`;

/**
 * Container de instruções para o exercício com os passos para execução.
 */
const Instructions = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2vw;
    width: 70vw;

    .steps {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 5vh;
    }

    .IntrucoesDiv {
        display: flex;
        align-items: center;
        gap: 3vw;
        font-size: 1.4vw;
    }
`;

/**
 * Representação de uma instrução individual com ícone e texto.
 * O estilo é alterado dependendo da fase ativa do exercício.
 */
const IntrucoesDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 3vw;
    font-size: 1.4vw;
    color: ${(props) => (props.active ? "#2e8c7e" : "#464646")};

    .icon {
        color: ${(props) => (props.active ? "#2e8c7e" : "#464646")};
    }
`;

/**
 * Passo do exercício que exibe uma forma circular para cada etapa (levantando, esperando, sentando).
 */
const Step = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 4vw;
    height: 4vw;
    border-radius: 50%;
    color: ${(props) => (props.active ? "green" : "white")};
    background-color: ${(props) => (props.active ? "transparent" : "transparent")};
    font-size: 1vw;
    border: 2px solid ${(props) => (props.active ? "#2e8c7e" : "#464646")};
`;

/**
 * Contêiner que exibe o temporizador do exercício.
 */
const TimerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40vw;
    height: 200px;
    border: 1px solid #464646;
    border-radius: 0.5vw;
`;

/**
 * Exibição do tempo restante no exercício.
 */
const Timer = styled.div`
    font-size: 4vw;
    color: #464646;
    font-weight: bold;
    margin-bottom: 1vw;
`;

/**
 * Estilo do botão que inicia o exercício.
 */
const Button = styled.button`
    padding: 1vw 3vw;
    font-size: 1.5vw;
    border: none;
    border-radius: 0.5vw;
    background-color: #464646;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #1e4f56;
    }
`;

/**
 * Contêiner de exibição dos dados do sensor e estado do LED.
 */
const DataContainer = styled.div`
    margin-top: 25vh;
    padding: 1vw;
    background-color: #e9e9e9;
    border-radius: 0.5vw;
    font-size: 1.5vw;
`;

/**
 * Componente que gerencia a execução do exercício de sentar e levantar.
 * 
 * A lógica de controle do exercício é dividida em várias fases:
 * 1. "aguardando" - O exercício aguarda a ação do usuário.
 * 2. "levantando" - O usuário deve levantar-se.
 * 3. "esperando" - O usuário espera por 10 segundos.
 * 4. "sentando" - O usuário deve se sentar novamente.
 * 
 * O componente também gerencia o temporizador, os dados do sensor e a interação com a API.
 * 
 * @returns JSX do exercício de sentar e levantar.
 */
const ExercicioSentar = () => {
    const [timer, setTimer] = useState(10);
    const [isRunning, setIsRunning] = useState(false);
    const [fase, setFase] = useState("aguardando");
    const [data, setData] = useState({ sensor: 0, led: "desligado" });
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    /**
     * Função que busca os dados do sensor e do LED da API.
     * Atualiza o estado com os dados recebidos.
     */
    const fetchData = async () => {
        try {
            const response = await fetch("http://192.168.23.104/status");
            if (!response.ok) {
                throw new Error("Erro na resposta da API");
            }
            const jsonData = await response.json();
            setData({
                sensor: jsonData.sensorValue || 0,
                led: jsonData.ledState || "desligado",
            });
        } catch (error) {
            console.error("Erro ao buscar os dados:", error);
        }
    };

    /**
     * Hook que gerencia a execução do temporizador e a transição entre as fases.
     * Também inicia a busca de dados do sensor a cada 2 segundos.
     */
    useEffect(() => {
        let interval;
        if (isRunning && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0 && fase === "esperando") {
            setFase("sentando");
            setMensagem("Por favor, sente-se agora!");
        }
        return () => clearInterval(interval);
    }, [isRunning, timer]);

    /**
     * Hook que chama a função de fetchData a cada 2 segundos.
     */
    useEffect(() => {
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    /**
     * Hook que verifica a fase do exercício e executa a lógica necessária.
     */
    useEffect(() => {
        if (isRunning) verificarExercicio();
    }, [data]);

    /**
     * Função que inicia o exercício de levantar.
     * Verifica se o sensor está ativo antes de iniciar o exercício.
     */
    const iniciarExercicio = () => {
        setErro("");
        setMensagem("");
        if (data.sensor > 0) {
            setFase("levantando");
            setMensagem("Levante-se agora!");
            setIsRunning(true);
        } else {
            setErro("Certifique-se de que está sentado para iniciar o exercício.");
        }
    };

    /**
     * Função que verifica a fase do exercício e executa ações específicas com base no estado do sensor.
     */
    const verificarExercicio = () => {
        switch (fase) {
            case "levantando":
                if (data.sensor === 0) { // Sensor 0 significa que o idoso levantou
                    setFase("esperando");
                    setMensagem("Espere 10 segundos.");
                    setIsRunning(true); // Inicia o cronômetro aqui
                }
                break;
    
            case "esperando":
                if (timer === 0) {
                    setFase("sentando");
                    setMensagem("Por favor, sente-se agora!");
                    setIsRunning(false); // Pausa o cronômetro
                }
                break;
    
            case "sentando":
                if (data.sensor > 0) { // Sensor > 0 significa que o idoso está sentado
                    setMensagem("Parabéns! Você completou o exercício.");
                    resetarExercicio();
                }
                break;
    
            default:
                break;
        }
    };

    /**
     * Função que reinicia o exercício e define os estados iniciais.
     */
    const resetarExercicio = () => {
        setFase("aguardando");
        setIsRunning(false);
        setTimer(10);
    };

    return (
        <Container>
            <Header>Exercício Sentar</Header>

            <div className="contentExercicio">
                <Instructions>
                    <div className="steps">
                        <IntrucoesDiv active={fase === "levantando"}> 
                            <Step active={fase === "levantando"}>
                                <FaArrowUp className="icon" />
                                Levante-se
                            </Step>
                        </IntrucoesDiv>
                        <IntrucoesDiv active={fase === "esperando"}> 
                            <Step active={fase === "esperando"}>
                                <FaClock className="icon" size={"4vh"} />
                                Espere 10 segundos
                            </Step>
                        </IntrucoesDiv>
                        <IntrucoesDiv active={fase === "sentando"}> 
                            <Step active={fase === "sentando"}>
                                <FaArrowDown className="icon" size={"4vh"} />
                                Sente-se
                            </Step>
                        </IntrucoesDiv>
                    </div>
                </Instructions>

                <TimerContainer>
                    <Timer>{`${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`}</Timer>
                    <Button onClick={iniciarExercicio}>
                        {isRunning ? "Em execução" : "Iniciar"}
                    </Button>
                </TimerContainer>
            </div>
            {erro && <p style={{ color: "red", fontSize: "1.7vw", marginTop: "10vh" }}>{erro}</p>}
            {mensagem && <p style={{ color: "green", fontSize: "1.7vw", marginTop: "10vh"  }}>{mensagem}</p>}
            <DataContainer>
                <p>
                    <strong>Sensor:</strong> {data.sensor}
                </p>
                <p>
                    <strong>LED:</strong> {data.led}
                </p>
            </DataContainer>
        </Container>
    );
};

export default ExercicioSentar;
