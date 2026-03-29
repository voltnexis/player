import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">VNPlayer Demo</h1>
          <p className="text-zinc-400">Open source, high-performance HTML5 video player</p>
        </header>

        <div className="rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-black aspect-video">
          {/* @ts-ignore */}
          <voltnexis-player 
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            title="Demo Video - Big Buck Bunny"
            primary-color="#00ffd5"
            subtitle-en="https://raw.githubusercontent.com/vjs/video.js/main/docs/examples/elephantsdream/captions.en.vtt"
          ></voltnexis-player>
        </div>

        <footer className="text-center text-sm text-zinc-500">
          <p>Host on GitHub • Deliver via JSDelivr</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
