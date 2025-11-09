import React from 'react';
import { Channel, AppIntegration } from '../types';

interface AppsViewProps {
  channel: Channel;
  apps: AppIntegration[];
}

const AppsView: React.FC<AppsViewProps> = ({ channel, apps }) => {
  
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Apps & Tools</h1>
        <p className="text-gray-400 mt-1">
          Quick access to your team's essential applications and resources.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {apps.map((app) => (
          <a
            key={app.name}
            href="#"
            onClick={(e) => e.preventDefault()}
            className="group flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-primary-500 rounded-lg p-6 text-center transition-all duration-200 aspect-square"
          >
            <app.icon className={`h-12 w-12 mb-4 transition-colors ${app.color} group-hover:text-white`} />
            <span className="font-semibold text-white">{app.name}</span>
          </a>
        ))}
         {apps.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
            No apps or tools have been configured for this team.
          </div>
        )}
      </div>
    </div>
  );
};

export default AppsView;