import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CardPacientes from '../components/CardPacientes';
import Modal from '../components/ModalAdicionar.jsx';

const ContainerPaciente = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

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
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.7vw;
`;

const Pacientes = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pacientes, setPacientes] = useState([]);

    useEffect (() => {
        fetch('http://localhost:8000/patients')
            .then((res) => res.json())
            .then((data) => setPacientes(data));
            console.log(pacientes);
    } , []);

    const handleAddPatient = (newPatient) => {
        setPacientes((prev) => [...prev, newPatient]);
    };

    return (
        <ContainerPaciente>
            <BlocoMain>
                <h1>Pacientes</h1>
                <Botao onClick={() => setIsModalOpen(true)}>Adicionar +</Botao>
            </BlocoMain>

            <Cards>
                {pacientes.map((paciente, index) => (
                    <CardPacientes key={index} {...paciente} />
                ))}
            </Cards>

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} onAddPatient={handleAddPatient} />
            )}
        </ContainerPaciente>
    );
};

export default Pacientes;
