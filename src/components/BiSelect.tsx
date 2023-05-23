import { Button } from "@mantine/core";

type PropsType = {
  aSelected: boolean;
  labelA: string;
  labelB: string;
  setASelected: Function;
};
export const BiSelect = (props: PropsType) => {
  const { aSelected, labelA, labelB, setASelected } = props;

  return (
    <div>
      <Button
        size="xl"
        color={aSelected ? "blue" : "gray"}
        style={{ borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
        onClick={() => setASelected(true)}
      >
        {labelA}
      </Button>
      <Button
        size="xl"
        color={aSelected ? "gray" : "blue"}
        style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
        onClick={() => setASelected(false)}
      >
        {labelB}
      </Button>
    </div>
  );
};
