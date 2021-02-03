import * as THREE from 'three';
import Game from './Utils/Game';

const game = new Game();

const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
game.addToScene(cube);
game.camera.position.z = 4;
game.start();
