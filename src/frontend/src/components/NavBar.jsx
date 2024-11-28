import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";  // Importando o Link do react-router-dom
import PersonIcon from '../assets/personIcon.svg';
import GymIcon from '../assets/gymIcon.svg';
import CustomerIcon from '../assets/customerIcon.svg';
import Logo from '../assets/logo.png';

/**
 * Estilo para o componente de navegação (Nav). Define a aparência do menu principal,
 * incluindo largura máxima, cor de fundo, alinhamento e preenchimento.
 */
const Nav = styled.nav`
  max-width: 100vw;
  background-color: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2vh 5vw;
  box-sizing: border-box;
`;

/**
 * Estilo para o contêiner de ícones da barra de navegação. Define a largura, 
 * exibe os ícones de forma espaçada entre si.
 */
const IconsContainer = styled.div`
  width: 12vw;
  display: flex;
  justify-content: space-between;
`;

/**
 * Estilo para o logo da aplicação. Define a largura do ícone do logo.
 */
const LogoIcon = styled.img`  
  width: 12vw;
`;

/**
 * Estilo para o contêiner de busca. Organiza o campo de entrada e o ícone de busca,
 * aplicando um fundo cinza claro, borda arredondada e padding.
 */
const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #EFEFEF;
  border-radius: 0.5vw;
  padding: 1vh 3vw;
  flex-grow: 1;
  max-width: 30vw; 
  margin: 0 1vw;
`;

/**
 * Estilo para o campo de entrada de pesquisa. Remove as bordas e o contorno, mantendo 
 * o fundo cinza claro, similar ao estilo do contêiner de busca.
 */
const SearchInput = styled.input`
  border: none;
  outline: none;
  background: #EFEFEF;
`;

/**
 * Estilo para os ícones da barra de navegação. Define o tamanho e o comportamento de 
 * cursor para o ícone, que muda para um cursor de pointer quando o ícone é clicado.
 */
const IconNavBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2vw;

  :hover {
    cursor: pointer;
  }
`;

/**
 * Componente de Navegação (NavBar)
 * 
 * Exibe a barra de navegação com o logo, a área de pesquisa e ícones para acessar
 * diferentes páginas do aplicativo. Os links permitem a navegação para as páginas 
 * de pacientes, perfil do usuário e home.
 * 
 * @returns {JSX.Element} A barra de navegação contendo o logo, pesquisa e ícones de navegação.
 */
const NavBar = () => {
  return (
    <Nav>
      <Link to="/">
        <LogoIcon src={Logo} />
      </Link>
      <SearchContainer>
        <SearchInput type="text" title="Preencha este campo" />
        <FaSearch />
      </SearchContainer>
      <IconsContainer>
        <Link to="/pacientes">
          <IconNavBar>
            <img src={CustomerIcon} alt="Customer Icon" width={"100%"} title="Pacientes" />
          </IconNavBar>
        </Link>
        <Link to="/">
          <IconNavBar>
            <img src={GymIcon} alt="Gym Icon" width={"100%"} title="Avaliações e Exercícios" />
          </IconNavBar>
        </Link>
        <Link to="/perfil">
          <IconNavBar>
            <img src={PersonIcon} alt="Person Icon" width={"100%"} title="Perfil" />
          </IconNavBar>
        </Link>
      </IconsContainer>
    </Nav>
  );
};

export default NavBar;