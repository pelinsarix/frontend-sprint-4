import styled from "styled-components";

/**
 * Container principal do modal. Fica fixado na tela com fundo semitransparente.
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
 * Conteúdo interno do modal. Definido com uma largura e altura fixa,
 * com bordas arredondadas e uma sombra para destacar o modal.
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
 * Título do modal. Utilizado para exibir o texto principal do modal.
 */
const Title = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin: 0 0 0.5rem;
`;

/**
 * Mensagem do modal. Texto informativo exibido abaixo do título.
 */
const Message = styled.p`
    font-size: 1rem;
    color: #666;
    margin: 0 0 1rem;
`;

/**
 * Container dos botões do modal. Organiza os botões em linha.
 */
const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

/**
 * Estilo base para os botões do modal. Define o tamanho, borda e transições.
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
 * Estilo para o botão de confirmação (Excluir). 
 * Possui um fundo vermelho com uma cor diferente ao passar o mouse.
 */
const ConfirmButton = styled(Button)`
    background-color: #f44336;
    color: white;
    &:hover {
        background-color: #e53935;
    }
`;

/**
 * Estilo para o botão de cancelamento. 
 * Possui um fundo cinza e muda para uma tonalidade mais escura ao passar o mouse.
 */
const CancelButton = styled(Button)`
    background-color: #C1C1C1;
    color: white;
    &:hover {
        background-color: #A9A9A9;
    }
`;

/**
 * Componente ModalExclusao
 * 
 * Exibe um modal para confirmação de exclusão de um item. 
 * O modal recebe um título, mensagem e funções para as ações de confirmação e cancelamento.
 *
 * @param {string} titulo - Título do modal.
 * @param {string} mensagem - Mensagem informativa sobre a exclusão.
 * @param {function} onConfirm - Função chamada ao confirmar a exclusão.
 * @param {function} onCancel - Função chamada ao cancelar a exclusão.
 * 
 * @returns {JSX.Element} O componente do modal de exclusão.
 */
const ModalExclusao = ({ titulo, mensagem, onConfirm, onCancel }) => {
    return (
        <ModalContainer>
            <ModalContent>
                <Title>{titulo}</Title>
                <Message>{mensagem}</Message>
                <ButtonContainer>
                    <CancelButton onClick={onCancel}>Cancelar</CancelButton>
                    <ConfirmButton onClick={onConfirm}>Excluir</ConfirmButton>
                </ButtonContainer>
            </ModalContent>
        </ModalContainer>
    );
};

export default ModalExclusao;