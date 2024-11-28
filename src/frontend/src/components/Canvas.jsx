import styled from 'styled-components';
import { FaAngleRight } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { TbCircleChevronsDown } from "react-icons/tb";
import { TbCircleChevronsUp } from "react-icons/tb";
import { TbArmchair } from "react-icons/tb";
import { LuBox } from "react-icons/lu";
import { FaWalking } from "react-icons/fa";
import { TbCone } from "react-icons/tb";
import { GiLeg } from "react-icons/gi";
import { IoFootstepsOutline } from "react-icons/io5";

const CanvaContainer = styled.div`
    width: 76vw;
    height: 70vh;
    padding: 0 2vw;
    background-color: white;
    box-shadow: 0 0 5px 0 rgba(144, 126, 126, 0.1);
    border-radius: 0.5vw;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .canvas {
        height: 95%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5vw;
        font-weight: 300;
        color: #464646;
        position: relative;

        .element {
            width: 12vw;
            height: 25vh;
            border-radius: 0.5vw;
            display: flex;
            flex-direction: column;
            justify-content: start;
            font-size: 1.5vw;
            padding: 3vh 0;
            color: #464646;
            cursor: pointer;
            border: 1px solid #4dabf7;

            .inputparam {
                width: 100%;
                display: flex;
                justify-content: start;  
                align-items: center;
                background-color: transparent;
                
                input {
                    border: none;
                    font-size: 1vw;
                }

                input:focus{
                    outline: none;
                }

                p {
                    font-size: 1vw;
                    font-weight: 300;
                    color: #464646;
                }
            }

            &:hover .delete-icon {
                display: flex;
            }

            .solte{
                width: 80%;
                text-align: center;
                font-size: 1.5vw;
                font-weight: 300;
                color: #464646;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
            }

            .divisor {
                margin-top: 2vh;
                width: 90%;
                height: 0.1vh;
                background-color: #4dabf7;
            }

            .parameters {
                width: 90%;
                height: 100%;
                border-radius: 0.5vw;
                border: 1px dashed #464646a0;
                margin-top: 2vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                overflow-y: auto;
                overflow: hidden;

                .parameterName {
                    font-size: 1.1vw;
                }

                &.filled {
                    border: none;
                }
            }

            .imagem {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2vh;
                height: auto;

                p {
                    font-size: 1.2vw;
                    font-weight: 300;
                    color: #464646;
                    margin: 0;
                }
            }
        }

        .element .label {
            position: absolute;
            top: -20px;
            font-weight: bold;
            color: #4dabf7;
            font-size: 12px;
        }

        .delete-icon {
            position: absolute;
            width: 1.5vw;
            height: 1.5vw;
            top: -5%;
            right: 5%;
            background-color: white;
            border-radius: 50%;
            padding: 0.5vw;
            cursor: pointer;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            display: none; 
            justify-content: center;
            align-items: center;
        }

        .element:hover {
            background-color: #b2cdd314;
        }

        .dotted-line {
            position: absolute;
            top: 50%;
            left:70%;
            transform: translateY(-50%);
            width: 8vw;
            border-top: 2px dashed #8eb6bf68;
            cursor: pointer;
        }

        .time {
            width: 100%;
            position: absolute;
            top: -15vh;
            font-size: 1.3vw;
            color: #464646;
            display: flex;
            align-items: center;
            gap: 0.2vw;
            display: flex;
            flex-direction: column;
        }

        .action {
            width: 100%;
            position: absolute;
            top: 8vh;
            font-size: 1.3vw;
            color: #464646;
            display: flex;
            align-items: center;
            gap: 0.2vw;
            display: flex;
            flex-direction: column;
        }
    }
`;

