// resources/js/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import Home from './pages/Home';
import BlogArchive from './pages/BlogArchive';
import BlogPost from './pages/BlogPost';
import PhotoGameIndex from './pages/PhotoGame/Index';
import PhotoGameRoom from './pages/PhotoGame/Room';
// import { createInertiaApp } from '@inertiajs/react'
// import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
// createInertiaApp({
//     title: (title) => (title ? `${title} - ${appName}` : appName),
//     resolve: name => resolvePageComponent(
//         `./Pages/${name}.jsx`,
//         import.meta.glob('./Pages/**/*.jsx')
//     ),
//     setup({ el, App, props }) {
//         const root = createRoot(el);

//         root.render(
//             <StrictMode>
//                 <App {...props} />
//             </StrictMode>,
//         );
//     },
//     progress: {
//         color: '#4B5563',
//     },
// });
export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<BlogArchive />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/photo-game" element={<PhotoGameIndex />} />
                <Route path="/photo-game/:code" element={<PhotoGameRoom />} />

            </Routes>
            <Footer />
        </BrowserRouter>
    );
}
