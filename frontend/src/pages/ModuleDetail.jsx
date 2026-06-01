import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';


import { BookOpen, HelpCircle, FileText, ArrowRight, GraduationCap, ChevronRight, Loader2 } from 'lucide-react';







const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 bg-gray-100 rounded-xl" />
      <div className="w-16 h-6 bg-gray-100 rounded-md" />
    </div>
    <div className="space-y-2 pt-2">
      <div className="h-5 bg-gray-100 rounded-md w-1/3" />
      <div className="h-3 bg-gray-50 rounded-md w-1/2" />
    </div>
    <div className="h-px bg-gray-50 pt-4" />
    <div className="h-4 bg-gray-50 rounded-md w-3/4 mx-auto" />
  </div>
);







const LessonsCard = ({ lessons = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 p-6 flex flex-col justify-between min-h-[250px]">
      <div>
        {}
        <div className="flex items-center justify-between">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="bg-blue-50/50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-md">
            {lessons.length} leçon{lessons.length !== 1 ? 's' : ''}
          </span>
        </div>

        {}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-950 tracking-tight">Cours</h3>
          <p className="text-gray-400 text-xs mt-1">Leçons disponibles</p>
        </div>

        {}
        {lessons.length > 0 && (
          <ul className="mt-4 space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {lessons.map((lesson, index) => (
              <li
                key={lesson.id}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-blue-50/50 border border-transparent hover:border-blue-100/50 cursor-pointer transition group"
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-xs font-bold text-blue-500 bg-blue-50 w-6 h-6 rounded-md flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-700 truncate group-hover:text-blue-700">
                    {lesson.titre}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
              </li>
            ))}
          </ul>
        )}
      </div>

      {}
      {lessons.length === 0 ? (
        <div className="mt-6 pt-4 border-t border-gray-50 text-center text-gray-400 text-xs font-medium">
          Aucune leçon disponible pour le moment.
        </div>
      ) : (
        <div className="mt-4 text-[10px] text-gray-400 font-medium text-right">
          Cliquez sur une leçon pour l'ouvrir
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// ✍️ Carte 2 : Quiz Général du Module
// ─────────────────────────────────────────────
const QuizCard = ({ quizzes = [] }) => {
  const navigate = useNavigate();
  const mainQuiz = quizzes[0] || null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 p-6 flex flex-col justify-between min-h-[250px]">
      <div>
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <HelpCircle className="w-6 h-6" />
          </div>
          <span className="bg-purple-50/50 text-purple-600 text-xs font-bold px-2.5 py-1 rounded-md">
            {quizzes.length} quiz
          </span>
        </div>

        {/* Contenu */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-950 tracking-tight">Évaluation</h3>
          <p className="text-gray-400 text-xs mt-1">Schéma d'évaluation du module</p>
        </div>

        {}
        {mainQuiz && (
          <div className="mt-4 p-3 rounded-xl bg-purple-50/30 border border-purple-100/50 text-center">
            <p className="text-xs font-bold text-purple-950 truncate">{mainQuiz.titre}</p>
            <p className="text-[11px] text-purple-500 font-medium mt-0.5">
              {mainQuiz.questions?.length || 0} Questions disponibles
            </p>
            <button
              onClick={() => navigate(`/quiz/${mainQuiz.id}`)}
              className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded-lg transition shadow-sm inline-flex items-center justify-center gap-1 group cursor-pointer"
            >
              Commencer 
              <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {}
      {!mainQuiz && (
        <div className="mt-6 pt-4 border-t border-gray-50 text-center text-gray-400 text-xs font-medium">
          Aucun quiz disponible pour le moment.
        </div>
      )}
    </div>
  );
};







const DocumentsCard = ({ documents = [] }) => {
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (fileId, fileName) => {
    setDownloading(fileId);
    try {
      const response = await api.get(`/files/${fileId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Erreur lors du téléchargement du fichier.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 p-6 flex flex-col justify-between min-h-[250px]">
      <div>
        {}
        <div className="flex items-center justify-between">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <span className="bg-emerald-50/50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-md">
            {documents.length} doc{documents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-950 tracking-tight">Supports & EFM</h3>
          <p className="text-gray-400 text-xs mt-1">Documents téléchargeables</p>
        </div>

        {}
        {documents.length > 0 && (
          <div className="mt-4 space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="p-2.5 rounded-xl bg-gray-50/50 border border-gray-100 flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <p className="text-xs font-bold text-gray-800 truncate">{doc.titre}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{doc.type || 'Support'}</p>
                </div>
                {doc.files?.[0] && (
                  <button
                    disabled={downloading === doc.files[0].id}
                    onClick={() => handleDownload(doc.files[0].id, doc.titre)}
                    className="shrink-0 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md transition disabled:cursor-not-allowed"
                  >
                    {downloading === doc.files[0].id ? <Loader2 className="w-3 h-3 animate-spin" /> : '⬇'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      {documents.length === 0 && (
        <div className="mt-6 pt-4 border-t border-gray-50 text-center text-gray-400 text-xs font-medium">
          Aucun document disponible pour le moment.
        </div>
      )}
    </div>
  );
};







const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModule = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/module/${id}`);
        setModule(res.data);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le module. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    loadModule();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-4xl mb-2">⚠️</p>
        <h2 className="text-lg font-bold text-gray-900">Une erreur est survenue</h2>
        <p className="text-gray-500 text-xs mt-1 mb-6">{error}</p>
        <button
          onClick={() => navigate('/modules')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
        >
          ← Retour aux modules
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-gray-400">
          <Link to="/modules" className="hover:text-emerald-600 transition">Mes Modules</Link>
          <span>/</span>
          <span className="text-gray-800 truncate max-w-[200px]">{module.titre}</span>
        </nav>

        {}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Module
                </span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {module.niveau === 1 ? '1ère Année' : '2ème Année'}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mt-1.5">
                {module.titre}
              </h1>
              <p className="text-gray-400 text-xs mt-1 max-w-xl line-clamp-2 leading-relaxed">
                {module.description || "Composants, Hooks, Redux Toolkit et Axios."}
              </p>
            </div>
          </div>

          {}
          <div className="flex gap-3 bg-gray-50/50 border border-gray-100 p-2 rounded-xl shrink-0 w-full md:w-auto justify-around">
            <div className="text-center px-4 py-1.5">
              <p className="text-lg font-black text-blue-600">{module.lessons?.length || 0}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Leçons</p>
            </div>
            <div className="w-px bg-gray-200/60 my-1" />
            <div className="text-center px-4 py-1.5">
              <p className="text-lg font-black text-purple-600">{module.quizzes?.length || 0}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quiz</p>
            </div>
            <div className="w-px bg-gray-200/60 my-1" />
            <div className="text-center px-4 py-1.5">
              <p className="text-lg font-black text-emerald-600">{module.documents?.length || 0}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Docs</p>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <LessonsCard lessons={module.lessons || []} />
          <QuizCard quizzes={module.quizzes || []} />
          <DocumentsCard documents={module.documents || []} />
        </div>

      </div>
    </div>
  );
};

export default ModuleDetail;