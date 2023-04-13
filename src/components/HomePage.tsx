import styled from "styled-components";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 38px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 40vh;
`;

const OrangeButton = styled.button`
  width: 200px;
  height: 50px;
  background-color: #ffa500;
  border: 1px solid #000;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
`;

const GreenButton = styled.button`
  width: 200px;
  height: 50px;
  background-color: #90ee90;
  border: 1px solid #000;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
`;
  
export const HomePage = () => {  
  return (
    <Container>
      <h1>FlagMania</h1>
      <p>Play the game and learn about the flags of the world!</p>
      <ButtonContainer>
        <Link to="/publicGame"><OrangeButton>
          Join Public Game
        </OrangeButton></Link>
        <Link to="/privateGame"><GreenButton>
          Join Private Game
        </GreenButton></Link>
        <Link to="/newGame"><OrangeButton>
          Create New Game
        </OrangeButton></Link>
      </ButtonContainer>
    </Container>
  );
};