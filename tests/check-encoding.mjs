import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const bytes=await readFile(new URL('../dist/assets/encoding-features.js',import.meta.url));
const {usesNvenc,encoderArguments,planSamples,sampleOptions,estimateFromSamples}=await import('data:text/javascript;base64,'+bytes.toString('base64'));
const cpu={formats:['mp4'],encoder:'cpu',crfFraction:.42,speed:'veryfast'};
const gpu={...cpu,encoder:'nvenc'};
assert.equal(usesNvenc(cpu),false);assert.equal(usesNvenc(gpu),true);
assert(encoderArguments(cpu).includes('libx264'));assert(!encoderArguments(cpu).includes('h264_nvenc'));
assert(encoderArguments(gpu).includes('h264_nvenc'));assert(encoderArguments(gpu).includes('-cq'));
const webm={...gpu,formats:['webm']};assert.equal(usesNvenc(webm),false);assert(encoderArguments(webm).includes('libvpx-vp9'));assert(!encoderArguments(webm).includes('-preset'));
let p=planSamples(100,20,80);assert.equal(p.length,60);assert.equal(p.samples.length,3);
for(const sample of p.samples){assert(sample.start>=20);assert(sample.start+sample.duration<=80);assert(sample.duration<=3)}
p=planSamples(2);assert.equal(p.samples.length,1);assert.equal(p.samples[0].duration,2);
assert.throws(()=>planSamples(0));assert.throws(()=>planSamples(10,8,5));
const args=['-i','input.mp4',...encoderArguments(cpu),'-an','-movflags','+faststart','-progress','-','-y','output.mp4'];
const sampled=sampleOptions(args);assert(!sampled.includes('input.mp4'));assert(!sampled.includes('output.mp4'));assert(!sampled.includes('-y'));assert(!sampled.includes('-progress'));assert(sampled.includes('libx264'));
assert.equal(estimateFromSamples([{bytes:1000,duration:2},{bytes:2000,duration:2}],20),15000);
assert.throws(()=>estimateFromSamples([],20));
const bundle=await readFile(new URL('../dist/assets/index-v7a3H2y7.js',import.meta.url),'utf8');
const start=bundle.indexOf('OY=({inputFilePath:');const end=bundle.indexOf(',\nnvencProbe=',start);
assert(start>0 && end>start);
const actualBuilder=vm.runInNewContext('('+bundle.slice(start+3,end)+')',{encoderArguments,TY:()=>[]});
const actualCpu=actualBuilder({inputFilePath:'test.mp4',outputPath:'result.mp4',config:cpu,watermarkPath:null});
const actualGpu=actualBuilder({inputFilePath:'test.mp4',outputPath:'result.mp4',config:gpu,watermarkPath:null});
assert(actualCpu.includes('libx264'));assert(actualGpu.includes('h264_nvenc'));
assert(sampleOptions(actualCpu).includes('libx264'));assert(!sampleOptions(actualGpu).includes('-y'));
assert(bundle.includes('if(usesNvenc(o))await ensureNvenc()'));
assert(bundle.includes('state.isEstimating'));
const probeStart=bundle.indexOf('nvencProbe={promise:null}');
const probeEnd=bundle.indexOf(',jY=(e,t,n)=>',probeStart);
assert(probeStart>0 && probeEnd>probeStart);
let attempts=0, succeeds=false;
const rc={sidecar:()=>({execute:async()=>{attempts++;return succeeds?{code:0,stderr:''}:{code:1,stderr:'No NVIDIA GPU'}}})};
const probe=vm.runInNewContext('(()=>{let '+bundle.slice(probeStart,probeEnd)+';return ensureNvenc})()', {rc,translateText:x=>x,console:{warn:()=>{}}});
await assert.rejects(probe(),/NVIDIA NVENC/);assert.equal(attempts,1);
succeeds=true;await probe();assert.equal(attempts,2);
await probe();assert.equal(attempts,2);
const gpuUiStart=bundle.indexOf('function EncoderSettings(){');
const gpuUiEnd=bundle.indexOf('function EstimatePanel(',gpuUiStart);
assert(gpuUiStart>0 && gpuUiEnd>gpuUiStart);
let settingState={files:[],isEstimating:false,config:{...cpu}},uiState=[],uiIndex=0,allowGpu=false;
const settingStore=selector=>selector(settingState);settingStore.getState=()=>settingState;
const reactSettings={useState:value=>{const index=uiIndex++;uiState[index]=value;return [value,next=>{uiState[index]=next}]}};
const elementFactory=(type,props)=>({type,...props});
const settingsComponent=vm.runInNewContext('('+bundle.slice(gpuUiStart,gpuUiEnd).trim()+')',{
  _:reactSettings, Ke:settingStore, Vn:()=>({optimizeConfig:settingState.config,setOptimizeConfig:value=>{settingState.config=value}}),
  ensureNvenc:async()=>{if(!allowGpu)throw new Error('NVIDIA NVENC unavailable')},
  x:{jsx:elementFactory,jsxs:elementFactory}
});
let settingUi=settingsComponent();
await settingUi.children[2].children[1].onClick();
assert.equal(settingState.config.encoder,'cpu');assert.match(uiState[1],/NVIDIA NVENC/);
uiIndex=0;allowGpu=true;settingUi=settingsComponent();
await settingUi.children[2].children[1].onClick();assert.equal(settingState.config.encoder,'nvenc');
const panelStart=bundle.indexOf('function EstimatePanel({file,config})');
const panelEnd=bundle.indexOf('function wBe(){',panelStart);
assert(panelStart>0 && panelEnd>panelStart);
let slot=0, states=[], samplesCalled=0;
const ReactMock={useState:value=>{const index=slot++;states[index]=value;return [value,next=>{states[index]=next}]},useRef:value=>({current:value}),useEffect:()=>{}};
const file={path:'C:/video.mp4',status:'ready'},store={files:[file],isEstimating:false};
store.setIsEstimating=value=>{store.isEstimating=value};
const useStore=selector=>selector(store);useStore.getState=()=>store;
const makeElement=(type,props)=>({type,...props});
const panel=vm.runInNewContext('('+bundle.slice(panelStart,panelEnd).trim()+')',{
  _:ReactMock, Ke:useStore,yi:cpu,usesNvenc,ensureNvenc:async()=>true,EY:async()=>30,
  planSamples,sampleOptions,estimateFromSamples,OY:actualBuilder,Intl,console,
  G:async(command,params)=>{assert.equal(command,'estimate_sample');assert.equal(params.inputPath,file.path);assert(params.outputOptions.includes('libx264'));assert(!params.outputOptions.includes('-y'));samplesCalled++;return 10000},
  x:{jsx:makeElement,jsxs:makeElement}
});
const rendered=panel({file,config:cpu});
await rendered.children[0].onClick({stopPropagation(){}});
assert.equal(samplesCalled,3);assert.equal(states[1],100000);assert.equal(store.isEstimating,false);
console.log('Кодировщики, реальные аргументы приложения, фрагменты и оценка размера проверены.');
