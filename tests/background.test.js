'use strict';
// Exercise the built app without RHMI or a real vehicle, then attach a foreground UI.
const assert=require('assert'), fs=require('fs'), path=require('path'), vm=require('vm');
const dir=path.resolve(process.argv[2]);
let impl, queue=[], ticks=[], calls=[], miss=false, instances=0, listeners=[], now=1000, clusterUpdates=[];
const spec=JSON.parse(fs.readFileSync(path.join(__dirname,'../apps/idrive7_dpf_app/app.json')));
const values=Object.fromEntries(spec.settings.map(s=>[s.key,s.default])); values.demo='off';
const settings={get:k=>values[k],set(k,v){values[k]=v;listeners.forEach(f=>f(k,v));},onChange:f=>listeners.push(f)};
class Link {constructor(){instances++;this.stats={sent:0,replies:0,missed:0};this.ready=this.available=true;} async init(){} }
class Reader {constructor(link){this.link=link;this.pick={};this.raws={};} key(c){return c.did;} static label(c){return String(c.did);} async value(k){calls.push(k);this.link.stats.sent++;if(miss){this.link.stats.missed++;return null;}this.link.stats.replies++;return k==='regenReq'?6:1;} }
class Notifications {update(...a){clusterUpdates.push(a);} close(){} status(){return 'test';}}
const sandbox={require(n){if(n==='./kit/mgu')return {run:x=>impl=x};if(n==='./kit/readonly-diag')return {ReadOnlyDiag:Link};if(n==='./kit/dids')return {DidReader:Reader};if(n==='./cluster_notifications')return {Notifications};if(n==='fs')return {readFileSync(){throw Error('empty');},writeFileSync(){}};if(n==='path')return path;if(n==='./kit/gauges')return {isNum:Number.isFinite,fmt:String};return {};},process:{hrtime:()=>[Math.floor(now/1000),now%1000*1e6],on(){}},setTimeout(f,ms){const t={f,ms};queue.push(t);return t;},clearTimeout(t){queue=queue.filter(x=>x!==t);},setInterval(f){ticks.push(f);},console};
vm.runInNewContext(fs.readFileSync(path.join(dir,'app.js'),'utf8'),sandbox);
const ctx={settings,log:{info(){},warn(){}},spec,dataDir:'/fake',app:{},signals:{watch:async()=>{}}};
async function next(){const t=queue.shift();assert(t);now+=t.ms;await t.f();return t.ms;}
(async()=>{const engine=await impl.background(ctx);assert.equal(instances,1);await next();assert(calls.includes('regenReq'));ticks[0]();assert(clusterUpdates.some(a=>a[0]===6&&a[1]));
settings.set('backgroundMonitor',false);let n=calls.length;await next();assert.equal(calls.length,n);assert.equal(clusterUpdates.at(-1)[1],false);
settings.set('backgroundMonitor',true);await next();assert(calls.length>n);miss=true; n=calls.length;await next();assert.equal(calls.length-n,1);assert.equal(queue[0].ms,10000);await next();assert.equal(queue[0].ms,20000);await next();assert.equal(queue[0].ms,60000);miss=false;await next();assert.equal(queue[0].ms,2000);await next();assert.equal(instances,1);console.log('headless autostart, pause/resume, notification freshness and timeout backoff: OK');})().catch(e=>{console.error(e);process.exitCode=1;});
