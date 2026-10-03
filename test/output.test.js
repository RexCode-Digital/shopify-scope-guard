import test from 'node:test';
import assert from 'node:assert/strict';
import { toHuman, toJson, toSarif } from '../src/output/index.js';
import { shouldFail } from '../src/policy.js';
const report={tool:{name:'shopify-scope-guard',version:'0.2.1'},summary:{declaredRequired:1,declaredOptional:0,evidenced:0,unknown:1,findingCount:1},findings:[{ruleId:'SG-SCOPE-001',severity:'high',scope:'read_products',file:'folder with space/app.graphql',line:2,explanation:'Missing scope',evidence:'products',source:'https://shopify.dev/docs/api/usage/access-scopes',remediation:'Declare scope'}],unknown:[{file:'app.js',line:1,reason:'Dynamic query'}],skipped:[{file:'large.js',reason:'Analysis limit'}]};
test('human output provides remediation, detailed unknown and incomplete scan count',()=>{const text=toHuman(report,{showUnmapped:true});assert.match(text,/Recommendation: Declare scope/);assert.match(text,/UNKNOWN app.js:1: Dynamic query/);assert.match(text,/Skipped analysis: 1/);});
test('JSON and SARIF preserve machine-readable evidence and URI escaping',()=>{assert.equal(JSON.parse(toJson(report)).tool.version,'0.2.1');const result=JSON.parse(toSarif(report)).runs[0].results[0];assert.equal(result.level,'error');assert.equal(result.locations[0].physicalLocation.artifactLocation.uri,'folder%20with%20space/app.graphql');});
test('failure policy is consistent at every supported severity',()=>{for(const threshold of ['low','medium','high'])assert.equal(shouldFail(report,threshold),true);assert.equal(shouldFail(report,'none'),false);assert.throws(()=>shouldFail(report,'typo'),/fail-on/);});
