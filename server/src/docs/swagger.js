import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openapiSpecPath = path.join(__dirname, 'openapi.yaml');
const swaggerDocument = YAML.load(openapiSpecPath);

/**
 * Express middleware array to serve Swagger UI and OpenAPI documentation.
 */
export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerDocument);
