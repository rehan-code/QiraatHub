import { Resource } from '../types';

export const ResourceCard = ({ resource }: { resource: Resource }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
      <p className="text-gray-600 mb-4">{resource.description}</p>
      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-blue-600 hover:text-blue-700"
      >
        Learn More
        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  </div>
);
