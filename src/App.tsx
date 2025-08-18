import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <h1 className="text-2xl text-red-500 font-bold">Hello World!</h1>
      <Button
        className="cursor-pointer"
        variant={"outline"}
        onClick={() => {
          alert("Test Test 123");
        }}
      >
        This is a button
      </Button>
    </div>
  );
}

export default App;
