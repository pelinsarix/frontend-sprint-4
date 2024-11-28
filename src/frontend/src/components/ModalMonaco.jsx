import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MonacoEditor from './MonacoEditor';
import { useEffect } from 'react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background-color: #1e1e1e;
  width: 90vw;
  height: 90vh;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { 
      transform: translateY(-20px);
      opacity: 0;
    }
    to { 
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #333;
  background-color: #252525;
  border-radius: 8px 8px 0 0;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '📝';
    font-size: 1.2em;
  }
`;

const ModalContent = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #1e1e1e;
  overflow: hidden;
  position: relative;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: #252525;
  border-top: 1px solid #333;
  border-radius: 0 0 8px 8px;
`;

const Button = styled.button`
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(142, 182, 191, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.close {
    background-color: #3a3a3a;
    color: #fff;

    &:hover:not(:disabled) {
      background-color: #4a4a4a;
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  }

  &.save {
    background-color: #8EB6BF;
    color: #fff;

    &:hover:not(:disabled) {
      background-color: #659AA6;
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  }
`;

const StatusBar = styled.div`
  padding: 0.5rem 1.5rem;
  background-color: #252525;
  color: #888;
  font-size: 0.75rem;
  border-top: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatusItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ModalMonaco = ({ 
  isOpen, 
  onClose, 
  onSave, 
  title = "Editor Lucaoshow", 
  initialValue,
  readOnly = false 
}) => {
  const [code, setCode] = useState(initialValue);
  const [isDirty, setIsDirty] = useState(false);

  // Log para depuração
  console.log('initialValue:', initialValue);
  console.log('code:', code);

  // Sincronizar initialValue com code
  useEffect(() => {
    setCode(initialValue);
    setIsDirty(false);
  }, [initialValue]);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    onSave?.(code);
    setIsDirty(false);
  }, [code, onSave]);

  const handleClose = useCallback((e) => {
    if (e.target === e.currentTarget) {
      if (isDirty) {
        if (window.confirm('Existem alterações não salvas. Deseja realmente fechar?')) {
          onClose();
        }
      } else {
        onClose();
      }
    }
  }, [isDirty, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClose(e);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }, [handleClose, handleSave]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose} onKeyDown={handleKeyDown} tabIndex={-1}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>{title}</Title>
        </ModalHeader>
        
        <ModalContent>
          <MonacoEditor 
            value={code} 
            onChange={handleCodeChange} 
            options={{
              readOnly,
              automaticLayout: true,
            }}
          />
        </ModalContent>

        <StatusBar>
          <StatusItem>
            📝 {isDirty ? "Não salvo" : "Salvo"}
          </StatusItem>
          <StatusItem>
            🔤 Lucaoshow
          </StatusItem>
        </StatusBar>

        <ModalFooter>
          <Button 
            className="close" 
            onClick={onClose}
            title="Esc"
          >
            Cancelar
          </Button>
          <Button 
            className="save" 
            onClick={handleSave}
            disabled={!isDirty || readOnly}
            title="Ctrl + S"
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

ModalMonaco.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  title: PropTypes.string,
  initialValue: PropTypes.string,
  readOnly: PropTypes.bool
};

export default ModalMonaco;