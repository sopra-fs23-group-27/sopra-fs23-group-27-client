import styled from "styled-components";

import { useRouteError } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  justify-content: center;
  align-items: center;
`;
type ErrorType = {
  statusText: string;
  message: string;
};
export const ErrorPage = () => {
  const error = useRouteError() as ErrorType;
  console.error(error);

  return (
    <Container>
      <p>An unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </Container>
  );
};
