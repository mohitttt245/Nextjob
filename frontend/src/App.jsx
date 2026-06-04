import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import InternshipsPage from "./pages/InternshipsPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import ResumeTemplatesPage from "./pages/ResumeTemplatesPage";
import AIInterviewPage from "./pages/AIInterviewPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/internships" element={<InternshipsPage />} />
      <Route path="/resume-builder" element={<ResumeBuilderPage />} />
      <Route path="/resume-templates" element={<ResumeTemplatesPage />} />
      <Route path="/ai-interview" element={<AIInterviewPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Layout>
);

export default App;
