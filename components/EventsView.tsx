import React, { useState } from 'react';
import { Event, User, Team, Expense } from '../types';
import { Calendar, MapPin, Users, Plus, Clock, ChevronRight, DollarSign, PieChart, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface EventsViewProps {
  events: Event[];
  currentUser: User;
  teams: Team[];
  onAddEvent: (event: Event) => void;
  onRSVP: (eventId: string) => void;
  onUpdateEvent: (event: Event) => void;
}

const EventsView: React.FC<EventsViewProps> = ({ events, currentUser, teams, onAddEvent, onRSVP, onUpdateEvent }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTeamId, setNewTeamId] = useState<string>('');
  const [newBudget, setNewBudget] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    const event: Event = {
      id: `event-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      date: newDate,
      location: newLocation,
      teamId: newTeamId || undefined,
      attendees: [currentUser.id],
      budget: newBudget ? parseFloat(newBudget) : 0,
      expenses: []
    };

    onAddEvent(event);
    setIsAdding(false);
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewDesc('');
    setNewTeamId('');
    setNewBudget('');
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(e => new Date(e.date) < new Date()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (selectedEvent) {
      return (
          <EventDetailView 
            event={selectedEvent} 
            currentUser={currentUser} 
            onBack={() => setSelectedEventId(null)} 
            onUpdate={onUpdateEvent}
          />
      );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Club Events</h1>
          <p className="text-gray-400">Manage activities and budgets</p>
        </div>
        {['Secretary', 'Coordinator', 'Joint Coordinator'].includes(currentUser.role) && (
            <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
                <Plus className="h-5 w-5" />
                <span>Create Event</span>
            </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-white mb-4">New Event Details</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Event Title</label>
              <input 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary-500 outline-none"
                placeholder="e.g. Annual Tech Symposium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Date & Time</label>
              <input 
                type="datetime-local"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary-500 outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Location</label>
              <input 
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary-500 outline-none"
                placeholder="e.g. Main Auditorium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Budget (₹)</label>
              <input 
                type="number"
                value={newBudget}
                onChange={e => setNewBudget(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary-500 outline-none"
                placeholder="e.g. 5000"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Organizing Team (Optional)</label>
              <select 
                value={newTeamId}
                onChange={e => setNewTeamId(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary-500 outline-none"
              >
                <option value="">Whole Club</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase">Description</label>
              <textarea 
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary-500 outline-none h-24 resize-none"
                placeholder="What is this event about?"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 hover:text-white font-semibold">Cancel</button>
              <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Create Event</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-500" />
            Upcoming Events
        </h2>
        {upcomingEvents.length === 0 ? (
            <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming events scheduled.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} currentUser={currentUser} onRSVP={onRSVP} onSelect={() => setSelectedEventId(event.id)} />
                ))}
            </div>
        )}
      </div>

      {pastEvents.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-gray-800">
            <h2 className="text-xl font-bold text-gray-400">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.map(event => (
                    <div 
                        key={event.id} 
                        onClick={() => setSelectedEventId(event.id)}
                        className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                    >
                        <h3 className="font-bold text-gray-200 truncate">{event.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">{new Date(event.date).toLocaleDateString()}</p>
                        <div className="flex items-center text-[10px] text-gray-500">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{event.attendees.length} attended</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

const EventCard: React.FC<{ event: Event; currentUser: User; onRSVP: (id: string) => void; onSelect: () => void }> = ({ event, currentUser, onRSVP, onSelect }) => {
    const isAttending = event.attendees.includes(currentUser.id);
    const date = new Date(event.date);
    const totalExpenses = event.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all group cursor-pointer" onClick={onSelect}>
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="bg-primary-600/20 text-primary-400 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {event.teamId ? 'Team Event' : 'General Event'}
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-white leading-none">{date.getDate()}</p>
                        <p className="text-xs font-bold text-primary-500 uppercase">{date.toLocaleString('default', { month: 'short' })}</p>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{event.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mt-1">{event.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="flex items-center text-xs text-gray-300">
                        <Clock className="h-3 w-3 mr-2 text-gray-500" />
                        <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-300">
                        <MapPin className="h-3 w-3 mr-2 text-gray-500" />
                        <span className="truncate">{event.location || 'Online / TBD'}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-300">
                        <Users className="h-3 w-3 mr-2 text-gray-500" />
                        <span>{event.attendees.length} attending</span>
                    </div>
                    {event.budget ? (
                        <div className="flex items-center text-xs text-gray-300">
                            <DollarSign className="h-3 w-3 mr-2 text-gray-500" />
                            <span className={totalExpenses > event.budget ? 'text-red-400' : 'text-green-400'}>
                                ₹{totalExpenses} / ₹{event.budget}
                            </span>
                        </div>
                    ) : null}
                </div>

                <div className="pt-4 flex items-center justify-between">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRSVP(event.id); }}
                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                            isAttending 
                            ? 'bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30' 
                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/20'
                        }`}
                    >
                        {isAttending ? 'Going' : 'RSVP Now'}
                    </button>
                    <button className="ml-2 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const EventDetailView: React.FC<{ event: Event; currentUser: User; onBack: () => void; onUpdate: (e: Event) => void }> = ({ event, currentUser, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'finance'>('details');
    const [isAddingExpense, setIsAddingExpense] = useState(false);
    const [expTitle, setExpTitle] = useState('');
    const [expAmount, setExpAmount] = useState('');
    const [expCategory, setExpCategory] = useState('Refreshments');

    const totalExpenses = event.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    const budgetRemaining = (event.budget || 0) - totalExpenses;

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (!expTitle || !expAmount) return;

        const newExpense: Expense = {
            id: `exp-${Date.now()}`,
            title: expTitle,
            amount: parseFloat(expAmount),
            category: expCategory,
            date: new Date().toISOString(),
            userId: currentUser.id,
            status: 'pending'
        };

        const updatedEvent = {
            ...event,
            expenses: [...(event.expenses || []), newExpense]
        };

        onUpdate(updatedEvent);
        setIsAddingExpense(false);
        setExpTitle('');
        setExpAmount('');
    };

    const handleApproveExpense = (expId: string) => {
        const updatedEvent = {
            ...event,
            expenses: event.expenses?.map(exp => exp.id === expId ? { ...exp, status: 'approved' as const } : exp)
        };
        onUpdate(updatedEvent);
    };

    const handleRejectExpense = (expId: string) => {
        const updatedEvent = {
            ...event,
            expenses: event.expenses?.map(exp => exp.id === expId ? { ...exp, status: 'rejected' as const } : exp)
        };
        onUpdate(updatedEvent);
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
            <button onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 font-semibold">
                <ChevronRight className="h-5 w-5 rotate-180" />
                Back to Events
            </button>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
                <div className="p-8 bg-gradient-to-br from-primary-600/20 to-transparent border-b border-gray-700">
                    <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                        <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-primary-500" /> {new Date(event.date).toLocaleString()}</div>
                        <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-primary-500" /> {event.location || 'TBD'}</div>
                        <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-primary-500" /> {event.attendees.length} Attending</div>
                    </div>
                </div>

                <div className="flex border-b border-gray-700">
                    <button 
                        onClick={() => setActiveTab('details')}
                        className={`px-6 py-4 font-bold text-sm transition-colors ${activeTab === 'details' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        Details
                    </button>
                    <button 
                        onClick={() => setActiveTab('finance')}
                        className={`px-6 py-4 font-bold text-sm transition-colors ${activeTab === 'finance' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        Finance & Budget
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'details' ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</h3>
                                <p className="text-gray-300 leading-relaxed">{event.description || 'No description provided.'}</p>
                            </div>
                            <div className="pt-6 border-t border-gray-700">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Attendees</h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.attendees.map(id => (
                                        <div key={id} className="h-8 w-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-[10px] text-white font-bold" title={id}>
                                            {id.slice(-2).toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-xl">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Budget</p>
                                    <p className="text-2xl font-bold text-white">₹{event.budget || 0}</p>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-xl">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Spent</p>
                                    <p className={`text-2xl font-bold ${totalExpenses > (event.budget || 0) ? 'text-red-400' : 'text-white'}`}>₹{totalExpenses}</p>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-xl">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Remaining</p>
                                    <p className={`text-2xl font-bold ${budgetRemaining < 0 ? 'text-red-400' : 'text-green-400'}`}>₹{budgetRemaining}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expenses</h3>
                                    <button 
                                        onClick={() => setIsAddingExpense(true)}
                                        className="text-xs font-bold text-primary-500 hover:text-primary-400 flex items-center gap-1"
                                    >
                                        <Plus className="h-3 w-3" /> Add Expense
                                    </button>
                                </div>

                                {isAddingExpense && (
                                    <form onSubmit={handleAddExpense} className="bg-gray-900 border border-gray-700 p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <input 
                                            placeholder="Expense Title"
                                            value={expTitle}
                                            onChange={e => setExpTitle(e.target.value)}
                                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-primary-500"
                                            required
                                        />
                                        <input 
                                            type="number"
                                            placeholder="Amount (₹)"
                                            value={expAmount}
                                            onChange={e => setExpAmount(e.target.value)}
                                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-primary-500"
                                            required
                                        />
                                        <select 
                                            value={expCategory}
                                            onChange={e => setExpCategory(e.target.value)}
                                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-primary-500"
                                        >
                                            <option>Refreshments</option>
                                            <option>Marketing</option>
                                            <option>Logistics</option>
                                            <option>Prizes</option>
                                            <option>Other</option>
                                        </select>
                                        <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                                            <button type="button" onClick={() => setIsAddingExpense(false)} className="text-xs font-bold text-gray-400 px-3 py-1">Cancel</button>
                                            <button type="submit" className="bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-md">Save</button>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-2">
                                    {event.expenses?.length === 0 ? (
                                        <p className="text-center py-8 text-gray-500 text-sm">No expenses recorded yet.</p>
                                    ) : (
                                        event.expenses?.map(exp => (
                                            <div key={exp.id} className="bg-gray-900/30 border border-gray-800 p-4 rounded-xl flex justify-between items-center group">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-gray-800 p-2 rounded-lg">
                                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{exp.title}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase font-bold">{exp.category} • {new Date(exp.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <p className="font-bold text-white">₹{exp.amount}</p>
                                                    <div className="flex items-center gap-2">
                                                        {exp.status === 'pending' ? (
                                                            <>
                                                                {['Secretary', 'Coordinator'].includes(currentUser.role) ? (
                                                                    <div className="flex gap-1">
                                                                        <button onClick={() => handleApproveExpense(exp.id)} className="p-1 text-green-500 hover:bg-green-500/10 rounded" title="Approve"><CheckCircle className="h-4 w-4" /></button>
                                                                        <button onClick={() => handleRejectExpense(exp.id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded" title="Reject"><XCircle className="h-4 w-4" /></button>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[10px] font-bold text-yellow-500 uppercase flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Pending</span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className={`text-[10px] font-bold uppercase ${exp.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                                                                {exp.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventsView;
