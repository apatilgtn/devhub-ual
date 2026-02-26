import React from 'react';
import { Page, Header, Content, ContentHeader, SupportButton, InfoCard } from '@backstage/core-components';
import { Grid, Typography, Chip, Box, Link as MuiLink, makeStyles, useTheme } from '@material-ui/core';
import { useApi, fetchApiRef, discoveryApiRef } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { Table, TableColumn, StatusOK, StatusError, StatusWarning } from '@backstage/core-components';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
    headerTitle: {
        fontWeight: 900,
        letterSpacing: '-0.05em',
        color: theme.palette.text.primary,
    },
    statValue: {
        fontWeight: 900,
        letterSpacing: '-0.05em',
        color: theme.palette.text.primary,
    },
    statLabel: {
        color: theme.palette.text.secondary,
        textTransform: 'uppercase',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        fontWeight: 700,
    },
    chip: {
        backgroundColor: theme.palette.action.hover,
        border: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        fontWeight: 700,
        borderRadius: 8,
    },
    codeFamily: {
        fontFamily: "'Source Code Pro', monospace",
        fontSize: '0.85rem',
        fontWeight: 600,
    }
}));

type IndexInfo = {
    health: string;
    status: string;
    index: string;
    uuid: string;
    pri: string;
    rep: string;
    'docs.count': string;
    'docs.deleted': string;
    'store.size': string;
    'pri.store.size': string;
};

type ClusterHealth = {
    cluster_name: string;
    status: string;
    number_of_nodes: number;
    active_primary_shards: number;
    active_shards: number;
};

type LogEntry = {
    _source: {
        '@timestamp': string;
        message?: string;
        log?: { level?: string };
        kubernetes?: {
            namespace?: string;
            pod?: { name?: string };
            container?: { name?: string };
        };
        stream?: string;
    };
};

const ClusterStatus = () => {
    const discoveryApi = useApi(discoveryApiRef);
    const fetchApi = useApi(fetchApiRef);
    const classes = useStyles();
    const theme = useTheme();

    const { value, loading, error } = useAsync(async (): Promise<ClusterHealth> => {
        const proxyUrl = await discoveryApi.getBaseUrl('proxy');
        const response = await fetchApi.fetch(`${proxyUrl}/elasticsearch/_cluster/health`);
        if (!response.ok) {
            throw new Error(`Failed to fetch cluster health: ${response.statusText}`);
        }
        return response.json();
    });

    if (loading) return null;

    if (error) return <Alert severity="error" style={{ borderRadius: 16 }}>{error.message}</Alert>;

    return (
        <InfoCard title="Infrastructure Integrity">
            <Box display="flex" alignItems="center" mb={4} pb={2} borderBottom={`1px solid ${theme.palette.divider}`}>
                <Typography variant="h5" className={classes.headerTitle} style={{ marginRight: 16 }}>{value?.cluster_name}</Typography>
                <Chip label={value?.status?.toUpperCase()} className={classes.chip} />
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Typography variant="h3" className={classes.statValue}>{value?.number_of_nodes}</Typography>
                    <Typography className={classes.statLabel}>Active Nodes</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h3" className={classes.statValue}>{value?.active_shards}</Typography>
                    <Typography className={classes.statLabel}>Total Shards</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h3" className={classes.statValue}>{value?.active_primary_shards}</Typography>
                    <Typography className={classes.statLabel}>Primary Subsets</Typography>
                </Grid>
            </Grid>
        </InfoCard>
    );
};

