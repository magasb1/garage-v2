import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState();

  const handleClick = async () => {
    const response = await axios.post(
      "/api/door",
      {},
      {
        headers: { authorization: `Bearer ${payload.token}` },
      }
    );
    toast.success(response.data.message);
  };

  return (
    <div className="flex h-screen">
      {isAuthenticated === false ? (
        <Login states={{ setPayload, setIsAuthenticated }} />
      ) : (
        <div className="flex flex-col w-full h-full items-center justify-center">
          <button
            type="button"
            className="border rounded m-5 py-6 px-8 bg-blue-500 text-white text-xl"
            onClick={() => handleClick()}
          >
            Push
          </button>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              className: "",
              duration: 5000,
            }}
          />
        </div>
      )}
    </div>
  );
}
export default App;
