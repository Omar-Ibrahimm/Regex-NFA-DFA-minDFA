import RegexForm from "./RegexForm";
import FSMCard from "./FSMCard";
import { useRegexContext } from "../../contexts/RegexContext";

const HomePage = () => {
  const { isRegexLoaded, fsms } = useRegexContext();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <RegexForm />
      <div className="mt-8 space-y-6">
        {fsms.map((fsm, index) => (
          <div key={index}>
            <FSMCard fsmType={fsm.type} hasRegex={isRegexLoaded} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
