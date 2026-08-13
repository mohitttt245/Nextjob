import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import InternshipsPage from "./pages/InternshipsPage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import ResumeTemplatesPage from "./pages/ResumeTemplatesPage";
import AIInterviewPage from "./pages/AIInterviewPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import BlogAdminPage from "./pages/admin/BlogAdminPage";
import BlogEditorPage from "./pages/admin/BlogEditorPage";

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/internships" element={<InternshipsPage />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/resume-builder" element={<ResumeBuilderPage />} />
      <Route path="/resume-templates" element={<ResumeTemplatesPage />} />
      <Route path="/ai-interview" element={<AIInterviewPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/blogs"
        element={
          <ProtectedRoute>
            <BlogAdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs/new"
        element={
          <ProtectedRoute>
            <BlogEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs/edit/:id"
        element={
          <ProtectedRoute>
            <BlogEditorPage />
          </ProtectedRoute>
        }
      />
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
