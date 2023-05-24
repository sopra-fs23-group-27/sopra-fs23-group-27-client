import { Badge, Table, Group, Text, ActionIcon } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useStompClient } from "react-stomp-hooks";
import { Player } from "../types/Player";
import { Lobby } from "../types/Lobby";

type PropsType = {
  data: { name: string; role: string }[];
  player: Player | undefined;
  lobby: Lobby | undefined;
};

export function UsersRolesTable(props: PropsType) {
  const stompClient = useStompClient();

  // get props
  const { data, player, lobby } = props;

  // kick user from lobby
  const handleKickingUser = (name: string) => {
    if (stompClient) {
      console.log("kicking user");
      console.log("lobbyId: ", lobby?.lobbyId);
      try {
        stompClient.publish({
          destination: `/app/games/${lobby?.lobbyId}/remove`,
          body: JSON.stringify({ playerName: name }),
        });
      } catch (error: any) {
        notifications.show({
          title: "Error",
          message: error.message,
          color: "red",
        });
        console.log(error);
      }
    } else {
      console.error("Error: Could not send message");
    }
  };

  const rows = data.map((item) => (
    <tr key={item.name}>
      <td>
        <Group spacing="sm">
          <div>
            <Text fz="sm" fw={500}>
              {item.name}
            </Text>
          </div>
        </Group>
      </td>

      {/* <td>
        <Select data={rolesData} defaultValue={item.role} variant="unstyled" />
      </td> */}

      <td>
        <Badge color="red" fullWidth>
          {item.role}
        </Badge>
      </td>

      <td>
        {1 ? (
          <Badge fullWidth>Joined</Badge>
        ) : (
          <Badge color="gray" fullWidth>
            Offline
          </Badge>
        )}
      </td>
      <td>
        {player?.playerName !== item.name && player?.isCreator ? (
          <ActionIcon
            variant="outline"
            color="red"
            radius="xl"
            onClick={() => handleKickingUser(item.name)}
          >
            <IconTrash />
          </ActionIcon>
        ) : (
          ""
        )}
      </td>
    </tr>
  ));

  return (
    <Table miw={800} verticalSpacing="sm">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
