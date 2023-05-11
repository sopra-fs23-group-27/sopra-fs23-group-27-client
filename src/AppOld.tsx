import styled from "styled-components";
import "./App.css";
import { Link } from "react-router-dom";
import {Notifications} from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";

const Container = styled.div`
  display: flex;
  height: 90vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Ul = styled.ul`
  list-style-type: none;
  padding-inline-start: 0;
`;

export const App = () => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <Notifications>
        <Container>
          <h1>Flags of the World</h1>
        </Container>
      </Notifications>
    </MantineProvider>
  );
};
