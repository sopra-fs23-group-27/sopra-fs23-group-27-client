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
import { useEffect, useState } from 'react';

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
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  setContinent(continents: string[]): void;
  title: string;
  description: string;
  image: string;
}

export function ImageCheckbox({
  checked = true,
  onChange,
  setContinent,
  title,
  description,
  className,
  image,
  ...others
}: ImageCheckboxProps & Omit<React.ComponentPropsWithoutRef<'button'>, keyof ImageCheckboxProps>) {
  const [value, setValue] = useState(checked);

  const handleChange = () => {
    const updatedValue = !value;
    setValue(updatedValue);
    updateContinents(updatedValue);
  };

  const { classes, cx } = useStyles({ checked: value });

  const updateContinents = (checked: boolean) => {
    const updatedContinents = [...continents];
    if (checked) {
      updatedContinents.push(title);
    } else {
      const index = updatedContinents.indexOf(title);
      if (index !== -1) {
        updatedContinents.splice(index, 1);
      }
    }
    // setContinent([JSON.stringify(updatedContinents)]);
    setContinent(updatedContinents);
  };


  useEffect(() => {
    updateContinents(value);
  }, []);

  return (
    <UnstyledButton
      {...others}
      onClick={handleChange}
      className={cx(classes.button, className)}
    >
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

const continents: string[] = regions.map((region) => region.title);

export function ImageCheckboxes({ setContinent }: { setContinent: (continent: string[]) => void }) {
  const items = regions.map((item) => (
    <ImageCheckbox {...item} key={item.title} setContinent={setContinent} />
  ));
  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        { maxWidth: 'md', cols: 2 },
        { maxWidth: 'sm', cols: 1 },
      ]}
    >
      {items}
    </SimpleGrid>
  );
}