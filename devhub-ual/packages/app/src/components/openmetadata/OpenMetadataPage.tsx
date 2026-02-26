import React, { useState, useEffect } from 'react';
import {
    Page,
    Header,
    Content,
    InfoCard,
    Table,
    TableColumn,
    Link,
} from '@backstage/core-components';
import {
    Grid,
    Typography,
    Chip,
    Box,
    makeStyles,
    CircularProgress,
    Tab,
    Tabs,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import StorageIcon from '@material-ui/icons/Storage';
import TableChartIcon from '@material-ui/icons/TableChart';
import ViewListIcon from '@material-ui/icons/ViewList';
import LinkIcon from '@material-ui/icons/Launch';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { useApi, discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
    statsCard: {
        textAlign: 'center' as const,
        padding: theme.spacing(3),
    },
    statsIcon: {
        fontSize: 40,
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(1),
    },
    statsValue: {
        fontWeight: 900,
        fontSize: '2rem',
        letterSpacing: '-0.03em',
    },
    statsLabel: {
        textTransform: 'uppercase' as const,
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        fontWeight: 700,
        color: theme.palette.text.secondary,
    },
    chip: {
        fontWeight: 600,
        fontSize: '0.7rem',
    },
    tagChip: {
        margin: 2,
        fontSize: '0.65rem',
    },
    ownerChip: {
        backgroundColor: theme.palette.type === 'dark' ? '#2c387e' : '#e3f2fd',
        color: theme.palette.type === 'dark' ? '#90caf9' : '#1565c0',
        fontWeight: 600,
    },
    serviceChip: {
        backgroundColor: theme.palette.type === 'dark' ? '#1b3a2d' : '#e8f5e9',
        color: theme.palette.type === 'dark' ? '#81c784' : '#2e7d32',
        fontWeight: 600,
    },
    tierChip: {
        backgroundColor: theme.palette.type === 'dark' ? '#3e2a05' : '#fff3e0',
        color: theme.palette.type === 'dark' ? '#ffb74d' : '#e65100',
        fontWeight: 600,
    },
    healthy: { color: '#4caf50' },
    unhealthy: { color: '#f44336' },
    description: {
        maxWidth: 350,
        opacity: 0.75,
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    columnLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    },
}));

interface OMTable {
    id: string;
    name: string;
    fullyQualifiedName: string;
    description?: string;
    tableType?: string;
    columns?: { name: string; dataType: string; description?: string }[];
    owner?: { name: string; type: string };
    service?: { name: string };
    tags?: { tagFQN: string }[];
    database?: { name: string };
    databaseSchema?: { name: string };
}

interface OMDatabase {
    id: string;
    name: string;
    fullyQualifiedName: string;
    description?: string;
    service?: { name: string };
    owner?: { name: string };
}

