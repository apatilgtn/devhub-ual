import { createBackendModule, coreServices } from '@backstage/backend-plugin-api';
import { Router } from 'express';

// Use the global fetch available in Node 18+; declare for TypeScript.
declare const fetch: any;

/**
 * Simple backend module that exposes a minimal Airflow "status" API for the UI.
 *
 * Routes (mounted under /api/airflowstatus):
 *   GET /health  -> proxies to <apacheAirflow.baseUrl>/api/v1/health
 *   GET /dags    -> proxies to <apacheAirflow.baseUrl>/api/v1/dags
 */

export default createBackendModule({
  pluginId: 'airflowstatus',
  moduleId: 'airflow-status',
  register(env) {
    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async init({ http, logger, config }) {
        const airflowConfig = config.getOptionalConfig('apacheAirflow');

        if (!airflowConfig) {
          logger.warn(
            'apacheAirflow config not found; /api/airflowstatus routes will be disabled',
          );
          return;
        }

        const baseUrl = airflowConfig.getString('baseUrl');
        const basicAuthHeader = airflowConfig.getOptionalString(
          'basicAuthHeader',
        );

        const router = Router();

        const buildHeaders = () => {
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (basicAuthHeader) {
            headers.Authorization = basicAuthHeader;
          }
          return headers;
        };

        router.get('/health', async (_req, res) => {
          try {
            const response = await fetch(`${baseUrl}/api/v1/health`, {
              headers: buildHeaders(),
            });
            const body = await response.json();
            res.status(response.status).json(body);
          } catch (error: any) {
            logger.error(`Error fetching Airflow health: ${error?.message}`);
            res.status(500).json({ error: 'Failed to fetch Airflow health' });
          }
        });

        router.get('/dags', async (req, res) => {
          const limit = req.query.limit ?? 50;
          const offset = req.query.offset ?? 0;

          try {
            const response = await fetch(
              `${baseUrl}/api/v1/dags?limit=${limit}&offset=${offset}`,
              {
                headers: buildHeaders(),
              },
            );
            const body = await response.json();
            res.status(response.status).json(body);
          } catch (error: any) {
            logger.error(`Error fetching Airflow DAGs: ${error?.message}`);
            res.status(500).json({ error: 'Failed to fetch Airflow DAGs' });
          }
        });

        // Mount under /api/airflowstatus
        http.use(router);

        logger.info('Airflow status backend module initialized at /api/airflowstatus');
      },
    });
  },
});

