import React from 'react';
import { createRoot } from 'react-dom/client';
import { PlayerContainer } from '../components/PlayerContainer';
import styles from '../index.css?inline';

class VoltNexisPlayerElement extends HTMLElement {
  private root: any;
  private mountPoint: HTMLDivElement | null = null;

  static get observedAttributes() {
    return [
      'src', 'auto', 'title', 'theme', 'primary-color', 'progress-color', 
      'preview', 'preview-vtt', 'subtitle', 'share-url', 'hide', 'width', 'height'
    ];
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      
      // Inject styles into shadow DOM
      const styleTag = document.createElement('style');
      styleTag.textContent = styles;
      this.shadowRoot!.appendChild(styleTag);

      // Create mount point inside shadow DOM
      this.mountPoint = document.createElement('div');
      this.mountPoint.className = 'voltnexis-player-wrapper';
      this.shadowRoot!.appendChild(this.mountPoint);
      
      this.root = createRoot(this.mountPoint);
    }
    this.render();
  }

  attributeChangedCallback() {
    if (this.root) {
      this.render();
    }
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  private render() {
    if (!this.root) return;

    const props: any = {
      src: this.getAttribute('src') || undefined,
      auto: this.getAttribute('auto') || undefined,
      title: this.getAttribute('title') || undefined,
      theme: (this.getAttribute('theme') as 'dark' | 'light') || 'dark',
      primaryColor: this.getAttribute('primary-color') || undefined,
      progressColor: this.getAttribute('progress-color') || undefined,
      previewVtt: this.getAttribute('preview-vtt') || this.getAttribute('preview') || undefined,
      subtitleVtt: this.getAttribute('subtitle') || undefined,
      shareUrl: this.getAttribute('share-url') || undefined,
      hide: this.getAttribute('hide')?.split(',').map(s => s.trim()) || [],
      width: this.getAttribute('width') || undefined,
      height: this.getAttribute('height') || undefined,
    };

    // Extract all quality-* attributes
    const qualities: Record<string, string> = {};
    for (let i = 0; i < this.attributes.length; i++) {
      const attr = this.attributes[i];
      if (attr.name.startsWith('quality-')) {
        const q = attr.name.replace('quality-', '');
        qualities[q] = attr.value;
      }
    }
    if (Object.keys(qualities).length > 0) {
      props.qualities = qualities;
    }
    
    // Extract all subtitle-* attributes
    const subtitles: { label: string, src: string, lang: string }[] = [];
    for (let i = 0; i < this.attributes.length; i++) {
        const attr = this.attributes[i];
        if (attr.name.startsWith('subtitle-')) {
            const lang = attr.name.replace('subtitle-', '');
            subtitles.push({
                label: lang.toUpperCase(),
                src: attr.value,
                lang: lang
            });
        }
    }
    if (subtitles.length > 0) {
        props.subtitles = subtitles;
    }

    const jsonSubtitles = this.getAttribute('subtitles');
    if (jsonSubtitles) {
        try {
            props.subtitles = JSON.parse(jsonSubtitles);
        } catch (e) {
            console.error('Failed to parse subtitles attribute', e);
        }
    }

    // Event callbacks
    const events = ['like', 'dislike', 'share', 'chat', 'comment', 'openmenu'];
    events.forEach(event => {
      const propName = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
      props[propName] = () => {
        this.dispatchEvent(new CustomEvent(event, { 
          bubbles: true, 
          composed: true,
          detail: { originalEvent: event }
        }));
      };
    });

    this.root.render(
      <React.StrictMode>
        <PlayerContainer {...props} />
      </React.StrictMode>
    );
  }
}

// Ensure it's only defined once since React fast refresh may trigger re-evaluation
if (!customElements.get('voltnexis-player')) {
  customElements.define('voltnexis-player', VoltNexisPlayerElement);
}
