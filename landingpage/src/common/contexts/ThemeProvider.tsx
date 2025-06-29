import React, { createContext, useContext, useMemo } from "react";
import * as Themes from "@/theme/Theme.Colors";
import ThemeConfig from "../../theme/Theme.Config";

/**
 * ThemeProvider
 * Provides the theme to the application from the Theme config under /src/theme/Theme.Config.ts
 * Theme colors are defined under /src/theme/Theme.Colors.ts
 */

type Props = {
  children: React.ReactNode;
};

interface ThemeInterface {
  main: string;
  gradient: {
    from: string;
    to: string;
  };
}

const ThemeContext = createContext({} as ThemeInterface);

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: Props) {
  const ThemeFile = useMemo(
    () => Themes[ThemeConfig.theme as keyof typeof Themes],
    []
  );

  const Theme: ThemeInterface = useMemo(() => {
    return {
      main: ThemeFile.main,
      gradient: {
        from: ThemeFile.gradient.from,
        to: ThemeFile.gradient.to,
      },
    };
  }, [ThemeFile]);

  return (
    <ThemeContext.Provider value={Theme}>{children}</ThemeContext.Provider>
  );
}
