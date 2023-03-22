import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;

  font-size: 38px;
`;
export const HomePage = () => {
  return (
    <Container>
      <h1>Group 27</h1>
      <h1>FlagMaina</h1>
    </Container>
  );
};
