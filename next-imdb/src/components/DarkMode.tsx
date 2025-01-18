'use client';

import React, { useEffect, useState } from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useTheme } from 'next-themes';

type Props = {}

const DarkModeSwitch: React.FC<Props> = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div>
      {mounted && (
        currentTheme === 'dark' ? (
          <MdLightMode
            onClick={() => setTheme('light')}
            className='text-xl cursor-pointer hover:text-amber-500'
          />
        ) : (
          <MdDarkMode
            onClick={() => setTheme('dark')}
            className='text-xl cursor-pointer hover:text-amber-500'
          />
        )
      )}
    </div>
  );
}

export default DarkModeSwitch;

