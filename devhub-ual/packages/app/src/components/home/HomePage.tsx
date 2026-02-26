import {
    HomePageCompanyLogo,
    HomePageStarredEntities,
    HomePageToolkit,
    HeaderWorldClock,
    ClockConfig,
} from '@backstage/plugin-home';
import { Content, Header, Page } from '@backstage/core-components';
import { Grid, makeStyles, Typography, Card, CardContent, Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(5, 0),
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 120,
        marginBottom: theme.spacing(4),
    },
    logoText: {
        fontWeight: 900,
        fontSize: '3.5rem',
        letterSpacing: '-0.07em',
        background: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    logoTagline: {
        color: theme.palette.text.secondary,
        fontSize: '0.8rem',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        fontWeight: 700,
        marginTop: theme.spacing(-1),
    },
    sectionTitle: {
        fontWeight: 800,
        letterSpacing: '-0.02em',
        marginBottom: theme.spacing(3),
        color: theme.palette.text.primary,
    },
    infoCard: {
        height: '100%',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
    },
    cardTitle: {
        fontWeight: 700,
        marginBottom: theme.spacing(1),
        color: theme.palette.text.primary,
    },
    cardDescription: {
        color: theme.palette.text.secondary,
        lineHeight: 1.6,
    }
}));

const clockConfigs: ClockConfig[] = [
    { label: 'Sydney', timeZone: 'Australia/Sydney' },
    { label: 'New York', timeZone: 'America/New_York' },
    { label: 'London', timeZone: 'Europe/London' },
    { label: 'Tokyo', timeZone: 'Asia/Tokyo' },
];

const tools = [
    { url: '/catalog', label: 'Catalog', icon: <span>📦</span> },
    { url: '/api-docs', label: 'APIs', icon: <span>🔌</span> },
    { url: '/docs', label: 'TechDocs', icon: <span>📚</span> },
    { url: '/create', label: 'Create', icon: <span>➕</span> },
    { url: '/catalog-import', label: 'Import', icon: <span>📥</span> },
    { url: '/search', label: 'Search', icon: <span>🔍</span> },
];

const DeVHubLogoSite = () => {
    const classes = useStyles();
    return (
        <div className={classes.logoContainer}>
            <span className={classes.logoText}>DeV-Hub</span>
            <span className={classes.logoTagline}>Authorized Access</span>
        </div>
    );
};

const InfoCard = ({ title, description }: { title: string; description: string }) => {
    const classes = useStyles();
    return (
        <Card className={classes.infoCard}>
            <CardContent>
                <Typography variant="h6" className={classes.cardTitle}>
                    {title}
                </Typography>
                <Typography variant="body2" className={classes.cardDescription}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export const HomePage = () => {
    const classes = useStyles();

    return (
        <Page themeId="app">
            <Header title="Welcome to DeV-Hub" subtitle="Centralized Development Interface">
                <HeaderWorldClock clockConfigs={clockConfigs} />
            </Header>
            <Content>
                <Grid container spacing={4} className={classes.container}>
                    {/* Logo Section */}
                    <Grid item xs={12}>
                        <HomePageCompanyLogo logo={<DeVHubLogoSite />} />
                    </Grid>

                    {/* Main Actions Group */}
                    <Grid item xs={12} md={6}>
                        <Box mb={2}>
                            <Typography variant="h5" className={classes.sectionTitle}>Quick Access</Typography>
                        </Box>
                        <HomePageToolkit tools={tools} />
                    </Grid>

                    {/* Starred Entities */}
                    <Grid item xs={12} md={6}>
                        <Box mb={2}>
                            <Typography variant="h5" className={classes.sectionTitle}>Favorites</Typography>
                        </Box>
                        <HomePageStarredEntities />
                    </Grid>

                    {/* Overview Cards */}
                    <Grid item xs={12} md={4}>
                        <InfoCard
                            title="🚀 Software Catalog"
                            description="Discover and manage all services, APIs, and infrastructure components within the organizational mesh."
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InfoCard
                            title="📝 Scaffold Infrastructure"
                            description="Utilize verified templates to provision new cloud-native resources with security defaults baked-in."
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InfoCard
                            title="🔗 Integration Mesh"
                            description="Native connectivity with GitHub Actions, Kubernetes clusters, and Log Orchestrators (ELK)."
                        />
                    </Grid>
                </Grid>
            </Content>
        </Page>
    );
};
