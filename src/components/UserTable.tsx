import { Badge, Table, Group, Text, Select, ScrollArea } from '@mantine/core';

interface UsersTableProps {
  data: { name: string; role: string }[];
}

const rolesData = ['Creator', 'Player'];

export function UsersRolesTable({ data }: UsersTableProps) {
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

      <td>
        <Select data={rolesData} defaultValue={item.role} variant="unstyled" />
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
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}