import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { audit } from '../src/analyzer/index.js';
import { parseGraphQL } from '../src/graphql/index.js';
const cli=path.resolve('src/cli/index.js'),action=path.resolve('dist/index.cjs');
const packageVersion=JSON.parse(fs.readFileSync('package.json','utf8')).version;
function fixture(t,scopes=''){const root=fs.mkdtempSync(path.join(os.tmpdir(),'scope-hardening-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));fs.writeFileSync(path.join(root,'shopify.app.toml'),`[access_scopes]\nscopes="${scopes}"\n`);return root;}
const adminDocument = query => `const response = await admin.graphql(\`#graphql\n${query}\n\`);`;
test('local fragments, aliases and inline fragments preserve field paths',()=>{
 const fields=parseGraphQL('query { ...Root } fragment Root on QueryRoot { alias: products(first:1){... on ProductConnection {nodes {id}}} }','app.graphql')[0].fields;assert.ok(fields.some(f=>f.path==='products'));assert.ok(fields.some(f=>f.path==='products.nodes.id'));
 assert.throws(()=>parseGraphQL('query {...Missing}','x.graphql'),/Unresolved/);assert.throws(()=>parseGraphQL('query {...A} fragment A on QueryRoot {...A}','x.graphql'),/cyclic/);
});
test('fragments produce missing scopes and unresolved fragments stay unknown',t=>{
 const root=fixture(t);fs.writeFileSync(path.join(root,'app.ts'),adminDocument('query {...Root}\nfragment Root on QueryRoot {products(first:1){nodes{id}}}'));let r=audit({root});assert.equal(r.findings[0].scope,'read_products');assert.equal(r.findings[0].file,'app.ts');assert.equal(r.findings[0].line,3);
 fs.writeFileSync(path.join(root,'app.ts'),adminDocument('query {...Missing}'));r=audit({root});assert.ok(r.unknown.length);
});
test('unsupported roots and explicit Storefront documents do not become Admin evidence',t=>{
 const root=fixture(t);fs.writeFileSync(path.join(root,'app.graphql'),'# storefront\nquery {products(first:1){nodes{id}}}');assert.equal(audit({root}).observations.length,0);
 fs.writeFileSync(path.join(root,'app.graphql'),'query {notMapped{id}}');assert.equal(audit({root}).unknown.length,1);
});
test('classifies independent API surfaces per GraphQL document',t=>{
 const root=fixture(t),tick=String.fromCharCode(96);
 fs.writeFileSync(path.join(root,'mixed.ts'),[
  'const adminResult = await admin.graphql('+tick+'#graphql',
  'query AdminProducts { products(first: 1) { nodes { id } } }',
  tick+');',
  'const storefrontResult = await storefront.graphql('+tick+'#graphql',
  'query StorefrontProducts { products(first: 1) { nodes { id } } }',
  tick+');',
 ].join('\n'));
 const report=audit({root});
 assert.equal(report.observations.length,1);
 assert.equal(report.observations[0].apiSurface,'admin-graphql');
 assert.ok(report.findings.some(f=>f.scope==='read_products'));
 assert.equal(report.unknown.length,0);
});
test('Customer Account and ambiguous operations stay unknown',t=>{
 const root=fixture(t),tick=String.fromCharCode(96);
 fs.writeFileSync(path.join(root,'account.ts'),'const response = await customerAccount.graphql('+tick+'#graphql\nquery Account { customer { id } }\n'+tick+');');
 fs.writeFileSync(path.join(root,'ambiguous.ts'),'const query = '+tick+'#graphql\nquery Product { products(first: 1) { nodes { id } } }\n'+tick+';');
 const report=audit({root});
 assert.ok(report.unknown.some(item=>item.reason.includes('Customer Account GraphQL')));
 assert.ok(report.unknown.some(item=>item.reason.includes('assigned to one supported API surface')));
 assert.equal(report.observations.length,0);
});
test('release-candidate version metadata is explicit and unverified operations remain unknown',t=>{
 const root=fixture(t);
 fs.writeFileSync(path.join(root,'admin.ts'),adminDocument('query Products { products(first: 1) { nodes { id } } }'));
 const report=audit({root,apiVersion:'2027-01'});
 assert.equal(report.apiVersion.selected,'2027-01');
 assert.equal(report.apiVersion.status,'release-candidate');
 assert.equal(report.apiVersion.latestStable,'2026-10');
 assert.equal(report.apiVersion.evidenceVersion,'2026-10');
 assert.equal(report.apiVersion.evidenceApplicable,false);
 assert.equal(report.observations.length,0);
 assert.ok(report.unknown.some(item=>item.reason.includes('release-candidate')));
});
test('selecting one nested app restricts code scanning to its configuration root',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'scope-monorepo-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const appA=path.join(root,'apps','a'),appB=path.join(root,'apps','b');
 fs.mkdirSync(appA,{recursive:true});fs.mkdirSync(appB,{recursive:true});
 fs.writeFileSync(path.join(appA,'shopify.app.toml'),'[access_scopes]\nscopes=""');
 fs.writeFileSync(path.join(appB,'shopify.app.toml'),'[access_scopes]\nscopes=""');
 fs.writeFileSync(path.join(appB,'admin.ts'),adminDocument('query Products { products(first:1) { nodes { id } } }'));
 assert.throws(()=>audit({root}),/Nested Shopify app roots/);
 const report=audit({root,configPath:'apps/a/shopify.app.toml'});
 assert.equal(report.observations.length,0);
 assert.equal(report.findings.length,0);
});
test('relative configuration is resolved inside root and ambiguity is rejected',t=>{
 const root=fixture(t);fs.renameSync(path.join(root,'shopify.app.toml'),path.join(root,'shopify.app.dev.toml'));fs.writeFileSync(path.join(root,'shopify.app.prod.toml'),'[access_scopes]\nscopes=""');assert.throws(()=>audit({root}),/Multiple/);assert.equal(audit({root,configPath:'shopify.app.dev.toml'}).tool.version,packageVersion);assert.throws(()=>audit({root,configPath:'../external.toml'}),/inside/);
});
test('symlinks and oversized files are skipped; malformed config is redacted',t=>{
 const root=fixture(t),outside=fixture(t);fs.writeFileSync(path.join(outside,'query.graphql'),'mutation { productCreate(product:{title:"x"}){product{id}}}');
 try{fs.symlinkSync(path.join(outside,'query.graphql'),path.join(root,'linked.graphql'));}catch(e){if(e.code==='EPERM')return t.skip('Symlink privileges unavailable');throw e;}
 fs.writeFileSync(path.join(root,'large.js'),'x'.repeat(1024*1024+1));const r=audit({root});assert.equal(r.observations.length,0);assert.equal(r.skipped.length,2);
 fs.writeFileSync(path.join(root,'shopify.app.toml'),'secret="hidden"\ninvalid=[');assert.throws(()=>audit({root}),/Invalid Shopify app TOML/);
});
test('CLI policies reject typo and missing values',t=>{
 const root=fixture(t);for(const args of [['--fail-on','typo'],['--format','typo'],['--config'],['--api-version'],['--api-version','unstable-now'],['--unknown']]) assert.equal(spawnSync(process.execPath,[cli,'audit',root,...args]).status,2);assert.equal(spawnSync(process.execPath,[cli,'--help']).status,0);
 const rc=spawnSync(process.execPath,[cli,'audit',root,'--format','json','--api-version','2027-01'],{encoding:'utf8'});assert.equal(rc.status,0,rc.stderr);assert.equal(JSON.parse(rc.stdout).apiVersion.status,'release-candidate');
});
test('Action outcome agrees with none and medium policies and returns JSON file',t=>{
 const root=fixture(t,'read_products,write_products'),out=path.join(root,'outputs');fs.writeFileSync(out,'');
 const run=threshold=>spawnSync(process.execPath,[action],{encoding:'utf8',env:{...process.env,INPUT_PATH:root,INPUT_FAIL_ON:threshold,GITHUB_OUTPUT:out,RUNNER_TEMP:root}});
 assert.equal(run('none').status,0);assert.equal(run('medium').status,1);const text=fs.readFileSync(out,'utf8');assert.match(text,/outcome<<[^\n]+\npassed/);assert.match(text,/outcome<<[^\n]+\nfailed/);const report=text.match(/report<<([^\n]+)\n([^\n]+)\n\1/);assert.ok(report);assert.equal(JSON.parse(fs.readFileSync(report[2],'utf8')).tool.version,packageVersion);assert.equal(run('typo').status,2);
});

test('read analytics scopes cannot authorize write mutations',t=>{
 const root=fixture(t,'read_analytics_annotations,read_reports');fs.writeFileSync(path.join(root,'writes.ts'),adminDocument('mutation { analyticsAnnotationCreate(input:{title:"x"}){analyticsAnnotation{id}} analyticsTargetCreate(input:{name:"x"}){analyticsTarget{id}} }'));const r=audit({root});assert.ok(r.findings.some(f=>f.scope==='write_analytics_annotations'&&f.ruleId==='SG-SCOPE-001'));assert.ok(r.findings.some(f=>f.scope==='write_reports'&&f.ruleId==='SG-SCOPE-001'));
});
test('official alternative read scopes satisfy resource reads',t=>{
 const root=fixture(t,'read_products,read_marketplace_orders');fs.writeFileSync(path.join(root,'reads.ts'),adminDocument('query { inventoryItems(first:1){nodes{id}} orders(first:1){nodes{id}} }'));assert.ok(!audit({root}).findings.some(f=>f.ruleId==='SG-SCOPE-001'));
 fs.writeFileSync(path.join(root,'reads.ts'),adminDocument('query { inventoryItems(first:1){nodes{inventoryLevels(first:1){nodes{id}}}} }'));assert.ok(audit({root}).findings.some(f=>f.scope==='read_inventory'));
});
