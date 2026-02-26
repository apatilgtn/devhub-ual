import { useEffect, useMemo } from 'react';
import { makeStyles, Button, Typography, Box } from '@material-ui/core';
import { useApi, identityApiRef, configApiRef } from '@backstage/core-plugin-api';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://bbcnahjnozxlnnziyjsq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_Ojq5sEq-oKFEdSSYZK5Kew_613P3U_8';

function useSupabaseClient() {
    const configApi = useApi(configApiRef);
    return useMemo(() => {
        const url = configApi.getOptionalString('supabase.url') || DEFAULT_SUPABASE_URL;
        const key = configApi.getOptionalString('supabase.anonKey') || DEFAULT_SUPABASE_ANON_KEY;
        return createClient(url, key);
    }, [configApi]);
}

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
    },
    backgroundContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
        '& > div': {
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(120px)',
            opacity: 0.6,
        }
    },
    blob1: {
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
        top: '-10%',
        left: '-10%',
        animation: '$move 25s infinite alternate ease-in-out',
    },
    blob2: {
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        bottom: '10%',
        right: '-5%',
        animation: '$move 30s infinite alternate-reverse ease-in-out',
    },
    '@keyframes move': {
        '0%': { transform: 'translate(0, 0) scale(1)' },
        '100%': { transform: 'translate(50px, 30px) scale(1.05)' },
    },
    scanline: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
        backgroundSize: '100% 4px, 3px 100%',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.1,
    },
    card: {
        position: 'relative',
        zIndex: 2,
        background: 'rgba(10, 10, 10, 0.65)',
        backdropFilter: 'blur(32px) saturate(180%)',
        borderRadius: 32,
        padding: theme.spacing(7),
        width: '100%',
        maxWidth: 440,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.9)',
        textAlign: 'center',
        animation: '$fadeIn 0.8s ease-out',
    },
    '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
    },
    iconBox: {
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        marginBottom: theme.spacing(5),
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
    },
    logoutIcon: {
        fontSize: '3rem',
    },
    title: {
        color: '#fff',
        fontSize: '2.5rem',
        fontWeight: 900,
        marginBottom: theme.spacing(1.5),
        letterSpacing: '-0.04em',
        background: 'linear-gradient(to bottom, #fff, #888)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '1rem',
        marginBottom: theme.spacing(6),
        fontWeight: 500,
    },
    button: {
        background: '#fff',
        color: '#000',
        padding: theme.spacing(2.2),
        borderRadius: 18,
        fontSize: '1rem',
        fontWeight: 800,
        textTransform: 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
            background: '#fff',
            transform: 'translateY(-3px)',
            boxShadow: '0 20px 40px rgba(255, 255, 255, 0.1)',
        },
    },
}));

export const LogoutPage = () => {
    const classes = useStyles();
    const identityApi = useApi(identityApiRef);
    const supabase = useSupabaseClient();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Sign out from Supabase
                await supabase.auth.signOut();
                // Sign out from Backstage
                await identityApi.signOut();
            } catch (err) {
                console.error('Logout failed:', err);
            }
        };

        performLogout();
    }, [identityApi, supabase]);

    return (
        <div className={classes.root}>
            <div className={classes.backgroundContainer}>
                <div className={classes.blob1} />
                <div className={classes.blob2} />
            </div>
            <div className={classes.scanline} />

            <div className={classes.card}>
                <Box className={classes.iconBox}>
                    <span className={classes.logoutIcon}>🛸</span>
                </Box>
                <Typography className={classes.title}>Disconnected</Typography>
                <Typography className={classes.subtitle}>
                    Session terminated successfully. <br /> Your access to DeV-Hub has been revoked.
                </Typography>
                <Button
                    className={classes.button}
                    onClick={() => window.location.href = '/'}
                    fullWidth
                >
                    Reconnect to Platform
                </Button>
            </div>
        </div>
    );
};
