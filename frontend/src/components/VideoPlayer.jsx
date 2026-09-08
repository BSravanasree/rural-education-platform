import React from 'react';
import { useLowBandwidth } from '../context/LowBandwidthContext';
import { Play, WifiOff, Volume2 } from 'lucide-react';

const parseYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/|watch\?.+&v=))([\w-]{11})/i);
  return match ? match[1] : null;
};

const getYouTubeEmbedUrl = (url, title = '') => {
  const videoId = parseYouTubeId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Default fallback
  return 'https://www.youtube.com/embed/Veb22xD0Ao0';
};

const VideoPlayer = ({ videoUrl, title, durationSeconds }) => {
  const { isLowBandwidth } = useLowBandwidth();
  const [playDirectStream, setPlayDirectStream] = React.useState(false);

  const ytEmbed = getYouTubeEmbedUrl(videoUrl, title);
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
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video 
            controls 
            autoPlay={false}
            poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
            className="video-element"
            style={{ width: '100%', height: '420px', borderRadius: 'var(--radius-lg)' }}
          >
            <source src={DIRECT_VIDEO_STREAM} type="video/mp4" />
            Your browser does not support HTML5 video streaming.
          </video>
        )}
      </div>

      <div className="video-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-color)' }}>{title || 'Subject Chapter Lecture'}</h4>
          {durationSeconds && (
            <span className="video-duration" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Chapter Length: {Math.floor(durationSeconds / 60)} mins
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-sm"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
          >
            ↗️ Open in YouTube
          </a>
          <button 
            type="button" 
            onClick={() => setPlayDirectStream(!playDirectStream)}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
          >
            {playDirectStream ? '📺 Switch to YouTube Stream' : '▶️ Play Direct Video Stream'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
