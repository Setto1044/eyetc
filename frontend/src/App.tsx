import { BrowserRouter, Routes, Route } from "react-router-dom";

import StreamerPage from "../src/assets/pages/StreamerPage";
import ViewerPage from "../src/assets/pages/ViewerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/streamer" element={<StreamerPage />} />
        <Route path="/viewer" element={<ViewerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;