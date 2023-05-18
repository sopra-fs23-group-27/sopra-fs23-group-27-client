import { Button } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

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
        color={aSelected ? "blue" : "gray"}
        style={{ borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
        onClick={() => setASelected(true)}
      >
        {labelA}
      </Button>
      <Button
        color={aSelected ? "gray" : "blue"}
        style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
        onClick={() => setASelected(false)}
      >
        {labelB}
      </Button>
    </div>
  );
};
