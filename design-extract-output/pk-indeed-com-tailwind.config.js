/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(217, 64%, 97%)',
            '100': 'hsl(217, 64%, 94%)',
            '200': 'hsl(217, 64%, 86%)',
            '300': 'hsl(217, 64%, 76%)',
            '400': 'hsl(217, 64%, 64%)',
            '500': 'hsl(217, 64%, 50%)',
            '600': 'hsl(217, 64%, 40%)',
            '700': 'hsl(217, 64%, 32%)',
            '800': 'hsl(217, 64%, 24%)',
            '900': 'hsl(217, 64%, 16%)',
            '950': 'hsl(217, 64%, 10%)',
            DEFAULT: '#2557a7'
        },
        'neutral-50': '#2d2d2d',
        'neutral-100': '#000000',
        'neutral-200': '#dcdcdc',
        'neutral-300': '#ffffff',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Noto Sans',
            'sans-serif'
        ],
        body: [
            'Times New Roman',
            'sans-serif'
        ],
        font2: [
            'Arial',
            'sans-serif'
        ]
    },
    fontSize: {
        '14': [
            '14px',
            {
                lineHeight: '21px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: 'normal'
            }
        ],
        '24': [
            '24px',
            {
                lineHeight: '30px'
            }
        ],
        '13.3333': [
            '13.3333px',
            {
                lineHeight: 'normal'
            }
        ]
    },
    spacing: {
        '0': '1px',
        '1': '400px'
    },
    borderRadius: {
        md: '8px'
    },
    transitionDuration: {
        '200': '0.2s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
    },
    container: {
        center: true,
        padding: '16px'
    },
    maxWidth: {
        container: '480px'
    }
},
  },
};
