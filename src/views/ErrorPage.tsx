import styled from "styled-components";
import { useNavigate, useRouteError } from "react-router-dom";
import Logo from "../icons/DALL-E_FlagMania_Logo.png";

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
  const navigate = useNavigate();
  console.error(error);

  return (
    <Container>
      <img
        src={Logo}
        alt="FlagMania Logo"
        onClick={() => navigate("/")}
        style={{
          top: "10px",
          left: "10px",
          padding: "10px",
          width: "5%",
          height: "auto",
          position: "absolute",
          cursor: "pointer",
        }}
      />
      <p>An unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </Container>
  );
};