const RecentLogs = () => {
    const discoveryApi = useApi(discoveryApiRef);
    const fetchApi = useApi(fetchApiRef);
    const classes = useStyles();

    const { value, loading, error } = useAsync(async (): Promise<LogEntry[]> => {
        const proxyUrl = await discoveryApi.getBaseUrl('proxy');
        const query = {
            size: 50,
            sort: [{ '@timestamp': 'desc' }],
            query: {
                bool: {
                    should: [
                        { match: { 'stream': 'stderr' } },
                        { match_phrase: { 'message': 'error' } },
                        { match_phrase: { 'message': 'Error' } },
                        { match_phrase: { 'message': 'failed' } },
                        { match_phrase: { 'message': 'exception' } }
                    ],
                    minimum_should_match: 1
                }
            }
        };
        const response = await fetchApi.fetch(`${proxyUrl}/elasticsearch/filebeat-*/_search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query)
        });
        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }
        const data = await response.json();
        return data.hits?.hits || [];
    });

    if (error) return <Alert severity="warning" style={{ borderRadius: 16 }}>Telemetric feed unavailable: {error.message}</Alert>;

    const columns: TableColumn<LogEntry>[] = [
        {
            title: 'Timestamp',
            field: '_source.@timestamp',
            render: (row: LogEntry) => {
                const ts = row._source['@timestamp'];
                return ts ? new Date(ts).toLocaleTimeString() : '-';
            },
            width: '120px'
        },
        {
            title: 'Pod',
            render: (row: LogEntry) => <span className={classes.codeFamily}>{row._source.kubernetes?.pod?.name || '-'}</span>,
            width: '250px'
        },
        {
            title: 'Namespace',
            render: (row: LogEntry) => <span className={classes.codeFamily}>{row._source.kubernetes?.namespace || '-'}</span>,
            width: '150px'
        },
        {
            title: 'Message',
            render: (row: LogEntry) => {
                const msg = row._source.message || '';
                return <Typography variant="body2" style={{ opacity: 0.7 }}>{msg.length > 150 ? msg.substring(0, 150) + '...' : msg}</Typography>;
            }
        }
    ];

    return (
        <Table
            title="Recent Errors & Warnings"
            subtitle="Automated capture of high-priority system events"
            options={{ search: true, paging: true, pageSize: 10 }}
            columns={columns}
            data={value || []}
            isLoading={loading}
        />
    );
};

const IndicesTable = () => {
    const discoveryApi = useApi(discoveryApiRef);
    const fetchApi = useApi(fetchApiRef);
    const classes = useStyles();

    const { value, loading, error } = useAsync(async (): Promise<IndexInfo[]> => {
        const proxyUrl = await discoveryApi.getBaseUrl('proxy');
        const response = await fetchApi.fetch(`${proxyUrl}/elasticsearch/_cat/indices?format=json`);
        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error(`Failed to fetch indices: ${response.statusText}`);
        }
        return response.json();
    });

    if (error) return <Alert severity="error" style={{ borderRadius: 16 }}>{error.message}</Alert>;

    const columns: TableColumn<IndexInfo>[] = [
        {
            title: 'Health',
            field: 'health',
            render: (row: IndexInfo) => {
                switch (row.health) {
                    case 'green': return <StatusOK />;
                    case 'yellow': return <StatusWarning />;
                    case 'red': return <StatusError />;
                    default: return row.health;
                }
            },
            width: '100px'
        },
        { title: 'Index Name', field: 'index', render: (row: IndexInfo) => <span className={classes.codeFamily}>{row.index}</span> },
        { title: 'Docs', field: 'docs.count', type: 'numeric', width: '120px' },
        { title: 'Size', field: 'store.size', width: '120px' },
    ];

    return (
        <Table
            title="Indices"
            options={{ search: true, paging: true, pageSize: 5 }}
            columns={columns}
            data={value || []}
            isLoading={loading}
        />
    );
};

const QuickLinks = () => (
    <InfoCard title="Quick Links">
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <MuiLink href="/kibana" style={{ fontWeight: 700 }}>
                📊 Open Kibana Dashboards
            </MuiLink>
            <MuiLink href="http://localhost:5601/app/discover" target="_blank" style={{ opacity: 0.8 }}>
                🔍 Log Explorer (Kibana Discover)
            </MuiLink>
            <MuiLink href="http://localhost:5601/app/management/kibana/dataViews" target="_blank" style={{ opacity: 0.8 }}>
                ⚙️ Manage Index Patterns
            </MuiLink>
        </Box>
    </InfoCard>
);

export const ElasticsearchPage = () => (
    <Page themeId="app">
        <Header title="Observability Hub" subtitle="Integrated Telemetric Data Interface">
            <SupportButton />
        </Header>
        <Content>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <ClusterStatus />
                </Grid>
                <Grid item xs={12} md={4}>
                    <QuickLinks />
                </Grid>
                <Grid item xs={12}>
                    <RecentLogs />
                </Grid>
                <Grid item xs={12}>
                    <IndicesTable />
                </Grid>
            </Grid>
        </Content>
    </Page>
);
