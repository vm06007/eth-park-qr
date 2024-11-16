import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import { Home } from "@/pages";
// @ts-ignore
import Welcome from "@/components/welcome/src/Welcome";

function App() {
  return (
    <Router>
      <main className="min-h-screen flex flex-col justify-between">
        <Routes>
          <Route path="/old" element={<Home />} />
          <Route path="/" element={<Welcome />} />
        </Routes>
        <Footer />
        <Toaster />
      </main>
    </Router>
  );
}

export default App;
