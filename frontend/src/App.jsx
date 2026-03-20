import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import Login from './pages/Login'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import PostList from './pages/PostList'
import PostEdit from './pages/PostEdit'
import Category from './pages/Category'
import Tag from './pages/Tag'
import Comment from './pages/Comment'
import Media from './pages/Media'

function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="posts" element={<PostList />} />
        <Route path="posts/new" element={<PostEdit />} />
        <Route path="posts/edit/:id" element={<PostEdit />} />
        <Route path="categories" element={<Category />} />
        <Route path="tags" element={<Tag />} />
        <Route path="comments" element={<Comment />} />
        <Route path="media" element={<Media />} />
      </Route>
    </Routes>
  )
}

export default App
