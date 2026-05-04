const ModuleCard = ({ module }) => {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/5 rounded uppercase tracking-wider">
          {module.level}
        </span>
        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
          {module.category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors min-h-[3.5rem]">
        {module.title}
      </h3>
      
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {module.duration}
        </div>
        
        <button className="text-primary font-bold text-xs flex items-center gap-1 group/btn">
          Voir plus
          <svg className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ModuleCard;
