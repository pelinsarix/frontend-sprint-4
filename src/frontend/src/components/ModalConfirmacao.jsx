import React from 'react';
import styled from 'styled-components';

/**
 * ModalContainer
 * Estiliza o contêiner do modal, que é exibido fixamente na tela com fundo semitransparente e centralizado.
 * 
 * @property {string} position - Define o modal como fixo no topo da página.
 * @property {string} top - Define a posição do modal no topo da tela.
 * @property {string} left - Define a posição do modal à esquerda da tela.
 * @property {string} width - Define a largura do modal como 100% da largura da tela.
 * @property {string} height - Define a altura do modal como 100% da altura da tela.
 * @property {string} background-color - Define a cor de fundo do modal como uma cor semitransparente preta.
 * @property {string} display - Utiliza flexbox para centralizar o modal na tela.
 * @property {string} justify-content - Alinha o modal horizontalmente ao centro.
 * @property {string} align-items - Alinha o modal verticalmente ao centro.
 * @property {number} z-index - Define a camada do modal como a mais alta, garantindo que ele apareça sobre outros elementos.
 */
const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

/**
 * ModalContent
 * Estiliza o conteúdo do modal, incluindo a configuração do tamanho, bordas arredondadas e sombras.
 * 
 * @property {string} width - Define a largura do conteúdo do modal como 30% da largura da tela.
 * @property {string} max-width - Define a largura máxima do modal como 400px.
 * @property {string} height - Define a altura do conteúdo do modal como 20% da altura da tela.
 * @property {string} max-height - Define a altura máxima do modal como 200px.
 * @property {string} background-color - Define o fundo do conteúdo do modal como branco.
 * @property {string} padding - Define o padding interno do conteúdo do modal.
 * @property {string} border-radius - Define bordas arredondadas para o conteúdo do modal.
 * @property {string} display - Utiliza flexbox para organizar os itens verticalmente.
 * @property {string} justify-content - Distribui o conteúdo do modal com espaço entre os itens.
 * @property {string} align-items - Alinha o conteúdo do modal ao centro.
 * @property {string} box-shadow - Aplica uma sombra ao redor do conteúdo do modal.
 * @property {string} text-align - Centraliza o texto dentro do modal.
 */
const ModalContent = styled.div`
    width: 30vw;
    max-width: 400px;
    height: 20vh;
    max-height: 200px;
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
`;

/**
 * Title
 * Estiliza o título do modal, centralizando o texto e definindo o tamanho e cor da fonte.
 * 
 * @property {string} font-size - Define o tamanho da fonte do título.
 * @property {string} color - Define a cor do título.
 * @property {string} margin - Define a margem inferior do título.
 */
const Title = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin: 0 0 0.5rem;
`;

/**
 * Message
 * Estiliza a mensagem do modal, ajustando o tamanho da fonte, cor e margem.
 * 
 * @property {string} font-size - Define o tamanho da fonte da mensagem.
 * @property {string} color - Define a cor da mensagem.
 * @property {string} margin - Define a margem inferior da mensagem.
 */
const Message = styled.p`
    font-size: 1rem;
    color: #666;
    margin: 0 0 1rem;
`;

/**
 * ButtonContainer
 * Estiliza o contêiner dos botões do modal, alinhando-os horizontalmente com um gap entre eles.
 * 
 * @property {string} display - Utiliza flexbox para organizar os botões horizontalmente.
 * @property {string} gap - Define o espaçamento entre os botões.
 */
const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

/**
 * Button
 * Estiliza os botões com padding, bordas arredondadas e efeitos de transição ao passar o mouse.
 * 
 * @property {string} padding - Define o padding interno do botão.
 * @property {string} font-size - Define o tamanho da fonte do botão.
 * @property {string} border - Define a borda do botão como sem borda.
 * @property {string} border-radius - Define bordas arredondadas para o botão.
 * @property {string} cursor - Define o cursor como pointer para indicar que é clicável.
 * @property {string} transition - Aplica uma transição suave ao passar o mouse.
 * @property {string} &:hover - Define o comportamento do botão ao passar o mouse, reduzindo a opacidade.
 */
const Button = styled.button`
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
        opacity: 0.9;
    }
`;

/**
 * ConfirmButton
 * Estiliza o botão de confirmação, utilizando a cor verde e modificando o comportamento ao passar o mouse.
 * 
 * @extends Button
 * @property {string} background-color - Define a cor de fundo do botão como verde.
 * @property {string} &:hover - Modifica a cor de fundo do botão para um tom mais escuro de verde ao passar o mouse.
 */
const ConfirmButton = styled(Button)`
    background-color: #4CAF50;
    color: white;
    &:hover {
        background-color: #43A047;
    }
`;

/**
 * CancelButton
 * Estiliza o botão de cancelamento, utilizando a cor vermelha e modificando o comportamento ao passar o mouse.
 * 
 * @extends Button
 * @property {string} background-color - Define a cor de fundo do botão como vermelho.
 * @property {string} &:hover - Modifica a cor de fundo do botão para um tom mais escuro de vermelho ao passar o mouse.
 */
const CancelButton = styled(Button)`
    background-color: #f44336;
    color: white;
    &:hover {
        background-color: #e53935;
    }
`;

/**
 * ModalConfirmacao
 * Componente que renderiza um modal de confirmação. O modal exibe uma mensagem e dois botões (Sim e Não),
 * permitindo que o usuário confirme ou cancele a ação.
 * 
 * @param {Function} onConfirm - Função chamada quando o usuário clica no botão "Sim".
 * @param {Function} onCancel - Função chamada quando o usuário clica no botão "Não".
 * 
 * @returns {JSX.Element} O modal de confirmação, contendo a mensagem e os botões para confirmação ou cancelamento.
 */
const ModalConfirmacao = ({ onConfirm, onCancel }) => {
    return (
        <ModalContainer>
            <ModalContent>
                <Title>Criar Exercício</Title>
                <Message>Deseja criar um exercício com os itens selecionados?</Message>
                <ButtonContainer>
                    <CancelButton onClick={onCancel}>Não</CancelButton>
                    <ConfirmButton onClick={onConfirm}>Sim</ConfirmButton>
                </ButtonContainer>
            </ModalContent>
        </ModalContainer>
    );
};

export default ModalConfirmacao;
