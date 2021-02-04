import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Engine from './utils/Engine';
import Galaxy from './Galaxy';
import Stars from './Stars';

const engine = new Engine();
engine.camera.position.set(1, 1.5, 4);

const controls = new OrbitControls(engine.camera, engine.renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0.75;
controls.maxDistance = 12;
engine.addFrameListener(controls.update);

const galaxy = new Galaxy();
engine.addDynamicToScene(galaxy);

const stars = new Stars();
engine.addStaticToScene(stars);

engine.start();
