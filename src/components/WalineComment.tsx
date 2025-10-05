'use client';

import React, { useEffect } from 'react';
import { init } from '@waline/client';
import '@waline/client/waline.css';

interface WalineCommentProps {
  path: string;
}

const WalineComment: React.FC<WalineCommentProps> = ({ path }) => {
  useEffect(() => {
    init({
      el: '#waline',
      serverURL: 'https://waline-comment-backend.vercel.app/',
      path: path,
      dark: 'html[data-theme="dark"]',
    });
  }, [path]);

  return <div id="waline" />;
};

export default WalineComment;
