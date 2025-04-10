import { Resource } from '../types';

interface ResourcesSectionProps {
  resources: Resource[];
  className?: string;
}

export const ResourcesSection = ({ resources, className = '' }: ResourcesSectionProps) => {
  return (
    <section className={`bg-white rounded-2xl shadow-xl ${className}`}>
      <div className="p-6 pb-2">
        <h2 className="text-2xl font-bold text-gray-900">Resources</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative p-4 bg-white rounded-lg border border-gray-200 flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-500 transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-emerald-600 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors duration-300">
                    {resource.title}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};