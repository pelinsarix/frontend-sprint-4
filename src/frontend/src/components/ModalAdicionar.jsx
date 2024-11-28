import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ModalAdicionarBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalAdicionarContent = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 3vw;
    border-radius: 0.5vw;
    width: 30vw;
    box-shadow: 0.5vw 0.5vw 1vw rgba(0, 0, 0, 0.2);
    align-items: center;

    & h2 {
        margin-top: 0;
        font-size: 1.5vw;
        color: #414141;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 0.8vw;
    margin: 1vw 0;
    border: 1px solid #ccc;
    border-radius: 0.5vw;
    font-size: 1vw;
`;

const Button = styled.button`
    background-color: #414141;
    color: white;
    padding: 0.8vw 2vw;
    border: none;
    border-radius: 0.5vw;
    cursor: pointer;
    font-size: 1vw;

    &:hover {
        background-color: #616161;
    }

    &:not(:last-child) {
        margin-right: 1vw;
    }
`;

const ModalAdicionar = ({ onClose, onAddPatient }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8000/patients', {
                name,
                age: parseInt(age, 10),
                status,
            });
            onAddPatient(response.data);
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar paciente:', error);
        }
    };

    return (
        <ModalAdicionarBackground>
            <ModalAdicionarContent>
                <h2>Adicionar Paciente</h2>
                <Input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Idade"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
                <div>
                    <Button onClick={handleSubmit}>Adicionar</Button>
                    <Button onClick={onClose} style={{ backgroundColor: 'white', color: '#414141' }}>
                        Cancelar
                    </Button>
                </div>
            </ModalAdicionarContent>
        </ModalAdicionarBackground>
    );
};

export default ModalAdicionar;
