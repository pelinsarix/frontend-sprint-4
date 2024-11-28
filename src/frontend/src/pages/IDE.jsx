import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { TbArmchair } from "react-icons/tb";
import { LuBox } from "react-icons/lu";
import { FaWalking } from "react-icons/fa";
import { TbCone } from "react-icons/tb";
import { TbCircleChevronsDown } from "react-icons/tb";
import { TbCircleChevronsUp } from "react-icons/tb";
import { GiLeg } from "react-icons/gi";
import { TbArrowZigZag } from "react-icons/tb";
import { FaPersonWalkingDashedLineArrowRight } from "react-icons/fa6";
import { IoFootstepsOutline } from "react-icons/io5";
import ModalExclusao from '../components/ModalExclusao';
import ModalConfirmacao from '../components/ModalConfirmacao';
import ModalMonaco from '../components/ModalMonaco';
import Loading from '../components/Loading.jsx';
import Accordion from '../components/Accordion.jsx';
import ToolBar from '../components/ToolBar.jsx';
import Canvas from '../components/Canvas.jsx';

const IDEContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    margin-top: 5vh;
    gap: 2vw;

    .content {
        display: flex;
        flex-direction: column;
        height: 84vh;
        gap: 2vh;
    }

    .titulo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 5vh;
        border-radius: 0.5vw;

        .right {
            display: flex;
            gap: 1vw;
            align-items: center;
        }

        p {
            font-size: 2vw;
            font-weight: 300;
            color: #464646;
        }

        input {
            width: 10vw;
            height: 4vh;
            border: none;
            background-color: white;
            box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);
            border-radius: 0.5vw;
            font-size: 1.2vw;
            font-weight: 300;
            color: #464646;
            text-align: center;
        }

        button{
            width: 10vw;
            height: 4vh;
            border: none;
            background-color: #8EB6BF;
            color: white;
            font-size: 1.2vw;
            font-weight: 300;
            border-radius: 0.5vw;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            text-align: center;
            box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);

            &:hover {
                background-color: #659AA6;
                color: white;
            }
        }
    }

    .botao {
        display: flex;
        justify-content: end;
        align-items: center;
        width: 100%;
        height: 5vh;

        button {
            width: 10vw;
            height: 4vh;
            border: none;
            background-color: #8EB6BF;
            color: white;
            font-size: 1.2vw;
            font-weight: 300;
            border-radius: 0.5vw;
            cursor: pointer;
            transition: all 0.3s ease-in-out;

            &:hover {
                background-color: #659AA6;
                color: white;
            }
        }
    }
