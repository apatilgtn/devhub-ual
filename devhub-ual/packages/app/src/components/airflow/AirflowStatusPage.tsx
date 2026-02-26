import React, { useEffect, useState } from 'react';
import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Page,
  Progress,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';

type AirflowHealth = {
  scheduler?: { status?: string };
  metadatabase?: { status?: string };
  triggerer?: { status?: string };
  dag_processor?: { status?: string };
};

type AirflowDag = {
  dag_id: string;
  description?: string;
  is_paused?: boolean;
  is_active?: boolean;
  owners?: string[];
};

type DagResponse = {
  dags: AirflowDag[];
};

export const AirflowStatusPage = () => {
  const fetchApi = useApi(fetchApiRef);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [health, setHealth] = useState<AirflowHealth | undefined>();
  const [dags, setDags] = useState<AirflowDag[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [healthRes, dagsRes] = await Promise.all([
          fetchApi.fetch('/api/airflowstatus/health'),
          fetchApi.fetch('/api/airflowstatus/dags?limit=20&offset=0'),
        ]);

        if (!healthRes.ok) {
          throw new Error(`Health request failed (${healthRes.status})`);
        }

        const healthJson = (await healthRes.json()) as AirflowHealth;
        let dagRows: AirflowDag[] = [];

        if (dagsRes.ok) {
          const dagsJson = (await dagsRes.json()) as DagResponse;
          dagRows = dagsJson.dags ?? [];
        }

        if (!mounted) return;
        setHealth(healthJson);
        setDags(dagRows);
        setLoading(false);
      } catch (e: any) {
        if (!mounted) return;
        setError(e instanceof Error ? e : new Error(String(e)));
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [fetchApi]);

  const columns: TableColumn<AirflowDag>[] = [
    { title: 'DAG ID', field: 'dag_id' },
    { title: 'Description', field: 'description' },
    {
      title: 'Active',
      field: 'is_active',
      render: row => (row.is_active ? 'Yes' : 'No'),
    },
    {
      title: 'Paused',
      field: 'is_paused',
      render: row => (row.is_paused ? 'Yes' : 'No'),
    },
    {
      title: 'Owners',
      field: 'owners',
      render: row => (row.owners ?? []).join(', '),
    },
  ];

  if (loading) {
    return (
      <Page themeId="home">
        <Header title="Apache Airflow" subtitle="Workflow management platform" />
        <Content>
          <Progress />
        </Content>
      </Page>
    );
  }

  if (error) {
    return (
      <Page themeId="home">
        <Header title="Apache Airflow" subtitle="Workflow management platform" />
        <Content>
          <ResponseErrorPanel error={error} />
        </Content>
      </Page>
    );
  }

  return (
    <Page themeId="home">
      <Header title="Apache Airflow" subtitle="Workflow management platform">
        <HeaderLabel label="Scheduler" value={health?.scheduler?.status ?? '-'} />
        <HeaderLabel
          label="Metadata DB"
          value={health?.metadatabase?.status ?? '-'}
        />
        <HeaderLabel
          label="Triggerer"
          value={health?.triggerer?.status ?? '-'}
        />
      </Header>
      <Content>
        <ContentHeader title="DAGs (live from Airflow)" />
        <Table
          options={{ paging: false, search: false }}
          columns={columns}
          data={dags}
        />
      </Content>
    </Page>
  );
};

