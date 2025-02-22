import { Routes as RouterRoutes, Route } from "react-router-dom";
import { NewsCardPage } from "./pages/NewsCardPage";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SavedNews from "./pages/SavedNews";
import Search from "./pages/Search";
import Categories from "./pages/Categories";
import ArticleForm from "./pages/admin/ArticleForm";
import Articles from "./pages/admin/Articles";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Tags from "./pages/admin/Tags";
import Sources from "./pages/admin/Sources";
import Settings from "./pages/admin/Settings";
import AdminRoute from "./components/AdminRoute";
import AdminCategories from "./pages/admin/Categories";
import Notifications from "./pages/admin/Notifications";

export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/saved" element={<SavedNews />} />
      <Route path="/search" element={<Search />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/:id" element={<NewsCardPage />} />
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/new" element={<ArticleForm />} />
        <Route path="articles/:id/edit" element={<ArticleForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="users" element={<Users />} />
        <Route path="tags" element={<Tags />} />
        <Route path="sources" element={<Sources />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </RouterRoutes>
  );
}
