import * as THREE from 'three';

const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

export default class CelestialBody extends THREE.Mesh {
	public constructor() {
		super(geometry, material);
		this.position.x = 2;
	}
	public update(delta: number) {}
	public fixedUpdate() {}

	// Bodies
	private static __register() {}
	private static __registry = [];
}
