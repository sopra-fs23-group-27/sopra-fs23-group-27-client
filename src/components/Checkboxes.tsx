import {
  UnstyledButton,
  Checkbox,
  Text,
  Image,
  SimpleGrid,
  createStyles,
  rem,
} from '@mantine/core';
import Africa from "../icons/Africa.png";
import Asia from "../icons/Asia.png";
import Europe from "../icons/Europe.png";
import Americas from "../icons/Americas.png";
import Oceania from "../icons/Oceania.png";
import { useState } from 'react';

const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
  button: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    transition: 'background-color 150ms ease, border-color 150ms ease',
    border: `${rem(1)} solid ${
      checked
        ? theme.fn.variant({ variant: 'outline', color: theme.primaryColor }).border
        : theme.colorScheme === 'dark'
        ? theme.colors.dark[8]
        : theme.colors.gray[3]
    }`,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    backgroundColor: checked
      ? theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background
      : theme.colorScheme === 'dark'
      ? theme.colors.dark[8]
      : theme.white,
  },

  body: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
}));

interface ImageCheckboxProps {
  checked?: boolean;
  title: string;
  description: string;
  image: string;
  updateContinents(checked: boolean, title: string): void;
  setContinent(continents: string[]): void;
}

export function ImageCheckbox({
  checked = true,
  updateContinents,
  setContinent,
  title,
  description,
  image,
}: ImageCheckboxProps) {
  const [value, setValue] = useState(checked);

  const handleChange = () => {
    const updatedValue = !value;
    setValue(updatedValue);
    updateContinents(updatedValue, title);
  };

  const { classes, cx } = useStyles({ checked: value });

  return (
    <UnstyledButton onClick={handleChange} className={cx(classes.button)}>
      <Image src={image} alt={title} width={40} />

      <div className={classes.body}>
        <Text color="dimmed" size="xs" sx={{ lineHeight: 1 }} mb={5}>
          {description}
        </Text>
        <Text weight={500} size="sm" sx={{ lineHeight: 1 }}>
          {title}
        </Text>
      </div>

      <Checkbox
        checked={value}
        onChange={() => {}}
        tabIndex={-1}
        styles={{ input: { cursor: 'pointer' } }}
      />
    </UnstyledButton>
  );
}

const regions = [
  { description: 'Region 1', title: 'Asia', image: Asia },
  { description: 'Region 2', title: 'Europe', image: Europe },
  { description: 'Region 3', title: 'Africa', image: Africa },
  { description: 'Region 4', title: 'Oceania', image: Oceania },
  { description: 'Region 5', title: 'Americas', image: Americas },
];

export function ImageCheckboxes({ setContinent }: { setContinent: (continent: string[]) => void }) {
  const allContinents = ["Europe", "Asia", "Africa", "Americas", "Oceania"];
  const [selectedContinents, setSelectedContinents] = useState(allContinents);

  const updateContinents = (checked: boolean, title: string) => {
    let updatedContinents: string[];
    if (checked) {
      updatedContinents = [...selectedContinents, title];
    } else {
      updatedContinents = selectedContinents.filter((continent) => continent !== title);
    }
    setSelectedContinents(updatedContinents);
    setContinent(updatedContinents);
  };

  return (
    <SimpleGrid
      cols={3}
      breakpoints={[
        { maxWidth: 'xl', cols: 3 },
        { maxWidth: 'sm', cols: 2 },
        { maxWidth: 'xs', cols: 1 },
      ]}
      spacing={10}
    >
      {regions.map((item) => (
        <ImageCheckbox
          key={item.title}
          updateContinents={updateContinents}
          setContinent={setContinent}
          {...item}
          checked={selectedContinents.includes(item.title)}
        />
      ))}
    </SimpleGrid>
  );
}