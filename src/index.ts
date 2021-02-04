import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Game from './Utils/Game';
import Galaxy from './Galaxy';

const game = new Game();
game.camera.position.set(1, 1.5, 4);

const controls = new OrbitControls(game.camera, game.renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 0.75;
controls.maxDistance = 12;

game.addFrameListener(controls.update);
game.addDynamicToScene(new Galaxy());

game.start();
