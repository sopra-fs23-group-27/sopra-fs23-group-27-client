import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;

  font-size: 38px;
`;
export const GameView = () => {
  return (
    <Container>
      <h1>Group 27</h1>
      <h1>FlagMania</h1>
    </Container>
  );
};