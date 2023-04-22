import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  font-size: 38px;
`;

const Input = styled.input`
    width: 300px;
    height: 50px;
    border: 1px solid #000;
    border-radius: 5px;
    font-size: 20px;
    font-weight: bold;
    margin: 10px;
`;

const Button = styled.button`
    width: 300px;
    height: 50px;
    background-color: #ffa500;
    border: 1px solid #000;
    border-radius: 5px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
`;

export const NewGame = () => {
    const [gameName, setGameName] = useState("");
    const [gamePassword, setGamePassword] = useState("");
    const [gamePasswordRepeat, setGamePasswordRepeat] = useState("");

    const handleGameNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameName(event.target.value);
    }

    const handleGamePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGamePassword(event.target.value);
    }

    const handleGamePasswordRepeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGamePasswordRepeat(event.target.value);
    }

    let navigate = useNavigate();

    const handleCreateGame = () => {
        console.log("create game");
        return navigate("/configureGame");
    }

    return (
        <Container>
            <h1>Create New Game</h1>
            <Input
                placeholder="Game Name"
                value={gameName}
                type="text"
                onChange={handleGameNameChange}
            />
            <Input
                placeholder="Game Password"
                value={gamePassword}
                type="password"
                onChange={handleGamePasswordChange}
            />
            <Input
                placeholder="Repeat Game Password"
                value={gamePasswordRepeat}
                type="password"
                onChange={handleGamePasswordRepeatChange}
            />
            <Button
                onClick={handleCreateGame}
            >
                Create Game
            </Button>
        </Container>
    );
}