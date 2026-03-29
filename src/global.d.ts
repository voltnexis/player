import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'voltnexis-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        auto?: string;
        title?: string;
        theme?: string;
        'primary-color'?: string;
        'progress-color'?: string;
        subtitle?: string;
        'subtitle-en'?: string;
        'subtitle-es'?: string;
        'subtitle-fr'?: string;
        'subtitle-hi'?: string;
        hide?: string;
        qualities?: string;
      };
    }
  }
}

export {};
