import React, { useState, useMemo } from 'react';
import { makeStyles, Button, Typography, CircularProgress, TextField, Link } from '@material-ui/core';
import { SignInPageProps, useApi, discoveryApiRef, configApiRef, IdentityApi } from '@backstage/core-plugin-api';
import { createClient } from '@supabase/supabase-js';

// Fallback Supabase config (used when app-config supabase.url / supabase.anonKey not set)
const DEFAULT_SUPABASE_URL = 'https://bbcnahjnozxlnnziyjsq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_Ojq5sEq-oKFEdSSYZK5Kew_613P3U_8';

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
    // Enhanced Dynamic Background
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
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
        top: '-10%',
        left: '-10%',
        animation: '$move 25s infinite alternate ease-in-out',
    },
    blob2: {
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
        bottom: '-10%',
        right: '-10%',
        animation: '$move 30s infinite alternate-reverse ease-in-out',
    },
    blob3: {
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        top: '30%',
        right: '20%',
        animation: '$move 20s infinite alternate ease-in-out',
    },
    '@keyframes move': {
        '0%': { transform: 'translate(0, 0) scale(1)' },
        '100%': { transform: 'translate(150px, 100px) scale(1.15)' },
    },
    // Scanline effect for extra "tech" feel
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
    loginCard: {
        position: 'relative',
        zIndex: 2,
        background: 'rgba(10, 10, 10, 0.65)',
        backdropFilter: 'blur(32px) saturate(180%)',
        borderRadius: 32,
        padding: theme.spacing(7),
        width: '100%',
        maxWidth: 460,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        animation: '$fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    '@keyframes fadeInScale': {
        '0%': { opacity: 0, transform: 'scale(0.95) translateY(20px)' },
        '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: theme.spacing(6),
    },
    logo: {
        fontSize: '3.2rem',
        fontWeight: 900,
        letterSpacing: '-0.06em',
        background: 'linear-gradient(135deg, #fff 0%, #737373 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: theme.spacing(0.5),
        filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.1))',
    },
    tagline: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.9rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontWeight: 600,
        opacity: 0.8,
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
    },
    textField: {
        animation: '$slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        '& .MuiOutlinedInput-root': {
            color: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 18,
            transition: 'all 0.3s ease',
            '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#fff',
                borderWidth: '1px',
            },
        },
        '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.4)',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#fff',
        },
    },
    '@keyframes slideUp': {
        '0%': { opacity: 0, transform: 'translateY(10px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    submitButton: {
        background: '#fff',
        color: '#000',
        padding: theme.spacing(2.2),
        borderRadius: 18,
        fontSize: '1rem',
        fontWeight: 800,
        textTransform: 'none',
        marginTop: theme.spacing(2),
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
            background: '#fff',
            transform: 'translateY(-3px)',
            boxShadow: '0 20px 40px rgba(255, 255, 255, 0.1)',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            transform: 'rotate(45deg)',
            transition: 'all 0.6s ease',
            pointerEvents: 'none',
        },
        '&:hover::after': {
            left: '100%',
        },
        '&:active': {
            transform: 'translateY(-1px)',
        },
        '&:disabled': {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.2)',
        }
    },
    toggleLink: {
        color: 'rgba(255, 255, 255, 0.5)',
        cursor: 'pointer',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        '& span': {
            color: '#fff',
            fontWeight: 700,
            marginLeft: theme.spacing(0.7),
            borderBottom: '1px solid transparent',
            transition: 'all 0.3s ease',
        },
        '&:hover': {
            textDecoration: 'none',
            color: '#fff',
        },
        '&:hover span': {
            borderBottom: '1px solid #fff',
        }
    },
    error: {
        color: '#ff4444',
        marginTop: theme.spacing(4),
        textAlign: 'center',
        fontSize: '0.8rem',
        background: 'rgba(255, 68, 68, 0.08)',
        padding: theme.spacing(2),
        borderRadius: 16,
        border: '1px solid rgba(255, 68, 68, 0.2)',
        animation: '$shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
    },
    '@keyframes shake': {
        '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
        '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
        '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
        '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
    },
    success: {
        color: '#00c853',
        marginTop: theme.spacing(4),
        textAlign: 'center',
        fontSize: '0.8rem',
        background: 'rgba(0, 200, 83, 0.08)',
        padding: theme.spacing(2),
        borderRadius: 16,
        border: '1px solid rgba(0, 200, 83, 0.2)',
    },
    loading: {
        color: '#000',
        marginRight: theme.spacing(1.5),
    },
    footerText: {
        marginTop: theme.spacing(6),
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.15)',
        fontSize: '0.7rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        fontWeight: 700,
    }
}));

