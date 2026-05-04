// React Theme — extracted from https://pk.indeed.com/
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '14': string;
    '16': string;
    '24': string;
    '13.3333': string;
 *   };
 *   space: {
    '1': string;
    '400': string;
 *   };
 *   radii: {
    md: string;
 *   };
 *   shadows: {

 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "primary": "#2557a7",
    "foreground": "#000000",
    "neutral50": "#2d2d2d",
    "neutral100": "#000000",
    "neutral200": "#dcdcdc",
    "neutral300": "#ffffff"
  },
  "fonts": {
    "body": "'Arial', sans-serif"
  },
  "fontSizes": {
    "14": "14px",
    "16": "16px",
    "24": "24px",
    "13.3333": "13.3333px"
  },
  "space": {
    "1": "1px",
    "400": "400px"
  },
  "radii": {
    "md": "8px"
  },
  "shadows": {},
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "primary": {
      "main": "#2557a7",
      "light": "hsl(217, 64%, 55%)",
      "dark": "hsl(217, 64%, 25%)"
    },
    "background": {},
    "text": {
      "primary": "#000000",
      "secondary": "#2d2d2d"
    }
  },
  "typography": {
    "fontFamily": "'Times New Roman', sans-serif",
    "h2": {
      "fontSize": "24px",
      "fontWeight": "700",
      "lineHeight": "30px"
    },
    "body1": {
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "normal"
    },
    "body2": {
      "fontSize": "13.3333px",
      "fontWeight": "400",
      "lineHeight": "normal"
    }
  },
  "shape": {
    "borderRadius": 8
  },
  "shadows": []
};

export default theme;
