import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DynamicPage from "./pages/DynamicPage";
import { AccessibilityPanel } from "./components/AccessibilityPanel";

const App = () => (
  <>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/halaman/:slug" element={<DynamicPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <AccessibilityPanel />
  </>
);

export default App;
