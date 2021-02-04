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

const [galaxyStar, bgStar] = engine.loadTextures(
	'/textures/particles/1.png',
	'/textures/particles/8.png',
);

const galaxy = new Galaxy({ starTexture: galaxyStar });
engine.addDynamicToScene(galaxy);

const stars = new Stars({ starTexture: bgStar });
engine.addStaticToScene(stars);

engine.start();
