import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Plus, Edit2, Trash2, Train, MapPin, 
  Clock, Hash, X, Loader2, Search 
} from "lucide-react";
import NavBar from "../components/NavBar.jsx";

export default function TrainPage() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for delete animation
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    trainNumber: "",
    trainName: "",
    departureTime: "",
    departure: "",
    destination: ""
  });

  const API = "https://final-project-backend-psi.vercel.app/api/trains";

  const fetchTrains = async () => {
    try {
      const res = await axios.get(API);
      setTrains(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrains(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Open Form for Adding
  const handleAddClick = () => {
    setEditMode(false);
    setFormData({ trainNumber: "", trainName: "", departureTime: "", departure: "", destination: "" });
    setShowForm(true);
  };

  // Open Form for Editing
  const handleEditClick = (train) => {
    setEditMode(true);
    setFormData(train); 
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${API}/${formData._id}`, formData);
        showToast("✅ Train updated successfully");
      } else {
        await axios.post(API, formData);
        showToast("🚀 New train added to fleet");
      }
      setShowForm(false);
      fetchTrains();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;

    setDeletingId(id); // Trigger Animation

    setTimeout(async () => {
      try {
        await axios.delete(`${API}/${id}`);
        showToast("🗑️ Schedule removed");
        setTrains(prev => prev.filter(t => t._id !== id));
        setDeletingId(null);
      } catch (err) { 
        console.error(err);
        setDeletingId(null);
      }
    }, 500);
  };

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filteredTrains = trains.filter(t => 
    t.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.trainNumber.includes(searchTerm)
  );

  return (
    // MAIN LAYOUT CONTAINER
    <div className="flex h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* 1. SIDEBAR CONTAINER - Fixed Width (w-64) */}
      <div className="w-64 h-full shrink-0 border-r border-slate-800 bg-slate-900">
         <NavBar />
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Top Header */}
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-30 shrink-0">
          <div className="px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                <Train className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">Wellcome To <span className="text-indigo-400">RailPulse</span></h1>
            </div>
            <button 
              onClick={handleAddClick}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <Plus size={18} /> Add New Train
            </button>
          </div>
        </nav>

        {/* Scrollable Content - Scrollbar hidden using arbitrary tailwind values */}
        <main className="flex-1 overflow-y-auto p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          
          {/* Stats & Search Row */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or number..." 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-white placeholder-slate-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4 text-sm font-medium">
              <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg text-slate-300">
                Total Trains: <span className="text-indigo-400 font-bold ml-2">{trains.length}</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
                <p className="text-slate-400">Loading fleet data...</p>
              </div>
            ) : filteredTrains.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Train Details</th>
                      <th className="px-6 py-4 font-semibold text-center">Departure</th>
                      <th className="px-6 py-4 font-semibold text-center">Route</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredTrains.map((t) => (
                      <tr 
                        key={t._id} 
                        className={`group transition-all duration-500 ease-out border-l-4 border-transparent 
                        ${deletingId === t._id 
                            ? "bg-blue-600/20 opacity-0 transform translate-x-full border-l-blue-500" 
                            : "hover:bg-slate-800/30 hover:border-l-indigo-500"
                        }`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 min-w-[2.5rem] rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                              <Hash size={20} />
                            </div>
                            <div>
                              <div className="text-white font-bold">{t.trainName}</div>
                              <div className="text-xs text-slate-500 font-mono uppercase">{t.trainNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded">
                              <Clock size={14} /> {t.departureTime}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-3 text-sm">
                            <span className="text-slate-300">{t.departure}</span>
                            <div className="h-[1px] w-8 bg-slate-700"></div>
                            <span className="text-indigo-400 font-medium">{t.destination}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleEditClick(t)}
                              className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(t._id)}
                              className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500">
                <Train size={48} className="mx-auto mb-4 opacity-20" />
                <p>No trains found in the schedule.</p>
              </div>
            )}
          </div>
        </main>

        {/* Success Toast */}
        {successMsg && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-medium">
              {successMsg}
            </div>
          </div>
        )}
      </div>

      {/* Modern Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
              <h2 className="text-xl font-bold text-white">{editMode ? "Update Schedule" : "Add New Fleet"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Train Number</label>
                  <input 
                    name="trainNumber" 
                    required 
                    value={formData.trainNumber} 
                    onChange={handleChange} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-500" 
                    placeholder="e.g. 1012" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Departure Time</label>
                  <input 
                    name="departureTime" 
                    required 
                    value={formData.departureTime} 
                    onChange={handleChange} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-500" 
                    placeholder="e.g. 05:55 AM" 
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Train Name</label>
                <input 
                  name="trainName" 
                  required 
                  value={formData.trainName} 
                  onChange={handleChange} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-500" 
                  placeholder="e.g. Udarata Menike" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase ml-1">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                    <input 
                      name="departure" 
                      required 
                      value={formData.departure} 
                      onChange={handleChange} 
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-500" 
                      placeholder="Colombo Fort" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase ml-1">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                    <input 
                      name="destination" 
                      required 
                      value={formData.destination} 
                      onChange={handleChange} 
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-500" 
                      placeholder="Badulla" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors font-medium">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-500/20">
                  {editMode ? "Save Changes" : "Create Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}