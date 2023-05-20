import styled, { keyframes } from "styled-components";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  border-radius: 0.6em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/*
const Container = styled.div`
  height: 34em;
  width: 34em;
  background-color: #ffffff;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  border-radius: 0.6em;
  box-shadow: 0 1.5em 3.5em rgba(32, 47, 80, 0.2);
`;
*/

const RainbowAnimation = keyframes`
  30% {
    transform: translate(-50%, -50%) rotate(180deg);
  }
  55% {
    transform: translate(-50%, -50%) rotate(180deg);
  }
  85% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;
const RainbowColor = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  animation: ${RainbowAnimation} 3s infinite;
  transform-origin: 50% 0;
`;

const Rainbow1 = styled(RainbowColor)`
  height: 11.25em;
  width: 22.5em;
  border: 1.25em solid #e40303;
  border-top: none;
  top: calc(50% + 5.62em);
  border-radius: 0 0 11.25em 11.25em;
  animation-delay: 0.5s;
`;
const Rainbow2 = styled(RainbowColor)`
  height: 10em;
  width: 20em;
  border: 1.25em solid #ff8c00;
  border-top: none;
  top: calc(50% + 5em);
  border-radius: 0 0 10em 10em;
  animation-delay: 0.4s;
`;
const Rainbow3 = styled(RainbowColor)`
  height: 8.75em;
  width: 17.5em;
  border: 1.25em solid #ffed00;
  border-top: none;
  top: calc(50% + 4.37em);
  border-radius: 0 0 8.75em 8.75em;
  animation-delay: 0.3s;
`;
const Rainbow4 = styled(RainbowColor)`
  height: 7.5em;
  width: 15em;
  border: 1.25em solid #008026;
  border-top: none;
  top: calc(50% + 3.75em);
  border-radius: 0 0 7.5em 7.5em;
  animation-delay: 0.2s;
`;
const Rainbow5 = styled(RainbowColor)`
  height: 6.25em;
  width: 12.5em;
  border: 1.25em solid #004dff;
  border-top: none;
  top: calc(50% + 3.12em);
  border-radius: 0 0 6.25em 6.25em;
  animation-delay: 0.1s;
`;
const Rainbow6 = styled(RainbowColor)`
  height: 5em;
  width: 10em;
  border: 1.25em solid #750787;
  border-top: none;
  top: calc(50% + 2.5em);
  border-radius: 0 0 5em 5em;
  animation-delay: 0.05s;
`;

export const RainbowLoader = () => {
  return (
    <Container>
      <Rainbow1 />
      <Rainbow2 />
      <Rainbow3 />
      <Rainbow4 />
      <Rainbow5 />
      <Rainbow6 />
    </Container>
  );
};
