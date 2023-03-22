import styled from "styled-components";
import "./App.css";
import { Link } from "react-router-dom";

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
const SamplePlayers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const App = () => {
  return (
    <Container>
      <h1>Hello World!</h1>
      <Ul>
        {SamplePlayers.map((id) => (
          <li>
            <Link to={`/players/${id}`}>Player {id}</Link>
          </li>
        ))}
      </Ul>
    </Container>
  );
};
