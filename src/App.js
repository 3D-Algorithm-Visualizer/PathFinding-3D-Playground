import React, { Suspense } from "react";
import "./App.scss";
import World from "./components/World";

function App() {
  return (
    <>
      <Suspense fallback={<>{"Loading"}</>}>
        <World />
      </Suspense>
    </>
  );
}

export default App;
