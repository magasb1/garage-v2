import { useState } from "react";
import axios from 'axios';

function App() {
  const [data, setData] = useState();

  const handleClick = async () => {
    const response = await axios.post("/api/door");
    setData(response.data);
  };

  return (
    <div className="flex">
      <div className="flex w-full h-full items-center justify-center">

        <button
          type="button"
          className="border rounded m-5 py-6 px-8 bg-blue-500 text-white text-xl"
          onClick={() => handleClick()}
          >
          Push
        </button>
        {data && (<p>{JSON.stringify(data)}</p>)}
          </div>
    </div>
  );
}
export default App;
