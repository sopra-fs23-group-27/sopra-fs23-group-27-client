import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStompClient, useSubscription } from "react-stomp-hooks";
import { useEffectOnce } from "../customHooks/useEffectOnce";

export const ScoreBoard = () => {
    const { lobbyId } = useParams();
    const stompClient = useStompClient();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [playerScores, setPlayerScores] = useState([]);
    const [winner, setWinner] = useState("");
    const [winnerScore, setWinnerScore] = useState(0);
    const [isWinner, setIsWinner] = useState(false);
    const [isTie, setIsTie] = useState(false);
    const [isLoser, setIsLoser] = useState(false);
    const [loser, setLoser] = useState("");
    const [loserScore, setLoserScore] = useState(0);
    const [tie, setTie] = useState("");

    // get the player token from local storage
    const playerToken = localStorage.getItem("token");

    // get the player name from local storage
    const playerName = localStorage.getItem("playerName");

    useEffectOnce(() => {
        if (stompClient) {
            stompClient.publish({
                destination: "/app/authentication",
                body: JSON.stringify({ playerToken }),
            });
        } else {
            console.error("Error: Could not send message");
        }
    });

    useSubscription(
        `/user/queue/lobbies/${lobbyId}/scoreboard`,
        (message: any) => {
            setIsLoading(false);
            const playerScores = JSON.parse(message.body).playerScores as never[];
            const winner = JSON.parse(message.body).winner as string;
            const winnerScore = JSON.parse(message.body).winnerScore as number;
            const loser = JSON.parse(message.body).loser as string;
            const loserScore = JSON.parse(message.body).loserScore as number;
            const tie = JSON.parse(message.body).tie as string;
            console.log("Message from server: ", playerScores);
            console.log("Message from server: ", winner);
            console.log("Message from server: ", winnerScore);
            console.log("Message from server: ", loser);
            console.log("Message from server: ", loserScore);
            console.log("Message from server: ", tie);
            setPlayerScores(playerScores);
            setWinner(winner);
            setWinnerScore(winnerScore);
            setLoser(loser);
            setLoserScore(loserScore);
            setTie(tie);
            if (playerName === winner) {
                setIsWinner(true);
            } else if (playerName === loser) {
                setIsLoser(true);
            } else if (playerName === tie) {
                setIsTie(true);
            }
        }
    );

    const goToLobby = () => {
        navigate("/lobbies/" + lobbyId);
    }

    const anotherGame = () => {
        navigate("/lobbies/" + lobbyId);
    }

    return (
        <div>
            <h1>Scoreboard</h1>
            <div>
                <h2>Winner: {winner}</h2>
                <h2>Score: {winnerScore}</h2>
            </div>
            <div>
                <h2>Loser: {loser}</h2>
                <h2>Score: {loserScore}</h2>
            </div>
            <div>
                <h2>Tie: {tie}</h2>
            </div>
            <div>
                <h2>Player Scores</h2>
                {playerScores.map((playerScore: any) => (
                    <div>
                        <h3>{playerScore.playerName}</h3>
                        <h3>{playerScore.score}</h3>
                    </div>
                ))}
            </div>
            <div>
                <button onClick={goToLobby}>Go to Lobby</button>
                <button onClick={anotherGame}>Another Game</button>
            </div>
        </div>
    );
};