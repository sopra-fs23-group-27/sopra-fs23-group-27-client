import styled from "styled-components";
import FlagLogo from "../icons/DALL-E_FlagMania_Logo.png";
import { useNavigate } from "react-router-dom";

const FlagManiaLogo = styled.img`
  top: 10px;
  left: 10px;
  padding: 10px;
  width: 180px;
  height: auto;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  transition: transform 200ms ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
  @media (max-width: 700px) {
    width: 100px;
  }
  @media (max-width: 550px) {
    top: 5px;
    left: 5px;
    width: 70px;
  }
`;

export const FlagmaniaLogo = () => {
  const navigate = useNavigate();

  return <FlagManiaLogo onClick={() => navigate("/")} src={FlagLogo} />;
};