const Canva = ( {steps, canvasItems, parameters, setCanvasItems, setParameters, parameterMapping} ) => {
    const icons = [
        { id: "Inicio", label: "Início", icon: <TbCircleChevronsUp size={24} />, type: "inicio/fim" },
        { id: "Fim", label: "Fim", icon: <TbCircleChevronsDown size={24} />, type: "inicio/fim" },
        { id: "Andar", label: "Andar", icon: <FaWalking size={24} />, type: "ação" },
        { id: "Sentar", label: "Sentar", icon: <TbArmchair size={24} />, type: "ação" },
        { id: "Levantar", label: "Levantar", icon: <GiLeg size={24} />, type: "ação" },
        { id: "Cadeira", label: "Cadeira", icon: <LuBox size={24} />, type: "objetos" },
        { id: "Step", label: "Step", icon: <IoFootstepsOutline size={24} />, type: "objetos" },
        { id: "Cone", label: "Cone", icon: <TbCone size={24} />, type: "objetos" },
    ];

    const actionMapping = {
        Cadeira: ["Sentar", "Levantar", "Apoio"],
        Step: ["Desviar", "Apoio", "Elevação"],
        Cone: ["Zigue-Zague", "Desviar"],
    };

    const handleDeleteElement = (index) => {
        setCanvasItems((prevItems) => {
            const updatedItems = { ...prevItems };
            delete updatedItems[index];
            return updatedItems;
        });

        setParameters((prevParams) => {
            const updatedParams = { ...prevParams };
            delete updatedParams[index];
            return updatedParams;
        });
    };

    const handleDropOnParameters = (event, index) => {
        event.preventDefault();
        event.stopPropagation();

        const actionId = event.dataTransfer.getData("iconId");

        const canvasItem = canvasItems[index];

        if (!canvasItem || !actionMapping[canvasItem]) {
            alert("Ação inválida! Nenhum objeto correspondente encontrado.");
            return;
        }

        const allowedActions = actionMapping[canvasItem];
        if (!allowedActions.includes(actionId)) {
            alert(`Ação "${actionId}" não permitida para "${canvasItem}".`);
            return;
        }

        setParameters((prevParams) => {
            const updatedParams = { ...prevParams };

            if (!updatedParams[index]) {
                updatedParams[index] = [];
            }

            const actionExists = updatedParams[index].some(param => param.action === actionId);
            if (actionExists) {
                alert(`A ação "${actionId}" já está associada ao objeto.`);
                return updatedParams;
            }

            // Definir valor padrão para a ação "Andar"
            if (actionId === "Andar") {
                updatedParams[index].push({
                    action: actionId,
                    parameter: "", // Inicia vazio, mas será preenchido com a distância
                });
            } else {
                updatedParams[index].push({
                    action: actionId,
                    parameter: parameterMapping[actionId] ? "" : null,
                });
            }

            return updatedParams;
        });
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDeleteAction = (index, actionIndex) => {
        setParameters((prevParams) => {
            const updatedParams = { ...prevParams };
            updatedParams[index].splice(actionIndex, 1);
            return updatedParams;
        });
    };

    const validateSequence = (items) => {
        const itemKeys = Object.keys(items).sort((a, b) => a - b);
        for (let i = 0; i < itemKeys.length - 1; i++) {
            const current = items[itemKeys[i]];
            const next = items[itemKeys[i + 1]];
            
            const isCurrentObject = ["Cone", "Step", "Cadeira"].includes(current);
            const isNextObject = ["Cone", "Step", "Cadeira"].includes(next);
    
            if ((isCurrentObject && isNextObject) || (current === "Andar" && next === "Andar")) {
                return false;
            }
        }
        return true;
    };

    const handleDropOnCanvas = (event, index) => {
        event.preventDefault();
        const iconId = event.dataTransfer.getData("iconId");
    
        setCanvasItems((prevItems) => {
            const updatedItems = { ...prevItems };
    
            // Verifica se já existe um item no índice especificado
            if (updatedItems[index]) {
                alert("Já existe um item neste espaço!");
                return prevItems;
            }
    
            const isAction = iconId === "Andar";
            const isObject = ["Cone", "Step", "Cadeira"].includes(iconId);
    
            // Adiciona o novo item ao canvas
            updatedItems[index] = iconId;
    
            // Valida a sequência após a alteração
            if (!validateSequence(updatedItems)) {
                alert("A sequência deve alternar entre objetos e a ação 'Andar'.");
                return prevItems;
            }
    
            // Adiciona parâmetros para "Andar" automaticamente
            if (isAction && !parameters[index]) {
                setParameters((prevParams) => ({
                    ...prevParams,
                    [index]: [{ action: "Andar", parameter: "" }] // Parâmetro padrão para "Andar"
                }));
            }
    
            return updatedItems; // Retorna os itens atualizados se a validação passar
        });
    };    

    const renderElements = () => {
        const stepNumber = parseInt(steps, 10);
        if (isNaN(stepNumber) || stepNumber <= 0) {
            return <p>Insira o número de passos</p>;
        }

        return Array.from({ length: stepNumber }).map((_, index) => {
            const currentIcon = icons.find(icon => icon.id === canvasItems[index]);
            const hasParameters = parameters[index] && parameters[index].length > 0;
            const isFirst = index === 0;
            const isLast = index === stepNumber - 1;

            const borderColor = isFirst || isLast
                ? "#4dabf7"
                : !canvasItems[index]
                    ? "#dcdcdc"
                    : currentIcon?.type === "inicio/fim"
                        ? "#4dabf7"
                        : currentIcon?.type === "ação"
                            ? "#ffd43b"
                            : "#38d9a9";

            return (
                <div
                    key={index}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1vw', marginRight: '1vw' }}
                >
                    <div
                        className="element"
                        onDrop={(event) => handleDropOnCanvas(event, index)}
                        onDragOver={handleDragOver}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'start',
                            border: `2px solid ${borderColor}`,
                        }}
                    >
                        {canvasItems[index] ? (
                            <>
                                {isFirst && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-20px',
                                        fontWeight: 'bold',
                                        color: '#4dabf7',
                                        fontSize: '12px',
                                    }}>
                                        Início
                                    </div>
                                )}
                                {isLast && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-20px',
                                        fontWeight: 'bold',
                                        color: '#4dabf7',
                                        fontSize: '12px',
                                    }}>
                                        Fim
                                    </div>
                                )}

                                <div className='imagem'>
                                    {currentIcon?.icon}
                                    <p style={{ fontSize: '1.2vw', fontWeight: '300', color: '#464646' }}>
                                        {currentIcon?.label}
                                    </p>
                                </div>

                                <div className="delete-icon" onClick={() => handleDeleteElement(index)}>
                                    <FaRegTrashCan size={15} color="#e50c0c" />
                                </div>

                                <div className="divisor"></div>

                                <div
                                    className={`parameters ${hasParameters ? "filled" : ""}`}
                                    onDrop={(event) => handleDropOnParameters(event, index)}
                                    onDragOver={handleDragOver}
                                >
                                    {renderParameters(index)}
                                    {!hasParameters && (
                                        <p style={{ fontSize: '1.2vw', fontWeight: '300', color: '#464646' }}>
                                            Solte ações aqui
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="solte">Solte objetos aqui</p>
                        )}
                    </div>
                    {!isLast && <FaAngleRight size={15} />}
                </div>
            );
        });
    };

    const renderParameters = (index) => {
        const currentParameters = parameters[index] || [];

        return currentParameters.map((param, paramIndex) => {
            return (
                <div
                    key={paramIndex}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        marginBottom: "1vh",
                    }}
                >
                    <div style={{
                        display: "flex",
                        marginBottom: "1vh",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <span className="parameterName">{param.action}</span>
                        <button
                            onClick={() => handleDeleteAction(index, paramIndex)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "red",
                                cursor: "pointer",
                                marginTop: "0.5vh",
                            }}
                        >
                            X
                        </button>
                    </div>

                    {param.action === "Andar" ? (
                        <div className="inputparam">
                            <input
                                type="number"
                                placeholder="Distância (em metros)"
                                value={param.parameter || ""}
                                onChange={(e) => handleParameterChange(index, paramIndex, e.target.value)}
                            />
                        </div>
                    ) : param.parameter !== null ? (
                        <div className="inputparam">
                            <input
                                type="number"
                                placeholder={param.label || parameterMapping[param.action]?.label || "Parâmetro"}
                                value={param.parameter || ""}
                                onChange={(e) => handleParameterChange(index, paramIndex, e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="inputparam">

                        </div>
                    )}
                </div>
            );
        });
    };

    const handleParameterChange = (index, paramIndex, value) => {
        setParameters((prevParams) => {
            const updatedParams = { ...prevParams };
            if (!updatedParams[index]) return prevParams;
    
            // Atualiza o valor do parâmetro específico
            updatedParams[index][paramIndex] = {
                ...updatedParams[index][paramIndex],
                parameter: value,
            };
    
            return updatedParams;
        });
    };
    
    return(
        <CanvaContainer>
            <div className="canvas">
                {renderElements()}
            </div>
        </CanvaContainer>
    );
}

export default Canva;