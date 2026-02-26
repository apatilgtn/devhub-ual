import React from 'react';
import { Page, Header, Content, ContentHeader, SupportButton } from '@backstage/core-components';
import { Button } from '@material-ui/core';

export const KibanaPage = () => (
    <Page themeId="tool">
        <Header title="Kibana" subtitle="Visualize your data">
            <SupportButton />
        </Header>
        <Content>
            <ContentHeader title="Dashboards">
                <Button
                    variant="contained"
                    color="primary"
                    href="http://localhost:5601"
                    target="_blank"
                >
                    Open Kibana in new tab
                </Button>
            </ContentHeader>
            <div style={{ height: '100%', width: '100%' }}>
                <iframe
                    src="http://localhost:5601"
                    title="Kibana"
                    width="100%"
                    height="800px"
                    style={{ border: 'none' }}
                />
            </div>
        </Content>
    </Page>
);
