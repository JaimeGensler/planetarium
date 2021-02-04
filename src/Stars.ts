import * as THREE from 'three';
import Random from './Utils/Random';

const starCount = 3_000;
const radiusMin = 22;
const radiusMax = 32;
const starSize = 0.33;

const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('/textures/particles/8.png');

export default class Stars extends THREE.Points {
	public constructor() {
		const positionHelper = new THREE.Vector3();

		const positions = new Float32Array(starCount * 3);
		for (let i = 0; i < starCount; i++) {
			positionHelper
				.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
				.normalize()
				.multiplyScalar(Random.between(radiusMin, radiusMax));
			const { x, y, z } = positionHelper;

			const i3 = i * 3;
			positions[i3] = x;
			positions[i3 + 1] = y;
			positions[i3 + 2] = z;
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const material = new THREE.PointsMaterial({
			size: starSize,
			sizeAttenuation: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			alphaMap: starTexture,
			transparent: true,
		});
		super(geometry, material);
	}

	public dispose() {
		this.geometry.dispose();
		if (Array.isArray(this.material)) {
			this.material.forEach(mat => mat.dispose());
		} else {
			this.material.dispose();
		}
	}
}
