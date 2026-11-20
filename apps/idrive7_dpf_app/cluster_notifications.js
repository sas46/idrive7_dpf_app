'use strict';
const fs = require('fs');
const { Canvas } = require('./kit/canvas');
const { ClusterRender, DEFAULT_PATH } = require('./cluster_render_client');
const colors = { requested:'#ffbc42', running:'#49d8ef', completed:'#57ce82' };
const labels = { requested:'Regeneration requested', running:'Regeneration in progress', completed:'Regeneration completed' };
const Z = 10000; // high requested priority, renderer/car arbitration still applies
function frame(state, compact, test) {
    const w = compact ? 80 : 400, h = compact ? 80 : 90;
    const cv = new Canvas(w,h).clear();
    cv.roundRect(0,0,w,h,12,[0,0,0,179]);
    const c = colors[state], x = compact ? 15 : 20, y = compact ? 25 : 30;
    const pts = [[0,8],[8,8],[8,0],[42,0],[42,8],[50,8],[50,25],[42,25],[42,33],[8,33],[8,25],[0,25],[0,8]];
    cv.polyline(pts.map(p=>[p[0]+x,p[1]+y]),2,c);
    if(state === 'completed') cv.polyline([[x+15,y+16],[x+23,y+24],[x+36,y+10]],3,c);
    else for(const a of [15,25,35]) for(const b of [8,16,24]) cv.circle(x+a,y+b,1.7,c);
    if(state === 'requested') {
        cv.circle(x+43,y+30,12,'#101010'); cv.arc(x+43,y+30,9,11,0,360,c);
        cv.polyline([[x+43,y+23],[x+43,y+30],[x+48,y+33]],2,c);
    } else if(state === 'running') for(const a of [15,25,35]) cv.polyline([[x+a,y-4],[x+a-3,y-8],[x+a,y-13]],2,c);
    if(!compact) {
        const opts = {literal:true}; let size=26;
        while(cv.textWidth(labels[state],size,opts)>302 && size>12) size--;
        cv.text(labels[state],88,test?44:54,size,c,opts);
        if(test) cv.text('TEST',88,69,18,'#ffffff',opts);
    }
    return Buffer.from(cv.d);
}
class Notifications {
    constructor(settings,log,clock, factory) {
        this.s=settings; this.log=log; this.now=clock; this.factory=factory||(()=>new ClusterRender('sas46_dpf_monitor'));
        this.state=null; this.since=0; this.doneUntil=0; this.testUntil=0; this.ref=0; this.key=''; this.cr=null;
    }
    status() { return this.cr && this.cr.ready ? 'Connected' : fs.existsSync(DEFAULT_PATH) ? 'Not connected' : 'Renderer socket unavailable'; }
    close() { if(this.cr) this.cr.close(); this.cr=null; this.ref=0; this.key=''; }
    duration() { return (Number(this.s.get('clusterDuration'))||5)*1000; }
    complete() { if(this.s.get('clusterEnabled') && this.s.get('clusterCompleted')) this.doneUntil=this.now()+this.duration(); }
    test() { this.testUntil=this.now()+this.duration(); }
    update(raw, fresh, stationary) {
        const now=this.now();
        if(!this.s.get('clusterEnabled')) { this.close(); this.state=null; this.doneUntil=0; this.testUntil=0; return; }
        const state=fresh && raw===6?'requested':fresh && raw===4?'running':null;
        if(state!==this.state) { this.state=state; this.since=now; }
        if(!fresh || state) this.doneUntil=0;
        if(!stationary) this.testUntil=0;
        const test=this.testUntil>now;
        let show=test?'requested':state || (this.doneUntil>now?'completed':null);
        if(!test && show && !this.s.get('cluster'+show[0].toUpperCase()+show.slice(1))) show=null;
        const mode=this.s.get('clusterMode');
        const elapsed=now-this.since>=this.duration();
        if(!test && state && mode==='temporary' && elapsed) show=null;
        const compact=!!(!test && state && show && mode==='icon' && elapsed);
        if(!show) { this.close(); return; }
        if(!this.cr) { this.cr=this.factory(); this.cr.on('layer',(ref,state,reason)=>{if(state==='error') this.log.warn('cluster: '+reason);}); this.cr.connect(); }
        const key=show+':'+compact+':'+test;
        if(key===this.key) return;
        if(this.ref) this.cr.drop(this.ref);
        const w=compact?80:400,h=compact?80:90;
        this.ref=this.cr.image({target:'panel',klass:'overlay',z:Z,exclusive:false,x:(1920-w)/2,y:520+(90-h)/2,w,h,iw:w,ih:h,visible:true});
        if(this.ref && this.cr.pixels(this.ref,null,frame(show,compact,test))) this.key=key;
    }
}
module.exports={Notifications,frame,Z};
