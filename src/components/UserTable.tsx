import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useStompClient } from "react-stomp-hooks";

interface UsersTableProps {
  data: { name: string; role: string }[];
}

export function UsersRolesTable({ data }: UsersTableProps) {
  const navigate = useNavigate();
  const lobbyId = sessionStorage.getItem("lobbyId");
  const currentPlayer = sessionStorage.getItem("currentPlayer");
  const stompClient = useStompClient();

  // kick user from lobby
  const handleKickingUser = (name: string) => {
    if (stompClient) {
      console.log("kicking user");
      console.log("lobbyId: ", lobbyId);
      try {
        stompClient.publish({
          destination: `/app/games/${lobbyId}/remove`,
          body: JSON.stringify({ playerName: name }),
        });
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Could not kick user",
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
        {currentPlayer === item.name ? (
          <ActionIcon variant="outline" color="blue" radius="xl">
            <IconPencil />
          </ActionIcon>
        ) : (
          <ActionIcon
            variant="outline"
            color="red"
            radius="xl"
            onClick={() => handleKickingUser(item.name)}
          >
            <IconTrash />
          </ActionIcon>
        )}
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
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
    </ScrollArea>
  );
}
