'use client';

import React, { useEffect } from 'react';
import { init } from '@waline/client';
import '@waline/client/waline.css';

interface WalineCommentProps {
  path: string;
}

const WalineComment: React.FC<WalineCommentProps> = ({ path }) => {
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    init({
      el: '#waline',
      serverURL: process.env.NEXT_PUBLIC_WALINE_SERVER_URL!,
      path: path,
      dark: true, // Force dark mode for testing
    });
  }, [path]);

  return <div id="waline" />;
};

export default WalineComment;
