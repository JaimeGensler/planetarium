import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Game from './Utils/Game';
import Galaxy from './Galaxy';
import Stars from './Stars';

const game = new Game();
game.camera.position.set(1, 1.5, 4);

const controls = new OrbitControls(game.camera, game.renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0.75;
controls.maxDistance = 12;
game.addFrameListener(controls.update);

const galaxy = new Galaxy();
game.addDynamicToScene(galaxy);

const stars = new Stars();
game.addStaticToScene(stars);

game.start();
