/**
 * Mock Apache Airflow REST API Server
 * Mimics /api/v1/ endpoints for Backstage integration demo.
 * Run: node mock-airflow-api.js
 */

const http = require('http');

const PORT = 8080;

// --- Mock Data ---

const dags = [
    {
        dag_id: 'example_dag',
        description: 'A simple example DAG for demo',
        file_token: 'example_dag.py',
        fileloc: '/opt/airflow/dags/example_dag.py',
        is_active: true,
        is_paused: false,
        is_subdag: false,
        owners: ['airflow'],
        root_dag_id: null,
        schedule_interval: { __type: 'CronExpression', value: '@daily' },
        tags: [{ name: 'example' }],
        next_dagrun: '2026-02-14T00:00:00+00:00',
        has_task_concurrency_limits: false,
        has_import_errors: false,
        next_dagrun_data_interval_start: '2026-02-13T00:00:00+00:00',
        next_dagrun_data_interval_end: '2026-02-14T00:00:00+00:00',
        max_active_runs: 16,
        next_dagrun_create_after: '2026-02-14T00:00:00+00:00',
        last_parsed_time: '2026-02-13T02:00:00+00:00',
        last_pickled: null,
        default_view: 'grid',
        timetable_description: 'At 00:00',
    },
    {
        dag_id: 'etl_pipeline',
        description: 'ETL pipeline for data warehouse ingestion',
        file_token: 'etl_pipeline.py',
        fileloc: '/opt/airflow/dags/etl_pipeline.py',
        is_active: true,
        is_paused: false,
        is_subdag: false,
        owners: ['data-team'],
        root_dag_id: null,
        schedule_interval: { __type: 'CronExpression', value: '0 6 * * *' },
        tags: [{ name: 'etl' }, { name: 'production' }],
        next_dagrun: '2026-02-14T06:00:00+00:00',
        has_task_concurrency_limits: false,
        has_import_errors: false,
        next_dagrun_data_interval_start: '2026-02-13T06:00:00+00:00',
        next_dagrun_data_interval_end: '2026-02-14T06:00:00+00:00',
        max_active_runs: 16,
        next_dagrun_create_after: '2026-02-14T06:00:00+00:00',
        last_parsed_time: '2026-02-13T02:00:00+00:00',
        last_pickled: null,
        default_view: 'grid',
        timetable_description: 'At 06:00',
    },
    {
        dag_id: 'data_quality_checks',
        description: 'Automated data quality validation',
        file_token: 'data_quality_checks.py',
        fileloc: '/opt/airflow/dags/data_quality_checks.py',
        is_active: true,
        is_paused: true,
        is_subdag: false,
        owners: ['qa-team'],
        root_dag_id: null,
        schedule_interval: { __type: 'CronExpression', value: '0 8 * * *' },
        tags: [{ name: 'quality' }, { name: 'validation' }],
        next_dagrun: null,
        has_task_concurrency_limits: false,
        has_import_errors: false,
        next_dagrun_data_interval_start: null,
        next_dagrun_data_interval_end: null,
        max_active_runs: 16,
        next_dagrun_create_after: null,
        last_parsed_time: '2026-02-13T02:00:00+00:00',
        last_pickled: null,
        default_view: 'grid',
        timetable_description: 'At 08:00',
    },
    {
        dag_id: 'ml_model_training',
        description: 'Weekly ML model retraining pipeline',
        file_token: 'ml_model_training.py',
        fileloc: '/opt/airflow/dags/ml_model_training.py',
        is_active: true,
        is_paused: false,
        is_subdag: false,
        owners: ['ml-team'],
        root_dag_id: null,
        schedule_interval: { __type: 'CronExpression', value: '0 2 * * 0' },
        tags: [{ name: 'ml' }, { name: 'training' }],
        next_dagrun: '2026-02-16T02:00:00+00:00',
        has_task_concurrency_limits: false,
        has_import_errors: false,
        next_dagrun_data_interval_start: '2026-02-09T02:00:00+00:00',
        next_dagrun_data_interval_end: '2026-02-16T02:00:00+00:00',
        max_active_runs: 1,
        next_dagrun_create_after: '2026-02-16T02:00:00+00:00',
        last_parsed_time: '2026-02-13T02:00:00+00:00',
        last_pickled: null,
        default_view: 'grid',
        timetable_description: 'At 02:00, only on Sunday',
    },
];

