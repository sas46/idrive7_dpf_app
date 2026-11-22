'use strict';
// Run after build; test the actual packaged JS with a fake renderer.
const assert=require('assert'), E=require('events'), path=require('path');
const {Notifications,frame}=require(path.resolve(process.argv[2], 'cluster_notifications.js'));
let now=100, opts={clusterEnabled:true,clusterRequested:true,clusterRunning:true,clusterCompleted:true,clusterDuration:5,clusterMode:'icon'}, last;
class Mock extends E {connect(){this.ready=true;this.emit("ready");} close(){} drop(){} image(o){last=o;return 1;} pixels(r,d,p){assert.equal(p.length,last.w*last.h*4);return true;}}
const n=new Notifications({get:k=>opts[k]},console,()=>now,()=>new Mock());
n.update(6,true,false);assert.equal(last.w,400);assert.equal(last.y+last.h,420);assert.equal(last.exclusive,false);assert.equal(last.target,'map');assert.equal(last.x,344);assert.equal(last.z,1000);assert(Number.isFinite(last.z) && last.z>=-1000 && last.z<=1000);assert.equal(last.z,1000);assert(Number.isFinite(last.z) && last.z>=-1000 && last.z<=1000);
now+=5001;n.update(6,true,false);assert.equal(last.w,80);assert.equal(last.y+last.h,420);
n.update(4,true,false);assert.equal(last.w,400);n.update(4,false,false);assert.equal(n.cr,null);
n.complete();n.update(0,true,false);assert.equal(last.w,400);now+=6000;n.update(0,true,false);assert.equal(n.cr,null);
opts.clusterMode='temporary';n.update(6,true,false);now+=6000;n.update(6,true,false);assert.equal(n.cr,null);
opts.clusterMode='bar';n.update(4,true,false);now+=6000;n.update(4,true,false);assert.equal(last.w,400);opts.clusterEnabled=false;n.update(4,true,false);assert.equal(n.cr,null);
opts.clusterEnabled=true;n.test();n.update(0,false,false);assert.equal(n.cr,null);n.test();n.update(0,false,true);assert.equal(last.w,400);
assert.equal(frame('requested',true,false)[(40*80+5)*4+3],179);
console.log('cluster notifications: OK');

for(const state of ['requested','running','completed']) for(const test of [false,true]) {
 const p=frame(state,false,test); let lo=400,hi=-1;
 for(let y=0;y<90;y++) for(let x=0;x<400;x++){const i=(y*400+x)*4;if(Math.max(p[i],p[i+1],p[i+2])>90){lo=Math.min(lo,x);hi=Math.max(hi,x);}}
 assert(hi>lo);assert(Math.abs(lo-(399-hi))<=5, state+' margins '+lo+'/'+(399-hi));
}
console.log('overlay alignment: OK');
