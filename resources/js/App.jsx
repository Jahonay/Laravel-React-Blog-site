// resources/js/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import Home        from './pages/Home';
import BlogArchive from './pages/BlogArchive';
import BlogPost    from './pages/BlogPost';

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/"           element={<Home />}        />
                <Route path="/blog"        element={<BlogArchive />} />
                <Route path="/blog/:slug"  element={<BlogPost />}    />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}
