import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // التأكد من أن الصفحة تبدأ من الأعلى دائماً عند تغيير المسار
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // أيضاً تعيين scroll restoration يدوياً
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, [pathname]); // يعمل عند تغيير المسار

    return null;
}
