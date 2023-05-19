import styled from "styled-components";

const OptionsGuessBox = styled.div`
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 600px;
`;
type Props = {
  correct: boolean;
  userSelection: boolean;
  clickable: boolean;
};
const Option = styled.div<Props>`
  display: flex;
  width: 290px;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 22px;
  background-color: ${(p) =>
    p.clickable ? "#228be6" : p.userSelection ? "#1c7ed6" : "lightgray"};
  color: white;
  transition: all 200ms ease-in-out;
  text-align: center;
  border: ${(p) =>
    p.correct ? "4px solid #2B8A3E" : "4px solid rgba(0, 0, 0, 0)"};

  &:hover {
    cursor: ${(p) => (p.clickable ? "pointer" : "not-allowed")};
    ${(p) =>
      p.clickable || p.userSelection
        ? "background-color: #1c7ed6"
        : "lightgray"};
    ${(p) => (p.clickable ? "transform: scale(1.05)" : "")};
  }
`;
const OptionText = styled.p`
  margin: auto;
`;
const ChosenOption = styled.div`
  margin-top: 40px;
  width: 400px;
  padding: 20px;
  font-size: 30px;
  border-radius: 10px;
  text-align: center;

  color: white;
  background-color: #1c7ed6;
`;
type PropsType = {
  correctCountry: string;
  userSelection: string;
  countryOptions: string[];
  submitOptionGuess: Function;
};

export const BasicRoundOptions = (props: PropsType) => {
  const { correctCountry, userSelection, countryOptions, submitOptionGuess } =
    props;

  const lowercaseCorrectCountry = correctCountry
    .toLowerCase()
    .replace(/\s/g, "");
  const lowercaseUserSelection = userSelection.toLowerCase().replace(/\s/g, "");
  const parsedCountryOptions = countryOptions.map((o) =>
    o.toLowerCase().replace(/\s/g, "")
  );

  if (userSelection && !correctCountry) {
    return <ChosenOption>{userSelection}</ChosenOption>;
  }

  return (
    <OptionsGuessBox>
      {parsedCountryOptions.map((o, ind) => {
        return (
          <Option
            correct={lowercaseCorrectCountry === o.toLowerCase()}
            userSelection={lowercaseUserSelection === o.toLowerCase()}
            onClick={() => submitOptionGuess(countryOptions[ind])}
            clickable={!userSelection && !correctCountry}
          >
            <OptionText>{countryOptions[ind]}</OptionText>
          </Option>
        );
      })}
    </OptionsGuessBox>
  );
};