`;

const IDE = () => {
    const [steps, setSteps] = useState("");
    const [canvasItems, setCanvasItems] = useState({});
    const [parameters, setParameters] = useState({});
    const [lineDetails, setLineDetails] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorCode, setEditorCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const parameterMapping = {
        Sentar: { type: "number", label: "N° Vezes" },
        Levantar: { type: "number", label: "N° Vezes" },
        Andar: { type: "number", label: "Distância (em metros)" },
        Elevação: { type: "number", label: "N° Vezes" },
        Desviar: null,
        "Zigue-Zague": null,
        Apoio: { type: "number", label: "Tempo" },
    };

    const generateCodeFromExercise = () => {
        const sequence = getSequence(); 
        let code = `"Descrição do programa gerado automaticamente"
    
    `;
    
        code += "// Inicialização do cronômetro\n";
        code += "INICIE_CRONOMETRO()\n\n";
    
        sequence.forEach((step, index) => {
            const { action, parameters } = step;
    
            if (action === "Andar") {
                const distance = parameters[0]?.parameter || "0";
                code += `// Ação de Andar\n`;
                code += `ESCREVA_LINHA("Andando ${distance} metros")\n`;
                code += `ESPERE(${distance} * 1000)\n\n`;
            } else if (["Cadeira", "Step", "Cone"].includes(action)) {
                code += `// Objeto: ${action}\n`;
    
                if (action === "Cadeira") {
                    code += "ESCREVA_LINHA(\"Aguardando o usuário sentar\")\n";
                    code += "ESPERE_SENTAR()\n";
                    code += "ESCREVA_LINHA(\"Usuário sentado. Aguarde levantamento.\")\n";
                    code += "ESPERE_LEVANTAR()\n";
                    code += "ESCREVA_LINHA(\"Usuário levantou. Próxima etapa iniciada.\")\n\n";
                } else if (action === "Step") {
                    code += "ESCREVA_LINHA(\"Aguardando presença no Step\")\n";
                    code += "// Simulação de lógica para Step\n";
                    code += "ESPERE_SENTAR()\n"; // Adaptar para lógica específica do Step, se houver
                    code += "ESCREVA_LINHA(\"Passo completado no Step.\")\n\n";
                } else if (action === "Cone") {
                    code += "ESCREVA_LINHA(\"Zigue-zague entre os cones iniciado.\")\n";
                    code += "// Simulação de lógica para Cone\n";
                    code += "ESPERE_LEVANTAR()\n"; // Adaptar para lógica específica do Cone
                    code += "ESCREVA_LINHA(\"Zigue-zague completado.\")\n\n";
                }
            }
        });
    
        code += "// Finalização do cronômetro\n";
        code += "PARE_CRONOMETRO()\n";
        code += "tempo_total RECEBA CONSULTE_CRONOMETRO()\n";
        code += "ESCREVA_LINHA(\"Tempo total do fluxo: \" + tempo_total + \" segundos\")\n\n";
    
        code += "// Finalização do programa\n";
        code += "ESCREVA_LINHA(\"Fluxo concluído com sucesso!\")\n";
    
        return code;
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (value === "" || (parseInt(value) <= 5 && parseInt(value) >= 0)) {
            setSteps(value);
        }
    };

    const handleOpenEditor = () => {
        const updatedCode = generateCodeFromExercise(); // Gera o código a partir do Canvas
        setEditorCode(updatedCode); // Atualiza o estado do código no editor
        setIsEditorOpen(true); // Abre o editor
    };    

    const getSequence = () => {
        const orderedIndexes = Object.keys(canvasItems)
            .map(Number) 
            .sort((a, b) => a - b);
        return orderedIndexes.map((index) => ({
            action: canvasItems[index],
            parameters: parameters[index] || [],
        }));
    };

    const handleDragStart = (event, id) => {
        event.dataTransfer.setData("iconId", id);
    };  

    const cancelDeleteElement = () => {
        setShowModal(false);
    };

    const handleConfirmClick = async () => {
        const stepsNumber = parseInt(steps);
        if (isNaN(stepsNumber) || stepsNumber <= 0) {
            alert("Por favor, insira o número de passos antes de confirmar.");
            return;
        }
    
        if (canvasItems.length < stepsNumber || parameters.length < stepsNumber) {
            alert("Os arrays 'canvasItems' ou 'parameters' não possuem elementos suficientes.");
            return;
        }
    
        const validateSteps = () => {
            for (let i = 0; i < stepsNumber; i++) {
                if (!canvasItems[i]) {
                    return `O passo ${i + 1} está vazio. Preencha todos os passos antes de confirmar.`;
                }
    
                if (!parameters[i] || parameters[i].length === 0) {
                    return `O passo ${i + 1} não possui ações atreladas. Por favor, adicione ações ao passo ${i + 1}.`;
                }
    
                for (const param of parameters[i]) {
                    if (parameterMapping[param.action] && param.parameter === "") {
                        return `O parâmetro para a ação "${param.action}" no passo ${i + 1} está vazio. Preencha-o corretamente.`;
                    }
                }
            }
            return null;
        };
    
        const validationError = validateSteps();
        if (validationError) {
            alert(validationError);
            return;
        }
    
        setIsLoading(true);
    
        try {
            const generatedCode = generateCodeFromExercise();
            setEditorCode(generatedCode);
    
            const lexicalResponse = await axios.post(
                'http://localhost:8000/lexical-analysis',
                { source_code: generatedCode },
                { headers: { 'Content-Type': 'application/json', accept: 'application/json' } }
            );
    
            console.log("Resposta da análise lexical:", lexicalResponse.data);
    
            const compileResponse = await axios.post(
                'http://localhost:8000/compile',
                { source_code: generatedCode },
                { headers: { 'Content-Type': 'application/json', accept: 'application/json' } }
            );
    
            console.log("Resposta da compilação:", compileResponse.data);
            setIsEditorOpen(true);
        } catch (error) {
            console.error("Erro durante a chamada às APIs:", error);
            alert(
                `Erro ao processar o código: ${
                    error.response?.data?.message || error.message || "Erro desconhecido"
                }. Verifique os passos e tente novamente.`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const confirmCreateExercise = () => {
        const sequence = getSequence();

        console.log("Exercício criado com sucesso:", sequence);
        setShowModal2(false);
    };

    const cancelCreateExercise = () => {
        setShowModal2(false);
    };

    const confirmDeleteElement = () => {
        const selectedItem = canvasItems[selectedElement];

        if (selectedItem === "Andar") {
            const prevItem = canvasItems[selectedElement - 1];
            const nextItem = canvasItems[selectedElement + 1];

            if (prevItem && nextItem) {
                alert("A ação 'Andar' não pode ser removida porque está entre dois objetos.");
                setShowModal(false);
                return;
            }
        }

        handleDeleteElement(selectedElement);
        setShowModal(false);
    };
    
    const handleCloseEditor = () => setIsEditorOpen(false);

    const handleSaveEditor = (savedCode) => {
        setEditorCode(savedCode);
        setIsEditorOpen(false);
        console.log("Código salvo:", savedCode);
    };

    const sections = [
        {
            title: "Objetos",
            items: [
                { id: "Cadeira", icon: <TbArmchair size={15} />, label: "Cadeira", onDragStart: handleDragStart },
                { id: "Step", icon: <LuBox size={15} />, label: "Step", onDragStart: handleDragStart },
                { id: "Cone", icon: <TbCone size={15} />, label: "Cone", onDragStart: handleDragStart },
            ],
        },
        {
            title: "Ações",
            items: [
                { id: "Sentar", icon: <TbCircleChevronsDown size={15} />, label: "Sentar", onDragStart: handleDragStart },
                { id: "Levantar", icon: <TbCircleChevronsUp size={15} />, label: "Levantar", onDragStart: handleDragStart },
                { id: "Andar", icon: <FaWalking size={15} />, label: "Andar", onDragStart: handleDragStart },
                { id: "Elevação", icon: <GiLeg size={15} />, label: "Elevação", onDragStart: handleDragStart },
                { id: "Desviar", icon: <FaPersonWalkingDashedLineArrowRight size={15} />, label: "Desviar", onDragStart: handleDragStart },
                { id: "Zigue-Zague", icon: <TbArrowZigZag size={15} />, label: "Zigue-Zague", onDragStart: handleDragStart },
                { id: "Apoio", icon: <IoFootstepsOutline size={15} />, label: "Apoio", onDragStart: handleDragStart },
            ],
        },
    ];

    return (
        <IDEContainer>
            <ToolBar>
                <Accordion sections={sections} />
            </ToolBar>
            <div className="content">
                <div className="titulo">
                    <p>Cadeiras + STEP</p>
                    <div className='right'>            
                        <input
                            title='Preencha o número de etapas'
                            type="text"
                            placeholder="N° de etapas"
                            value={steps}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleOpenEditor} title='Clique para acessar o código'>Acessar código</button>
                    </div>
                </div>

                <Canvas steps={steps} canvasItems={canvasItems} parameters={parameters} setCanvasItems={setCanvasItems} setParameters={setParameters} parameterMapping={parameterMapping}/>

                <div className="botao" title="Confirmar criação do exercício">
                    <button onClick={handleConfirmClick} disabled={isLoading}>
                        {isLoading ? "Gerando..." : "Confirmar"}
                    </button>
                </div>
                <ModalMonaco 
                    isOpen={isEditorOpen}
                    onClose={handleCloseEditor}
                    onSave={handleSaveEditor}
                    title="Editor de Código"
                    initialValue={editorCode}
                />
            </div>

            {showModal2 && (
                <ModalConfirmacao
                    onConfirm={confirmCreateExercise}
                    onCancel={cancelCreateExercise}
                />
            )}

            {showModal && (
                <ModalExclusao
                    titulo="Excluir Item"
                    mensagem="Tem certeza que deseja excluir o item selecionado?"
                    onConfirm={confirmDeleteElement}
                    onCancel={cancelDeleteElement}
                />
            )}

            {isLoading && <Loading />}
        </IDEContainer>
    );
};

export default IDE;
