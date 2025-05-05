import IHelloProps from "./IHelloProps";

const Hello: React.FC<IHelloProps> = ({ name = "test" }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Hello {name}!</h1>
      <p className="text-gray-500">Welcome to the world of React!</p>
    </div>
  );
};

export default Hello;
