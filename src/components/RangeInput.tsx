import styled from "styled-components";
import { Slider } from "@mantine/core";
import { useHover } from "@mantine/hooks";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
const Main = styled.div`
  display: flex;
  align-items: center;
`;
const SmallP = styled.p`
  font-size: 14px;
`;
const MainInput = styled.input`
  width: 150px;
`;
const Value = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  background-color: lightgray;
`;

type PropsType = {
  min: number;
  max: number;
  value: number;
  setNewValue: Function;
};
export const RangeInput = (props: PropsType) => {
  const { hovered, ref } = useHover();
  const { value, setNewValue, min, max } = props;

  return (
    <Container>
      <Slider
        value={value}
        min={min}
        max={max}
        onChange={(newVal) => setNewValue(newVal)}
        styles={{
          thumb: {
            transition: "opacity 150ms ease",
            opacity: hovered ? 1 : 0,
          },

          dragging: {
            opacity: 1,
          },
        }}
        style={{ width: "230px" }}
      />

      <Value>
        <p>{value}</p>
      </Value>
    </Container>
  );
};
