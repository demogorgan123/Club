import React, { useState, useEffect } from 'react';
import { Loader, X, Plus, ChevronLeft, Check, Smile } from 'lucide-react';
import { clubData, ClubType, getTeamsForClubType } from '../services/clubData';
import { AVAILABLE_APPS } from '../services/appData';
import { TEAM_ICONS } from '../services/iconData';

interface OnboardingScreenProps {
  onGenerateWorkspace: (clubName: string, teams: { name: string; icon: React.ElementType }[], teamApps: { [teamName: string]: string[] }) => void;
}

interface OnboardingTeam {
    name: string;
    icon: React.ElementType;
}

const ProgressBar: React.FC<{ step: number }> = ({ step }) => (
    <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-center text-xs text-gray-400">
            <div className={`font-semibold ${step >= 1 ? 'text-primary-400' : ''}`}>Name</div>
            <div className={`flex-1 h-px mx-4 ${step > 1 ? 'bg-primary-500' : 'bg-gray-700'}`}></div>
            <div className={`font-semibold ${step >= 2 ? 'text-primary-400' : ''}`}>Type</div>
            <div className={`flex-1 h-px mx-4 ${step > 2 ? 'bg-primary-500' : 'bg-gray-700'}`}></div>
            <div className={`font-semibold ${step >= 3 ? 'text-primary-400' : ''}`}>Teams</div>
            <div className={`flex-1 h-px mx-4 ${step > 3 ? 'bg-primary-500' : 'bg-gray-700'}`}></div>
            <div className={`font-semibold ${step >= 4 ? 'text-primary-400' : ''}`}>Tools</div>
        </div>
    </div>
);

const IconPickerModal: React.FC<{ onSelect: (icon: React.ElementType) => void; onClose: () => void }> = ({ onSelect, onClose }) => (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Select an Icon</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700"><X className="h-5 w-5 text-gray-400"/></button>
            </div>
            <div className="grid grid-cols-6 gap-4">
                {TEAM_ICONS.map(iconInfo => (
                    <button key={iconInfo.id} onClick={() => onSelect(iconInfo.icon)} className="flex items-center justify-center p-3 bg-gray-900 rounded-md hover:bg-primary-600 text-gray-400 hover:text-white transition-colors">
                        <iconInfo.icon className="h-6 w-6" />
                    </button>
                ))}
            </div>
        </div>
    </div>
);


