import React from 'react';
import {
    Page,
    Header,
    Content,
    SupportButton,
    InfoCard,
} from '@backstage/core-components';
import { Grid, Typography, Chip, Box, makeStyles } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/lib/useAsync';
import { Table, TableColumn } from '@backstage/core-components';
import { Link } from '@backstage/core-components';
import StorageIcon from '@material-ui/icons/Storage';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import TimelineIcon from '@material-ui/icons/Timeline';

const useStyles = makeStyles(theme => ({
    statsIcon: {
        fontSize: 48,
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(1),
        opacity: 0.8,
    },
    statsValue: {
        fontWeight: 900,
        letterSpacing: '-0.05em',
        color: theme.palette.text.primary,
    },
    statsLabel: {
        color: theme.palette.text.secondary,
        textTransform: 'uppercase',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        fontWeight: 700,
    },
    cardHeader: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingBottom: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
    chip: {
        backgroundColor: theme.palette.action.hover,
        border: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        fontWeight: 600,
        '& .MuiChip-icon': {
            color: theme.palette.text.secondary,
        }
    },
    codeFamily: {
        fontFamily: "'Source Code Pro', monospace",
        fontSize: '0.9rem',
        fontWeight: 600,
    }
}));

type DataAsset = {
    metadata: {
        name: string;
        description?: string;
        tags?: string[];
    };
    spec: {
        type?: string;
        owner?: string;
        system?: string;
    };
};

const typeIcons: Record<string, React.ReactNode> = {
    database: <StorageIcon />,
    dataset: <CloudQueueIcon />,
    stream: <TimelineIcon />,
};

const DataStats = ({ assets }: { assets: DataAsset[] }) => {
    const classes = useStyles();
    const databases = assets.filter(a => a.spec.type === 'database').length;
    const datasets = assets.filter(a => a.spec.type === 'dataset').length;
    const streams = assets.filter(a => a.spec.type === 'stream').length;

    const StatItem = ({ icon, value, label }: { icon: React.ReactNode, value: number, label: string }) => (
        <Grid item xs={4}>
            <Box textAlign="center">
                <Box className={classes.statsIcon}>{icon}</Box>
                <Typography variant="h3" className={classes.statsValue}>{value}</Typography>
                <Typography className={classes.statsLabel}>{label}</Typography>
            </Box>
        </Grid>
    );

    return (
        <InfoCard title="Infrastructure Overview">
            <Box className={classes.cardHeader}>
                <Typography variant="body2" color="textSecondary">
                    Real-time monitoring of your organizational data topology.
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <StatItem icon={<StorageIcon fontSize="inherit" />} value={databases} label="Databases" />
                <StatItem icon={<CloudQueueIcon fontSize="inherit" />} value={datasets} label="Datasets" />
                <StatItem icon={<TimelineIcon fontSize="inherit" />} value={streams} label="Streams" />
            </Grid>
        </InfoCard>
    );
};

const DataAssetsTable = ({ assets }: { assets: DataAsset[] }) => {
    const classes = useStyles();
    const columns: TableColumn<DataAsset>[] = [
        {
            title: 'Type',
            field: 'spec.type',
            render: (row) => (
                <Chip
                    icon={typeIcons[row.spec.type || 'dataset'] as React.ReactElement}
                    label={row.spec.type?.toUpperCase() || 'UNKNOWN'}
                    className={classes.chip}
                    size="small"
                />
            ),
            width: '140px',
        },
        {
            title: 'Name',
            field: 'metadata.name',
            render: (row) => (
                <Link to={`/catalog/default/resource/${row.metadata.name}`} className={classes.codeFamily}>
                    {row.metadata.name}
                </Link>
            ),
        },
        {
            title: 'Description',
            field: 'metadata.description',
            render: (row) => (
                <Typography variant="body2" style={{ maxWidth: 450, opacity: 0.7 }}>
                    {row.metadata.description || '-'}
                </Typography>
            ),
        },
        {
            title: 'Owner',
            field: 'spec.owner',
            render: (row) => row.spec.owner || '-',
            width: '150px',
        },
        {
            title: 'Tags',
            render: (row) => (
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {row.metadata.tags?.slice(0, 3).map(tag => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" className={classes.chip} />
                    ))}
                </Box>
            ),
        },
    ];

    return (
        <Table
            title="Data Assets"
            subtitle="Secure registry of verified organizational data resources"
            options={{ search: true, paging: true, pageSize: 10 }}
            columns={columns}
            data={assets}
        />
    );
};

export const DataCatalogPage = () => {
    const catalogApi = useApi(catalogApiRef);

    const { value: assets, loading, error } = useAsync(async () => {
        const response = await catalogApi.getEntities({
            filter: { kind: 'Resource' },
        });
        return response.items as DataAsset[];
    }, []);

    if (error) {
        return (
            <Page themeId="app">
                <Header title="Data Catalog" subtitle="Discover and explore your data assets" />
                <Content>
                    <Typography color="error">Critical Error: Failed to resolve data topology ({error.message})</Typography>
                </Content>
            </Page>
        );
    }

    return (
        <Page themeId="app">
            <Header title="Data Catalog" subtitle="Master Registry of Organizational Assets">
                <SupportButton />
            </Header>
            <Content>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <DataStats assets={assets || []} />
                    </Grid>
                    <Grid item xs={12}>
                        <DataAssetsTable assets={assets || []} />
                    </Grid>
                </Grid>
            </Content>
        </Page>
    );
};