const dagRuns = {
    example_dag: [
        { dag_run_id: 'scheduled__2026-02-13T00:00:00+00:00', dag_id: 'example_dag', logical_date: '2026-02-13T00:00:00+00:00', execution_date: '2026-02-13T00:00:00+00:00', start_date: '2026-02-13T00:00:05+00:00', end_date: '2026-02-13T00:00:35+00:00', state: 'success', run_type: 'scheduled', external_trigger: false },
        { dag_run_id: 'scheduled__2026-02-12T00:00:00+00:00', dag_id: 'example_dag', logical_date: '2026-02-12T00:00:00+00:00', execution_date: '2026-02-12T00:00:00+00:00', start_date: '2026-02-12T00:00:04+00:00', end_date: '2026-02-12T00:00:28+00:00', state: 'success', run_type: 'scheduled', external_trigger: false },
        { dag_run_id: 'manual__2026-02-11T14:30:00+00:00', dag_id: 'example_dag', logical_date: '2026-02-11T14:30:00+00:00', execution_date: '2026-02-11T14:30:00+00:00', start_date: '2026-02-11T14:30:02+00:00', end_date: '2026-02-11T14:30:22+00:00', state: 'success', run_type: 'manual', external_trigger: true },
    ],
    etl_pipeline: [
        { dag_run_id: 'scheduled__2026-02-13T06:00:00+00:00', dag_id: 'etl_pipeline', logical_date: '2026-02-13T06:00:00+00:00', execution_date: '2026-02-13T06:00:00+00:00', start_date: '2026-02-13T06:00:03+00:00', end_date: null, state: 'running', run_type: 'scheduled', external_trigger: false },
        { dag_run_id: 'scheduled__2026-02-12T06:00:00+00:00', dag_id: 'etl_pipeline', logical_date: '2026-02-12T06:00:00+00:00', execution_date: '2026-02-12T06:00:00+00:00', start_date: '2026-02-12T06:00:05+00:00', end_date: '2026-02-12T06:45:12+00:00', state: 'success', run_type: 'scheduled', external_trigger: false },
        { dag_run_id: 'scheduled__2026-02-11T06:00:00+00:00', dag_id: 'etl_pipeline', logical_date: '2026-02-11T06:00:00+00:00', execution_date: '2026-02-11T06:00:00+00:00', start_date: '2026-02-11T06:00:04+00:00', end_date: '2026-02-11T06:42:55+00:00', state: 'failed', run_type: 'scheduled', external_trigger: false },
    ],
    data_quality_checks: [],
    ml_model_training: [
        { dag_run_id: 'scheduled__2026-02-09T02:00:00+00:00', dag_id: 'ml_model_training', logical_date: '2026-02-09T02:00:00+00:00', execution_date: '2026-02-09T02:00:00+00:00', start_date: '2026-02-09T02:00:10+00:00', end_date: '2026-02-09T04:15:33+00:00', state: 'success', run_type: 'scheduled', external_trigger: false },
    ],
};

// --- Server ---

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const rawUrl = req.url;
    // Normalize: strip /api/v1 prefix so both /api/v1/dags and /dags work
    const url = rawUrl.replace(/^\/api\/v1/, '');
    console.log(`[${new Date().toISOString()}] ${req.method} ${rawUrl} -> ${url}`);

    // Health check
    if (rawUrl === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({
            metadatabase: { status: 'healthy' },
            scheduler: { status: 'healthy', latest_scheduler_heartbeat: new Date().toISOString() },
            triggerer: { status: 'healthy', latest_triggerer_heartbeat: new Date().toISOString() },
        }));
        return;
    }

    // GET /dags  (or /api/v1/dags)
    if (url === '/dags' || url.startsWith('/dags?')) {
        res.writeHead(200);
        res.end(JSON.stringify({ dags, total_entries: dags.length }));
        return;
    }

    // GET /dags/:dag_id/dagRuns  (check BEFORE single dag to avoid greedy match)
    const dagRunsMatch = url.match(/^\/dags\/([^/]+)\/dagRuns/);
    if (dagRunsMatch) {
        const runs = dagRuns[dagRunsMatch[1]] || [];
        res.writeHead(200);
        res.end(JSON.stringify({ dag_runs: runs, total_entries: runs.length }));
        return;
    }

    // GET /dags/:dag_id
    const dagMatch = url.match(/^\/dags\/([^/]+)$/);
    if (dagMatch) {
        const dag = dags.find(d => d.dag_id === dagMatch[1]);
        if (dag) {
            res.writeHead(200);
            res.end(JSON.stringify(dag));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ detail: `DAG with dag_id: '${dagMatch[1]}' not found`, status: 404, title: 'DAG not found' }));
        }
        return;
    }

    // GET /version
    if (url === '/version') {
        res.writeHead(200);
        res.end(JSON.stringify({ version: '2.10.3', git_version: null }));
        return;
    }

    // Fallback
    res.writeHead(404);
    res.end(JSON.stringify({ detail: 'Not Found', status: 404 }));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Mock Airflow API running at http://localhost:${PORT}`);
    console.log(`   Health:   http://localhost:${PORT}/health`);
    console.log(`   DAGs:     http://localhost:${PORT}/api/v1/dags`);
    console.log(`   Version:  http://localhost:${PORT}/api/v1/version\n`);
});
