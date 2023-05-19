import styled from "styled-components";
import uniqid from "uniqid";

const Container = styled.div`
  position: relative;
  padding: 15px 0;
`;
const Input = styled.input`
  padding: 5px 12px;
  border-radius: 10px;
  border: 1px solid black;
  background-color: #f5f7f9;
  font-size: 28px;
`;
const Label = styled.label`
  position: absolute;

  padding: 0 2px;
  left: 10px;
  top: 22px;
  color: dimgray;
  background-color: #f5f7f9;
  font-size: 28px;
  line-height: 1;
  transition: top 120ms ease-in, font-size 120ms ease-in;
  &:hover {
    cursor: text;
  }
  ${Input}:not(:placeholder-shown) ~ & {
    top: 2px;
    font-size: 18px;
    color: black;
  }
  ${Input}:focus ~ & {
    top: 2px;
    font-size: 18px;
    color: black;
  }
`;

type PropsType = {
  label: string;
  value: string;
  onChange: Function;
};
export const FloatingTextInput = (props: PropsType) => {
  const id = uniqid();
  const { label, value, onChange } = props;
  return (
    <Container>
      <Input
        id={id}
        type="text"
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
      <Label htmlFor={id}>{label}</Label>
    </Container>
  );
};
