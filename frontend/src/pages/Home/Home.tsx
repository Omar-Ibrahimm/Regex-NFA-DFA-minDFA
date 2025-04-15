import RegexInput from "./RegexInput";
import FSMCard from "./FSMCard";

const Home = () => {
  return (
    <main className="min-h-screen bg-primary py-10 flex justify-center">
      <div className="max-w-xl w-full flex flex-col items-center">
        <RegexInput />
        <div className="grid grid-cols-1 gap-6 mt-8 w-full">
          <FSMCard fsmType="NFA" />
          <FSMCard fsmType="DFA" />
          <FSMCard fsmType="MIN_DFA" />
        </div>
      </div>
    </main>
  );
};

export default Home;
