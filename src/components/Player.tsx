import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

const PlayerBox = styled.div`
  display: flex;
  height: 70vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Player = () => {
  const { playerId } = useParams();

  return (
    <div>
      <PlayerBox>
        <h1>Player {playerId}</h1>

        <Link to="/">Home</Link>
      </PlayerBox>
    </div>
  );
};
