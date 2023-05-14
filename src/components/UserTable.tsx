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
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useStompClient } from 'react-stomp-hooks';

interface UsersTableProps {
  data: { name: string; role: string }[];
}

export function UsersRolesTable({ data }: UsersTableProps) {
  const lobbyId = sessionStorage.getItem('lobbyId');
  const stompClient = useStompClient();
  const handleKickingUser = (name: string) => {
    if (stompClient) {
      console.log('kicking user');
      console.log("lobbyId: ", lobbyId);
      stompClient.publish({
        destination: `/app/games/${lobbyId}/remove`,
        body: JSON.stringify({ name }),
      });
    } else {
      console.error('Error: Could not send message');
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
        <Group spacing={0} position="right">
          <ActionIcon>
            <IconPencil size="1rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => { handleKickingUser(item.name) }}>
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
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