const normalizeIdentity = (identity: any): IdentityApi => {
    if (identity && typeof identity.getBackstageIdentity === 'function') {
        return identity as IdentityApi;
    }
    const backstage = identity.backstageIdentity || identity;
    const profile = identity.profile || backstage.profile || { email: 'guest@example.com' };
    const userEntityRef = backstage.identity?.userEntityRef || backstage.userEntityRef || 'user:default/guest';

    return {
        getBackstageIdentity: async () => ({
            id: backstage.identity?.id ?? userEntityRef,
            userEntityRef,
            ownershipEntityRefs: backstage.identity?.ownershipEntityRefs ?? [userEntityRef],
        }),
        getProfileInfo: async () => profile,
        getCredentials: async () => ({ token: identity.token ?? backstage.token ?? '' }),
        signOut: async () => {},
    };
};

export const CustomSignInPage = (props: SignInPageProps) => {
    const classes = useStyles();
    const discoveryApi = useApi(discoveryApiRef);
    const configApi = useApi(configApiRef);
    const supabase = useMemo(() => {
        const url = configApi.getOptionalString('supabase.url') || DEFAULT_SUPABASE_URL;
        const key = configApi.getOptionalString('supabase.anonKey') || DEFAULT_SUPABASE_ANON_KEY;
        return createClient(url, key);
    }, [configApi]);

    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    React.useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setLoading(true);
                try {
                    await completeLogin(session.user);
                } catch (err: any) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSupabaseAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (isSignUp) {
                const { data, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: name } }
                });

                if (authError) throw authError;

                if (data.user && !data.session) {
                    setSuccessMsg('Check your email for verification link.');
                    setLoading(false);
                    return;
                }

                if (data.session) {
                    await completeLogin(data.user);
                }
            } else {
                const { data, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (authError) throw authError;

                if (data.user) {
                    await completeLogin(data.user);
                }
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
            setLoading(false);
        }
    };

    const completeLogin = async (user: any) => {
        const authUrl = await discoveryApi.getBaseUrl('auth');
        const response = await fetch(`${authUrl}/guest/refresh`, { credentials: 'include' });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Auth bridge failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
        }

        const identityResponse = await response.json();
        const profile = identityResponse.profile || {};
        profile.email = user.email ?? profile.email;
        profile.displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || profile.displayName;

        props.onSignInSuccess(normalizeIdentity({ ...identityResponse, profile }));
    };

    return (
        <div className={classes.root}>
            <div className={classes.backgroundContainer}>
                <div className={classes.blob1} />
                <div className={classes.blob2} />
                <div className={classes.blob3} />
            </div>
            <div className={classes.scanline} />

            <div className={classes.loginCard}>
                <div className={classes.logoSection}>
                    <div className={classes.logo}>DeV-Hub</div>
                    <Typography className={classes.tagline}>
                        Control Center
                    </Typography>
                </div>

                <form className={classes.formContainer} onSubmit={handleSupabaseAuth}>
                    {isSignUp && (
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            label="Full Identity"
                            placeholder="John Doe"
                            type="text"
                            fullWidth
                            style={{ animationDelay: '0.1s' }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    <TextField
                        className={classes.textField}
                        variant="outlined"
                        label="Access Key (Email)"
                        placeholder="identity@devhub.com"
                        type="email"
                        fullWidth
                        style={{ animationDelay: '0.2s' }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        className={classes.textField}
                        variant="outlined"
                        label="Security Code (Password)"
                        placeholder="••••••••"
                        type="password"
                        fullWidth
                        style={{ animationDelay: '0.3s' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button
                        className={classes.submitButton}
                        type="submit"
                        fullWidth
                        disabled={loading}
                        style={{ animationDelay: '0.4s' }}
                    >
                        {loading ? (
                            <CircularProgress size={20} className={classes.loading} />
                        ) : (
                            isSignUp ? 'Initialize Account' : 'Authenticate'
                        )}
                    </Button>
                </form>

                <Link
                    className={classes.toggleLink}
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                        setSuccessMsg(null);
                    }}
                >
                    {isSignUp ? "Already recognized?" : "New to the platform?"}
                    <span>{isSignUp ? "Sign In" : "Sign Up"}</span>
                </Link>

                {error && <div className={classes.error}>{error}</div>}
                {successMsg && <div className={classes.success}>{successMsg}</div>}

                <div className={classes.footerText}>
                    Authorized access only
                </div>
            </div>
        </div>
    );
};
