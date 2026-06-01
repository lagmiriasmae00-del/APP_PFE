import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';


import { BookOpen, AlertTriangle, Video, FileText, ArrowLeft, Loader2, Play } from 'lucide-react';







const VideoPlayer = ({ video }) => {
  const getYouTubeId = (url) => {
    const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const ytId = getYouTubeId(video.video_url);

  if (ytId) {
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          title={video.titre || 'Vidéo'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black">
      <video controls className="w-full h-full" src={video.video_url}>
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
  );
};







const LessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/lessons/${id}`);
        setLesson(res.data);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger la leçon. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    loadLesson();
  }, [id]);

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-xs">Chargement de la leçon...</p>
        </div>
      </div>
    );
  }

  

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl mb-4">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Leçon introuvable</h2>
        <p className="text-gray-500 text-xs mb-6">{error || 'Cette leçon n\'existe pas.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
        >
          ← Retour
        </button>
      </div>
    );
  }

  const videos = lesson.videos || [];
  const currentVideo = videos[activeVideoIndex];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 flex-wrap">
          <Link to="/modules" className="hover:text-blue-600 transition">Modules</Link>
          <span>/</span>
          {lesson.module && (
            <>
              <Link to={`/module/${lesson.module.id}`} className="hover:text-blue-600 transition truncate max-w-[150px]">
                {lesson.module.titre}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-800 truncate max-w-[200px]">{lesson.titre}</span>
        </nav>

        {}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-100/50">
            <BookOpen className="w-3 h-3" />
            <span>Leçon</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {lesson.titre}
          </h1>
          {lesson.description && (
            <p className="text-gray-400 text-xs max-w-2xl leading-relaxed">{lesson.description}</p>
          )}
        </div>

        {}
        {videos.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {}
            <div className="p-4 bg-gray-950">
              <VideoPlayer video={currentVideo} />
            </div>

            {}
            <div className="px-6 py-4 border-b border-gray-50">
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">
                Vidéo {activeVideoIndex + 1} sur {videos.length}
              </p>
              <h2 className="text-base font-bold text-gray-900">{currentVideo.titre || `Vidéo ${activeVideoIndex + 1}`}</h2>
            </div>

            {}
            {videos.length > 1 && (
              <div className="p-6 bg-gray-50/30">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Playlist</p>
                <div className="space-y-2">
                  {videos.map((video, index) => (
                    <button
                      key={video.id}
                      onClick={() => setActiveVideoIndex(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all border text-xs font-semibold ${
                        index === activeVideoIndex
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        index === activeVideoIndex ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {index === activeVideoIndex ? <Play className="w-2.5 h-2.5 fill-current" /> : index + 1}
                      </span>
                      <span className="truncate">{video.titre || `Vidéo ${index + 1}`}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="p-3 bg-gray-50 text-gray-400 rounded-xl inline-block mb-3">
              <Video className="w-6 h-6" />
            </div>
            <p className="text-gray-400 font-medium text-xs">Aucune vidéo disponible pour cette leçon.</p>
          </div>
        )}

        {}
        {lesson.contenu && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Contenu de la leçon</span>
            </h3>
            <div
              className="prose prose-sm prose-blue max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: lesson.contenu }}
            />
          </div>
        )}

        {}
        <div className="pt-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au module</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LessonPage;