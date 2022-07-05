import React, { useEffect, useState } from "react";
import axios from 'axios';

function App() {
  const [data, setData] = useState();

  const handleClick = async () => {
    const response = await axios.post("/api/door");
    console.log(response.data)
    setData(response.data);
  };

  return (
    <div className="">
      <header>
        <button
          type="button"
          className=""
          onClick={() => handleClick()}
        >
          Toggle
        </button>
        {data && (<p>{JSON.stringify(data)}</p>)}
      </header>
    </div>
  );
}
export default App;
