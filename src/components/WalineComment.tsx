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
      serverURL: process.env.NEXT_PUBLIC_WALINE_SERVER_URL!,
      path: path,
      dark: 'html[data-theme="dark"]',
    });
  }, [path]);

  return <div id="waline" />;
};

export default WalineComment;
