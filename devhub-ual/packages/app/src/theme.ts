import {
    createUnifiedTheme,
    palettes,
} from '@backstage/theme';

// ─── Enterprise Light Theme ─────────────────────────────────────────────────
const enterpriseTheme = {
    fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    palette: {
        ...palettes.light,
        primary: {
            main: '#2563EB',
            light: '#3B82F6',
            dark: '#1D4ED8',
        },
        secondary: {
            main: '#6B7280',
            light: '#9CA3AF',
            dark: '#4B5563',
        },
        text: {
            primary: '#1E293B',
            secondary: '#64748B',
        },
        navigation: {
            background: '#1E293B',
            indicator: '#3B82F6',
            color: '#CBD5E1',
            selectedColor: '#F8FAFC',
            navItem: {
                hoverBackground: 'rgba(59, 130, 246, 0.15)',
            },
        },
        background: {
            default: '#F1F5F9',
            paper: '#FBFCFD',
        },
        action: {
            hover: 'rgba(37, 99, 235, 0.06)',
            selected: 'rgba(37, 99, 235, 0.10)',
        },
    },
    defaultPageTheme: 'app',
    pageTheme: {
        app: {
            colors: ['#1E293B', '#334155'],
            shape: 'none',
            backgroundImage: 'none',
            fontColor: '#F8FAFC',
        },
        home: {
            colors: ['#1E293B', '#334155'],
            shape: 'none',
            backgroundImage: 'none',
            fontColor: '#F8FAFC',
        },
        tool: {
            colors: ['#1E293B', '#334155'],
            shape: 'none',
            backgroundImage: 'none',
            fontColor: '#F8FAFC',
        },
    },
    components: {
        BackstageHeader: {
            styleOverrides: {
                header: {
                    backgroundImage: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                    borderBottom: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    paddingBottom: '20px',
                },
                title: {
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    fontSize: '1.75rem',
                    color: '#F8FAFC',
                },
                subtitle: {
                    color: '#CBD5E1',
                    fontSize: '0.875rem',
                    fontWeight: 400,
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                h1: { fontWeight: 600, letterSpacing: '-0.02em', fontSize: '1.875rem', color: '#1E293B' },
                h2: { fontWeight: 600, letterSpacing: '-0.015em', fontSize: '1.5rem', color: '#1E293B' },
                h3: { fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.25rem', color: '#334155' },
                h4: { fontWeight: 600, fontSize: '1.125rem', color: '#334155' },
                h5: { fontWeight: 600, fontSize: '1rem', color: '#475569' },
                h6: { fontWeight: 600, fontSize: '0.875rem', color: '#475569' },
                body1: { fontSize: '0.875rem', lineHeight: 1.65, color: '#334155' },
                body2: { fontSize: '0.8125rem', lineHeight: 1.6, color: '#64748B' },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FBFCFD !important',
                    borderRadius: '8px !important',
                    border: '1px solid #E2E8F0 !important',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    textTransform: 'none' as const,
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    padding: '7px 18px',
                    transition: 'all 0.15s ease',
                },
                containedPrimary: {
                    backgroundColor: '#2563EB',
                    color: '#F8FAFC',
                    boxShadow: '0 1px 2px rgba(37, 99, 235, 0.3)',
                    '&:hover': {
                        backgroundColor: '#1D4ED8',
                    },
                },
                outlined: {
                    borderColor: '#CBD5E1',
                    color: '#334155',
                    '&:hover': {
                        borderColor: '#2563EB',
                        backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #E2E8F0',
                    padding: '12px 16px',
                    fontSize: '0.8125rem',
                    color: '#334155',
                },
                head: {
                    color: '#64748B',
                    textTransform: 'uppercase',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    backgroundColor: '#F8FAFC',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'background-color 0.15s ease',
                    '&:hover': {
                        backgroundColor: '#F1F5F9 !important',
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#2563EB',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                        color: '#1D4ED8',
                        textDecoration: 'underline',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    borderRadius: 4,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    border: '1px solid #BFDBFE',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1E293B !important',
                    borderRight: '1px solid #334155 !important',
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#2563EB',
                    height: 2,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    color: '#64748B',
                    '&.Mui-selected': {
                        color: '#1E293B',
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: '0.875rem',
                    color: '#1E293B',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    backgroundColor: '#F8FAFC',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#CBD5E1',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2563EB',
                    },
                },
            },
        },
        BackstageSidebar: {
            styleOverrides: {
                drawer: {
                    backgroundColor: '#1E293B',
                },
            },
        },
        BackstageSidebarItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    },
                },
                label: {
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: '#CBD5E1',
                },
            },
        },
    },
};

export const devHubTheme = createUnifiedTheme({
    ...enterpriseTheme,
});

export const devHubLightTheme = createUnifiedTheme({
    ...enterpriseTheme,
});