const OpenMetadataPage = () => {
    const classes = useStyles();
    const discoveryApi = useApi(discoveryApiRef);
    const fetchApi = useApi(fetchApiRef);
    const [tab, setTab] = useState(0);
    const [tables, setTables] = useState<OMTable[]>([]);
    const [databases, setDatabases] = useState<OMDatabase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [health, setHealth] = useState<boolean | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const proxyUrl = await discoveryApi.getBaseUrl('proxy');

                // Health check (version endpoint doesn't require auth)
                try {
                    const healthRes = await fetchApi.fetch(`${proxyUrl}/openmetadata/api/v1/system/version`);
                    setHealth(healthRes.ok);
                    if (!healthRes.ok) {
                        setError('OpenMetadata server is not reachable');
                        return;
                    }
                } catch {
                    setHealth(false);
                    setError('Cannot connect to OpenMetadata server');
                    return;
                }

                // Fetch tables (auth handled by proxy headers in app-config.yaml)
                try {
                    const tablesRes = await fetchApi.fetch(
                        `${proxyUrl}/openmetadata/api/v1/tables?limit=50&fields=owner,tags,columns,database,databaseSchema`,
                    );
                    if (tablesRes.ok) {
                        const data = await tablesRes.json();
                        setTables(data.data || []);
                    }
                } catch { /* tables fetch failed */ }

                // Fetch databases
                try {
                    const dbRes = await fetchApi.fetch(
                        `${proxyUrl}/openmetadata/api/v1/databases?limit=50&fields=owner`,
                    );
                    if (dbRes.ok) {
                        const data = await dbRes.json();
                        setDatabases(data.data || []);
                    }
                } catch { /* databases fetch failed */ }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [discoveryApi, fetchApi]);

    const tableColumns: TableColumn<OMTable>[] = [
        {
            title: 'Name',
            field: 'name',
            render: (row) => (
                <Box>
                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                        {row.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {row.databaseSchema?.name || ''}.{row.database?.name || ''}
                    </Typography>
                </Box>
            ),
        },
        {
            title: 'Type',
            field: 'tableType',
            render: (row) => (
                <Chip
                    label={row.tableType || 'Regular'}
                    size="small"
                    className={classes.chip}
                    variant="outlined"
                />
            ),
            width: '120px',
        },
        {
            title: 'Columns',
            render: (row) => (
                <Chip
                    label={`${row.columns?.length || 0} cols`}
                    size="small"
                    className={classes.chip}
                    variant="outlined"
                    icon={<ViewListIcon style={{ fontSize: 14 }} />}
                />
            ),
            width: '110px',
        },
        {
            title: 'Service',
            render: (row) => row.service ? (
                <Chip label={row.service.name} size="small" className={`${classes.chip} ${classes.serviceChip}`} />
            ) : '-',
            width: '150px',
        },
        {
            title: 'Owner',
            render: (row) => row.owner ? (
                <Chip label={row.owner.name} size="small" className={`${classes.chip} ${classes.ownerChip}`} />
            ) : (
                <Typography variant="caption" color="textSecondary">Unowned</Typography>
            ),
            width: '150px',
        },
        {
            title: 'Description',
            render: (row) => (
                <Typography variant="body2" className={classes.description}>
                    {row.description || '-'}
                </Typography>
            ),
        },
        {
            title: 'Tags',
            render: (row) => (
                <Box display="flex" flexWrap="wrap">
                    {(row.tags || []).slice(0, 3).map(t => (
                        <Chip key={t.tagFQN} label={t.tagFQN} size="small" variant="outlined" className={classes.tagChip} />
                    ))}
                </Box>
            ),
        },
        {
            title: '',
            render: (row) => (
                <Tooltip title="Open in OpenMetadata">
                    <IconButton
                        size="small"
                        href={`http://localhost:8585/table/${row.fullyQualifiedName}`}
                        target="_blank"
                    >
                        <LinkIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
            width: '50px',
        },
    ];

    const dbColumns: TableColumn<OMDatabase>[] = [
        {
            title: 'Database',
            field: 'name',
            render: (row) => (
                <Typography variant="body2" style={{ fontWeight: 600 }}>{row.name}</Typography>
            ),
        },
        {
            title: 'Fully Qualified Name',
            field: 'fullyQualifiedName',
            render: (row) => (
                <Typography variant="body2" color="textSecondary" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {row.fullyQualifiedName}
                </Typography>
            ),
        },
        {
            title: 'Service',
            render: (row) => row.service ? (
                <Chip label={row.service.name} size="small" className={`${classes.chip} ${classes.serviceChip}`} />
            ) : '-',
        },
        {
            title: 'Owner',
            render: (row) => row.owner ? (
                <Chip label={row.owner.name} size="small" className={`${classes.chip} ${classes.ownerChip}`} />
            ) : (
                <Typography variant="caption" color="textSecondary">Unowned</Typography>
            ),
        },
        {
            title: 'Description',
            render: (row) => (
                <Typography variant="body2" className={classes.description}>
                    {row.description || '-'}
                </Typography>
            ),
        },
    ];

    if (loading) {
        return (
            <Page themeId="tool">
                <Header title="OpenMetadata" subtitle="Data Discovery & Governance" />
                <Content>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                        <CircularProgress />
                    </Box>
                </Content>
            </Page>
        );
    }

    if (error) {
        return (
            <Page themeId="tool">
                <Header title="OpenMetadata" subtitle="Data Discovery & Governance" />
                <Content>
                    <InfoCard title="Connection Error">
                        <Typography color="error">
                            Failed to connect to OpenMetadata: {error}
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: 8 }}>
                            Ensure OpenMetadata is running on http://localhost:8585
                        </Typography>
                    </InfoCard>
                </Content>
            </Page>
        );
    }

    return (
        <Page themeId="tool">
            <Header title="OpenMetadata" subtitle="Data Discovery & Governance Platform">
                <Box display="flex" alignItems="center" gap={1}>
                    {health !== null && (
                        <Chip
                            icon={health ? <CheckCircleIcon className={classes.healthy} /> : <ErrorIcon className={classes.unhealthy} />}
                            label={health ? 'Connected' : 'Disconnected'}
                            size="small"
                            variant="outlined"
                        />
                    )}
                    <Tooltip title="Open OpenMetadata UI">
                        <IconButton
                            size="small"
                            href="http://localhost:8585"
                            target="_blank"
                            style={{ color: 'white' }}
                        >
                            <LinkIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Header>
            <Content>
                <Grid container spacing={3}>
                    {/* Stats */}
                    <Grid item xs={4}>
                        <InfoCard title="">
                            <Box className={classes.statsCard}>
                                <TableChartIcon className={classes.statsIcon} />
                                <Typography className={classes.statsValue}>{tables.length}</Typography>
                                <Typography className={classes.statsLabel}>Tables</Typography>
                            </Box>
                        </InfoCard>
                    </Grid>
                    <Grid item xs={4}>
                        <InfoCard title="">
                            <Box className={classes.statsCard}>
                                <StorageIcon className={classes.statsIcon} />
                                <Typography className={classes.statsValue}>{databases.length}</Typography>
                                <Typography className={classes.statsLabel}>Databases</Typography>
                            </Box>
                        </InfoCard>
                    </Grid>
                    <Grid item xs={4}>
                        <InfoCard title="">
                            <Box className={classes.statsCard}>
                                <ViewListIcon className={classes.statsIcon} />
                                <Typography className={classes.statsValue}>
                                    {tables.reduce((acc, t) => acc + (t.columns?.length || 0), 0)}
                                </Typography>
                                <Typography className={classes.statsLabel}>Total Columns</Typography>
                            </Box>
                        </InfoCard>
                    </Grid>

                    {/* Tabs */}
                    <Grid item xs={12}>
                        <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary" textColor="primary">
                            <Tab label={`Tables (${tables.length})`} />
                            <Tab label={`Databases (${databases.length})`} />
                        </Tabs>
                    </Grid>

                    <Grid item xs={12}>
                        {tab === 0 && (
                            <Table
                                title="Tables"
                                subtitle="All tables discovered by OpenMetadata"
                                options={{ search: true, paging: true, pageSize: 10 }}
                                columns={tableColumns}
                                data={tables}
                            />
                        )}
                        {tab === 1 && (
                            <Table
                                title="Databases"
                                subtitle="All databases registered in OpenMetadata"
                                options={{ search: true, paging: true, pageSize: 10 }}
                                columns={dbColumns}
                                data={databases}
                            />
                        )}
                    </Grid>
                </Grid>
            </Content>
        </Page>
    );
};

export { OpenMetadataPage };
