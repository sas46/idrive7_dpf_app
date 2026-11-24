'use strict';
// Run after build; test the actual packaged JS with a fake renderer.
const assert=require('assert'), E=require('events'), path=require('path');
const {Notifications,frame}=require(path.resolve(process.argv[2], 'cluster_notifications.js'));
let now=100, opts={clusterEnabled:true,clusterRequested:true,clusterRunning:true,clusterCompleted:true,clusterDuration:5,clusterMode:'icon'}, last;
class Mock extends E {connect(){this.ready=true;this.emit('ready');} close(){} drop(){} image(o){last=o;return 1;} pixels(r,d,p){assert.equal(p.length,last.w*last.h*4);return true;}}
const n=new Notifications({get:k=>opts[k]},console,()=>now,()=>new Mock());
n.update(6,true,false);assert.equal(last.w,460);assert.equal(last.exclusive,false);assert.equal(last.contend,true);assert.equal(last.target,'map');assert.equal(last.y,372);
now+=5001;n.update(6,true,false);assert.equal(last.w,80);
n.update(4,true,false);assert.equal(last.w,460);n.update(4,false,false);assert.equal(n.cr,null);
n.complete();n.update(0,true,false);assert.equal(last.w,460);now+=6000;n.update(0,true,false);assert.equal(n.cr,null);
opts.clusterMode='temporary';n.update(6,true,false);now+=6000;n.update(6,true,false);assert.equal(n.cr,null);
opts.clusterMode='bar';n.update(4,true,false);now+=6000;n.update(4,true,false);assert.equal(last.w,460);opts.clusterEnabled=false;n.update(4,true,false);assert.equal(n.cr,null);
opts.clusterEnabled=true;n.test(true);n.update(0,false,false);assert.equal(last.w,460);assert.equal(n.testActive,true);n.test(false);n.update(0,false,true);assert.equal(n.testActive,false);assert.equal(n.cr,null);
n.update(1,true,false);assert.equal(n.state,'requested');
n.update(2,true,false);assert.equal(n.state,'running');
n.update(3,true,false);assert.equal(n.cr,null);
assert.equal(frame('requested',true,false)[(40*80+5)*4+3],220);
console.log('cluster notifications: OK');
