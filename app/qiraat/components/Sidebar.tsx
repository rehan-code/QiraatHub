import { Scholar } from '../types';

export const Sidebar = ({ scholar }: { scholar: Scholar }) => (
  <div className="w-full md:w-80 flex-shrink-0">
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Did You Know?</h2>
      <div className="space-y-4">
        {scholar.facts.map((fact, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
              {index + 1}
            </div>
            <p className="text-gray-600">{fact}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
