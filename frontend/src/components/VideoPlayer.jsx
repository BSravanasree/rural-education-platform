import React from 'react';
import { useLowBandwidth } from '../context/LowBandwidthContext';
import { Play, WifiOff, Volume2 } from 'lucide-react';

const parseYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/|watch\?.+&v=))([\w-]{11})/i);
  return match ? match[1] : null;
};

const getYouTubeEmbedUrl = (url) => {
  const videoId = parseYouTubeId(url);
  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=0`;
  }
  return 'https://www.youtube-nocookie.com/embed/Veb22xD0Ao0?rel=0&autoplay=0';
};

const SAMPLE_MP4_FALLBACK = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const VideoPlayer = ({ videoUrl, title, durationSeconds }) => {
  const { isLowBandwidth } = useLowBandwidth();
  const [playDirectStream, setPlayDirectStream] = React.useState(false);

  const ytEmbed = getYouTubeEmbedUrl(videoUrl);
  const videoId = parseYouTubeId(videoUrl);
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : (videoUrl || 'https://www.youtube.com/watch?v=Veb22xD0Ao0');

  return (
    <div className="video-player-container">
      {isLowBandwidth && (
        <div className="low-bandwidth-banner">
          <WifiOff size={16} />
          <span>Low-Bandwidth Mode active: Video autoplay is disabled to conserve mobile data.</span>
        </div>
      )}

      <div className="video-wrapper">
        {!playDirectStream ? (
          <iframe
            className="video-element"
            style={{ width: '100%', height: '420px', borderRadius: 'var(--radius-lg)', border: 'none' }}
            src={ytEmbed}
            title={title || "Class 10 Subject Lecture"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <video 
            controls 
            autoPlay={false}
            className="video-element"
            style={{ width: '100%', height: '420px', borderRadius: 'var(--radius-lg)', background: '#000000' }}
          >
            <source src={SAMPLE_MP4_FALLBACK} type="video/mp4" />
            Your browser does not support HTML5 video streaming.
          </video>
        )}
      </div>

      <div className="video-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-color)' }}>{title || 'Subject Chapter Lecture'}</h4>
          {durationSeconds && (
            <span className="video-duration" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Chapter Length: {Math.floor(durationSeconds / 60)} mins
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-sm"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#ffffff', color: '#dc2626', borderColor: '#fca5a5' }}
          >
            ▶️ Watch on YouTube
          </a>
          <button 
            type="button" 
            onClick={() => setPlayDirectStream(!playDirectStream)}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
          >
            {playDirectStream ? '📺 Switch to YouTube Player' : '🎬 Play Direct HTML5 Video'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
