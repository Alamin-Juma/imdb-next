"use-client";

import { ThemeProvider } from "next-themes";

type Props = {};

const ThemeComp = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system'>
      <div className="text-gray-700 dark:text-gray-200 dark:bg-gray-700 min-h-screen select-none transition-colors duration-300">
        {children}
      </div>{" "}
    </ThemeProvider>
  );
};

export default ThemeComp;
