import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";

function App() {

  return (
    <>
      <>
        <BrowserRouter>
          <Routes>
            <Route index element={<Main />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </BrowserRouter>
      </>
    </>

  )
}

export default App
