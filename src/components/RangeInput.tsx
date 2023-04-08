import styled from "styled-components";

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
  const { value, setNewValue, min, max } = props;

  return (
    <Container>
      <Main>
        <SmallP style={{ position: "relative", left: "1px" }}>{min}</SmallP>
        <MainInput
          type="range"
          value={value}
          min={min}
          max={max}
          onChange={(e) => setNewValue(e.currentTarget.value)}
        />
        <SmallP style={{ position: "relative", right: "1px" }}>{max}</SmallP>
      </Main>

      <Value>
        <p>{value}</p>
      </Value>
    </Container>
  );
};
