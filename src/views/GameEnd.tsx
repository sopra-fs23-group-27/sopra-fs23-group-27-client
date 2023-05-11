import styled from "styled-components";
import { Button } from "@mantine/core";

const Application = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
  justify-content: center;
  align-items: center;

  width: 80vw;
  height: 90vh;
  margin: auto;
`;

const Container = styled.div`
  width: 60%;
  display: flex;
`;
const UpperRankContainer = styled(Container)`
  justify-content: center;
`;
const LowerRankContainer = styled(Container)`
  justify-content: space-between;
`;

const Card = styled.div`
  border: 0.0625rem solid #dee2e6;
  border-radius: 0.5rem;
  padding: 16px 28px;
  text-align: center;
  width: 190px;

  box-shadow: blue 0px 0px 0px 2px inset, rgb(255, 255, 255) 10px -10px 0px -3px,
    rgb(31, 193, 27) 10px -10px, rgb(255, 255, 255) 20px -20px 0px -3px,
    rgb(255, 217, 19) 20px -20px, rgb(255, 255, 255) 30px -30px 0px -3px,
    rgb(255, 156, 85) 30px -30px, rgb(255, 255, 255) 40px -40px 0px -3px,
    rgb(255, 85, 85) 40px -40px;
`;
const FirstRankCard = styled(Card)`
  position: relative;
  top: 200px;
`;
const ButtonContainer = styled(Container)`
  justify-content: center;
  gap: 32px;
`;
export const GameEnd = () => {
  return (
    <Application>
      <UpperRankContainer>
        <FirstRankCard>
          <h2>1.</h2>
          <h1>Joel</h1>
          <p>70 points</p>
        </FirstRankCard>
      </UpperRankContainer>
      <LowerRankContainer>
        <Card>
          <h2>2.</h2>
          <h1>Paula</h1>
          <p>66 points</p>
        </Card>
        <Card>
          <h2>3.</h2>
          <h1>Lea</h1>
          <p>59 points</p>
        </Card>
      </LowerRankContainer>

      <Container>Your Rank: 6, with 42 points</Container>
      <ButtonContainer>
        <Button disabled={false} onClick={() => console.log("play again")}>
          Play again
        </Button>
        <Button disabled={true} onClick={() => console.log("register")}>
          Register to save your stats
        </Button>
      </ButtonContainer>
    </Application>
  );
};
