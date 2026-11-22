// tiny-stack-vm-01: port of subject/vm.mjs + MAKEFUN driver.
import{readdirSync as R,readFileSync as F,writeFileSync as W,mkdirSync as K}from'node:fs';
const A=[0,2,1],T={0:[0,0,0],1:[1,0,1],2:[4,0,1],3:[0,1,0],4:[0,1,2],5:[0,2,2],6:[0,2,3],7:[0,3,3],23:[0,1,1],27:[0,1,1],48:[2,0,0],49:[2,1,0],50:[2,1,0],51:[2,0,0],52:[0,0,0],64:[0,1,1],65:[0,2,0],80:[0,1,0],81:[0,1,0],82:[0,0,1],83:[0,1,0]};
for(const x of[16,17,18,19,20,21,22,24,25,26,28,29,30,32,33,34])T[x]=A;
const E=new TextEncoder;
function run(p,I){
 const d=new Int32Array(256),c=new Int32Array(64),m=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,k=0,l=0,q=0,pc=0,t=0;const n=p.length;
 const Z=x=>({stdout:o.slice(0,l),exit:x});
 for(;;){
  if(t===1e6)return Z(10);
  if(pc<0||pc>=n)return Z(9);
  const v=T[p[pc]];if(!v)return Z(5);
  const im=v[0];if(pc+im>=n)return Z(9);
  t++;const nx=pc+1+im;
  if(s<v[1])return Z(2);
  if(s-v[1]+v[2]>256)return Z(3);
  pc=nx;const op=p[pc-1-im];
  switch(op){
   case 0:return Z(0);
   case 1:d[s++]=(p[nx-1]<<24)>>24;break;
   case 2:d[s++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
   case 3:s--;break;
   case 4:d[s]=d[s-1];s++;break;
   case 5:{const x=d[s-1];d[s-1]=d[s-2];d[s-2]=x;break;}
   case 6:d[s]=d[s-2];s++;break;
   case 7:{const x=d[s-3];d[s-3]=d[s-2];d[s-2]=d[s-1];d[s-1]=x;break;}
   case 23:d[s-1]=-d[s-1]|0;break;
   case 27:d[s-1]=~d[s-1];break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
    const b=d[s-1],a=d[s-2];let r;
    switch(op){
     case 16:r=(a+b)|0;break;
     case 17:r=(a-b)|0;break;
     case 18:r=Math.imul(a,b);break;
     case 19:if(!b)return Z(4);r=a===-2147483648&&b===-1?a:(a/b)|0;break;
     case 20:if(!b)return Z(4);r=b===-1?0:a%b|0;break;
     case 21:if(!b)return Z(4);r=Math.floor((a>>>0)/(b>>>0))|0;break;
     case 22:if(!b)return Z(4);r=(a>>>0)%(b>>>0)|0;break;
     case 24:r=a&b;break;
     case 25:r=a|b;break;
     case 26:r=a^b;break;
     case 28:r=a<<(b&31);break;
     case 29:r=a>>(b&31);break;
     case 30:r=(a>>>(b&31))|0;break;
     case 32:r=a===b?1:0;break;
     case 33:r=a<b?1:0;break;
     case 34:r=a>>>0<b>>>0?1:0;break;
    }
    s-=2;d[s++]=r;break;
   }
   case 48:case 49:case 50:{
    const rel=(p[nx-2]|p[nx-1]<<8)<<16>>16;let tk=1;
    if(op!==48){const x=d[--s];tk=op===49?x===0:x!==0;}
    if(tk)pc=nx+rel;break;
   }
   case 51:if(k===64)return Z(7);c[k++]=nx;pc=p[nx-2]|p[nx-1]<<8;break;
   case 52:if(!k)return Z(8);pc=c[--k];break;
   case 64:{const x=d[s-1];if(x<0||x>=256)return Z(6);d[s-1]=m[x];break;}
   case 65:{const x=d[s-1],y=d[s-2];if(x<0||x>=256)return Z(6);s-=2;m[x]=y;break;}
   case 80:{const z=E.encode(String(d[s-1]));if(l+z.length>65536)return Z(11);s--;o.set(z,l);l+=z.length;break;}
   case 81:if(l+1>65536)return Z(11);o[l++]=d[--s]&255;break;
   case 82:d[s++]=q<I.length?I[q++]:-1;break;
   case 83:return Z(d[--s]&255);
  }
 }
}
const IN=process.env.MAKEFUN_INPUT_DIR,O=process.env.MAKEFUN_OUTPUT_DIR;
K(O,{recursive:!0});
for(const id of R(IN)){
 const dir=IN+'/'+id;let f;try{f=R(dir);}catch{continue;}
 if(!f.includes('program.bin'))continue;
 let I=new Uint8Array(0);try{I=F(dir+'/input.bin');}catch{}
 const r=run(F(dir+'/program.bin'),I);
 K(O+'/'+id,{recursive:!0});W(O+'/'+id+'/stdout.bin',r.stdout);W(O+'/'+id+'/exit.txt',''+r.exit+'\n');
}