const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onGenerateWorkspace }) => {
  const [step, setStep] = useState(1);
  const [clubName, setClubName] = useState('');
  const [selectedClub, setSelectedClub] = useState<ClubType | null>(null);
  const [teams, setTeams] = useState<OnboardingTeam[]>([]);
  const [teamApps, setTeamApps] = useState<{ [teamName: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [pickingIconFor, setPickingIconFor] = useState<number | null>(null);


  useEffect(() => {
    // When teams are set or changed, initialize their app selections
    const initialApps: { [teamName: string]: string[] } = {};
    teams.forEach(team => {
        // Default to the first 4 apps
        initialApps[team.name] = AVAILABLE_APPS.slice(0, 4).map(app => app.name);
    });
    setTeamApps(initialApps);
  }, [teams]);


  const handleSelectClub = (club: ClubType) => {
    setSelectedClub(club);
    setTeams(getTeamsForClubType(club.name).map((name, index) => ({
        name,
        icon: TEAM_ICONS[index % TEAM_ICONS.length].icon
    })));
    setStep(3);
  };
  
  const handleTeamNameChange = (index: number, newName: string) => {
    const oldName = teams[index].name;
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], name: newName };
    setTeams(newTeams);

    setTeamApps(prev => {
        const newApps = {...prev};
        if (oldName in newApps) {
            newApps[newName] = newApps[oldName];
            delete newApps[oldName];
        }
        return newApps;
    });
  };
  
  const handleRemoveTeam = (index: number) => {
    const teamToRemove = teams[index];
    setTeams(teams.filter((_, i) => i !== index));
    setTeamApps(prev => {
        const newApps = {...prev};
        delete newApps[teamToRemove.name];
        return newApps;
    });
  };
  
  const handleAddTeam = () => {
    setTeams([...teams, { name: 'New Team', icon: Smile }]);
  };

  const handleSelectIcon = (icon: React.ElementType) => {
    if (pickingIconFor !== null) {
        const newTeams = [...teams];
        newTeams[pickingIconFor] = { ...newTeams[pickingIconFor], icon };
        setTeams(newTeams);
        setPickingIconFor(null);
    }
  }

  const handleToggleApp = (teamName: string, appName: string) => {
    setTeamApps(prev => {
        const currentApps = prev[teamName] || [];
        const newApps = currentApps.includes(appName) 
            ? currentApps.filter(name => name !== appName)
            : [...currentApps, appName];
        return { ...prev, [teamName]: newApps };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const finalTeams = teams.filter(t => t.name.trim() !== '');
    
    setTimeout(() => {
        onGenerateWorkspace(clubName, finalTeams, teamApps);
    }, 1000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome! What's your club's name?</h1>
            <p className="text-lg text-gray-400 mb-10">This will be the name of your workspace.</p>
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
              <input
                id="clubName"
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="e.g., Campus Film Society"
                className="w-full bg-gray-800 rounded-lg py-3 px-4 border border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500 text-center text-lg"
                required
              />
              <button type="submit" disabled={!clubName.trim()} className="w-full max-w-xs mx-auto flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-md text-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                Next
              </button>
            </form>
          </div>
        );
      case 2:
        return (
           <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">What type of club is it?</h1>
            <p className="text-lg text-gray-400 mb-10">Select a category that best describes your club's activities.</p>
            <div className="space-y-8">
                {clubData.map((category) => (
                    <div key={category.name}>
                        <h2 className="text-xl font-semibold text-white mb-4 text-left">{category.name}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.clubs.map((club) => (
                                <button key={club.name} onClick={() => handleSelectClub(club)} className="group bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-primary-500 hover:bg-gray-700/50 text-left transition-all duration-200 flex flex-col h-full">
                                    <club.icon className="h-8 w-8 text-primary-400 mb-3"/>
                                    <h3 className="font-bold text-white text-lg">{club.name}</h3>
                                    <p className="text-gray-400 text-sm flex-1">{club.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
             <button onClick={() => setStep(1)} className="mt-8 flex items-center space-x-2 text-gray-300 hover:text-white font-semibold">
                <ChevronLeft className="h-5 w-5"/>
                <span>Back</span>
            </button>
          </div>
        );
      case 3:
        return (
          <div className="max-w-lg mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Customize your teams</h1>
            <p className="text-lg text-gray-400 mb-10">We've suggested some teams based on your club type. Edit them as you see fit.</p>
            <div className="space-y-4">
              {teams.map((team, index) => {
                const Icon = team.icon;
                return (
                    <div key={index} className="flex items-center space-x-3">
                      <button type="button" onClick={() => setPickingIconFor(index)} className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-primary-500 text-gray-300 hover:text-primary-400 transition-colors">
                          <Icon className="h-5 w-5" />
                      </button>
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) => handleTeamNameChange(index, e.target.value)}
                        className="flex-1 bg-gray-800 rounded-lg py-2 px-4 border border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500"
                      />
                      <button type="button" onClick={() => handleRemoveTeam(index)} className="p-2 text-gray-500 hover:text-red-400 rounded-full hover:bg-gray-700 transition-colors">
                        <X className="h-5 w-5"/>
                      </button>
                    </div>
                )
              })}
              <button type="button" onClick={handleAddTeam} className="w-full flex items-center justify-center space-x-2 text-primary-400 hover:text-primary-300 font-semibold py-2 px-4 rounded-md border-2 border-dashed border-gray-600 hover:border-primary-500 transition-colors">
                 <Plus className="h-5 w-5"/>
                 <span>Add Team</span>
              </button>
            </div>
            <div className="flex items-center justify-between pt-6 mt-4">
                <button type="button" onClick={() => setStep(2)} className="flex items-center space-x-2 text-gray-300 hover:text-white font-semibold">
                    <ChevronLeft className="h-5 w-5"/>
                    <span>Back</span>
                </button>
                <button type="button" onClick={() => setStep(4)} disabled={teams.length === 0} className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-md text-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
          </div>
        );
      case 4:
         return (
             <div className="max-w-4xl mx-auto">
                 <h1 className="text-4xl font-bold text-white mb-2">Configure Team Tools</h1>
                 <p className="text-lg text-gray-400 mb-10">Select the apps and tools each team will need.</p>
                 <form onSubmit={handleSubmit} className="space-y-8">
                     {teams.map(team => (
                         <div key={team.name}>
                             <h2 className="text-xl font-semibold text-white mb-4 text-left">{team.name}</h2>
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                 {AVAILABLE_APPS.map(app => {
                                     const isSelected = teamApps[team.name]?.includes(app.name);
                                     return (
                                         <button type="button" key={app.name} onClick={() => handleToggleApp(team.name, app.name)} className={`relative flex items-center space-x-3 text-left p-4 rounded-lg border transition-colors ${isSelected ? 'bg-primary-900/50 border-primary-500' : 'bg-gray-800 border-gray-700 hover:border-gray-500'}`}>
                                             <app.icon className={`h-6 w-6 ${app.color}`} />
                                             <span className="font-medium text-white">{app.name}</span>
                                             {isSelected && <Check className="absolute top-2 right-2 h-5 w-5 text-primary-400" />}
                                         </button>
                                     )
                                 })}
                             </div>
                         </div>
                     ))}
                     <div className="flex items-center justify-between pt-6">
                         <button type="button" onClick={() => setStep(3)} className="flex items-center space-x-2 text-gray-300 hover:text-white font-semibold">
                             <ChevronLeft className="h-5 w-5"/>
                             <span>Back</span>
                         </button>
                         <button type="submit" disabled={isLoading} className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-md text-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                           {isLoading ? <><Loader className="animate-spin h-6 w-6 mr-3" /> Creating...</> : 'Create Workspace'}
                         </button>
                     </div>
                 </form>
             </div>
         )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 py-12">
      {pickingIconFor !== null && <IconPickerModal onClose={() => setPickingIconFor(null)} onSelect={handleSelectIcon}/>}
      <div className="w-full max-w-5xl text-center">
        <ProgressBar step={step} />
        {renderStepContent()}
      </div>
    </div>
  );
};

export default OnboardingScreen;