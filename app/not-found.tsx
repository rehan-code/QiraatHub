import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100 text-gray-800">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-6xl font-bold text-theme_primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="px-6 py-4 font-medium bg-theme_primary text-white rounded-lg hover:bg-theme_primary/90 transition-all duration-300">
          <Link href="/">
            Go Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
