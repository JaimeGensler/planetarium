import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Engine from './utils/AltEngine';
import Galaxy from './Components/Galaxy';
import Stars from './Components/Stars';
import CelestialBody from './Components/CelestialBody';

const engine = new Engine();
engine.camera.position.set(1, 1.5, 4);

const controls = new OrbitControls(engine.camera, engine.renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 1.5;
controls.maxDistance = 12;
engine.addFrameListener(controls.update);

const [galaxyStar, bgStar] = engine.loadTextures(
	'/textures/particles/1.png',
	'/textures/particles/8.png',
);

const stars = new Stars({ starTexture: bgStar });
engine.addToScene(stars);

// GALAXY
const galaxy = new Galaxy({ starTexture: galaxyStar });
engine.addToScene(galaxy);

// SOLAR SYSTEM
// const p1 = new CelestialBody();
// const p2 = new CelestialBody();
// engine.addToScene(p1, p2);

engine.start();
