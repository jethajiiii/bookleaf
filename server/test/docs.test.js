/* global fetch */
import test from 'node:test';
import assert from 'node:assert/strict';
import YAML from 'yamljs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from '../src/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('API Documentation: Swagger UI endpoint', async (t) => {
  const server = app.listen(0);
  const port = server.address().port;

  t.after(() => {
    server.close();
  });

  await t.test('GET /api/docs/ returns 200 with HTML containing Swagger UI', async () => {
    const res = await fetch(`http://127.0.0.1:${port}/api/docs/`);
    assert.equal(res.status, 200);
    const contentType = res.headers.get('content-type');
    assert.match(contentType, /text\/html/);
    const body = await res.text();
    assert.ok(body.includes('Swagger UI'), 'HTML contains Swagger UI title');
  });

  await t.test('GET /api/docs redirects (301) to /api/docs/', async () => {
    const res = await fetch(`http://127.0.0.1:${port}/api/docs`, { redirect: 'manual' });
    assert.equal(res.status, 301);
    assert.equal(res.headers.get('location'), '/api/docs/');
  });
});

test('OpenAPI Specification Integrity', async (t) => {
  const specPath = path.join(__dirname, '../src/docs/openapi.yaml');
  const spec = YAML.load(specPath);

  await t.test('Spec defines OpenAPI 3.0.3 and valid components', () => {
    assert.equal(spec.openapi, '3.0.3');
    assert.ok(spec.components?.schemas?.ErrorResponse, 'ErrorResponse schema exists');
    assert.ok(spec.components?.schemas?.DraftResponse, 'DraftResponse schema exists');
    assert.ok(spec.components?.securitySchemes?.bearerAuth, 'bearerAuth scheme exists');
  });

  await t.test('Draft endpoint response documents {draft: null, aiAvailable: false}', () => {
    const draftOp = spec.paths['/admin/tickets/{id}/draft']?.get;
    assert.ok(draftOp, 'GET /admin/tickets/{id}/draft exists');
    const examples = draftOp.responses['200']?.content['application/json']?.examples;
    assert.ok(examples?.aiUnavailable, 'aiUnavailable example exists');
    assert.equal(examples.aiUnavailable.value.draft, null);
    assert.equal(examples.aiUnavailable.value.aiAvailable, false);
  });

  await t.test('Admin ticket list query status documents status=all', () => {
    const listOp = spec.paths['/admin/tickets']?.get;
    const statusParam = listOp.parameters?.find((p) => p.name === 'status');
    assert.ok(statusParam, 'status query param exists');
    assert.ok(statusParam.schema?.enum?.includes('all'), 'status parameter includes "all"');
  });
});
