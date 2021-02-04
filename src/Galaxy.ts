import * as THREE from 'three';
import Angle from './Utils/Angle';
import Random from './Utils/Random';

export interface GalaxyParameters {
	starCount: number;
	particleSize: number;
	radius: number;
	branches: number;
	spin: number;
	distribution: number;
	innerColor: number;
	outerColor: number;
}
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('/textures/particles/1.png');

export default class Galaxy extends THREE.Points {
	public spinSpeed: number;
	public constructor(settings?: Partial<GalaxyParameters>) {
		const {
			starCount,
			particleSize,
			radius,
			branches,
			spin,
			distribution,
			innerColor,
			outerColor,
		} = {
			...DEFAULTS,
			...settings,
		};
		const insideColor = new THREE.Color(innerColor);
		const outsideColor = new THREE.Color(outerColor);

		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			const i3 = i * 3;

			const rad = Math.random() * radius;
			const spinAngle = rad * spin;
			const branchAngle = Angle.fragmentToRadians((i % branches) / branches);

			const offsetX = Random.sign(Random.curve(distribution));
			const offsetY = Random.sign(Random.curve(distribution) / 6);
			const offsetZ = Random.sign(Random.curve(distribution));
			positions[i3] = Math.cos(branchAngle + spinAngle) * rad + offsetX;
			positions[i3 + 1] = offsetY;
			positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * rad + offsetZ;

			const mixedColor = insideColor.clone();
			mixedColor.lerp(outsideColor, rad / radius);
			colors[i3] = mixedColor.r;
			colors[i3 + 1] = mixedColor.g;
			colors[i3 + 2] = mixedColor.b;
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: particleSize,
			sizeAttenuation: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			vertexColors: true,
			alphaMap: starTexture,
			transparent: true,
		});
		super(geometry, material);

		this.spinSpeed = 0.025;
	}
	public update(delta: number) {
		this.rotation.y += this.spinSpeed * delta;
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

const DEFAULTS: GalaxyParameters = {
	starCount: 100_000,
	particleSize: 0.02,
	radius: 5,
	branches: 5,
	spin: 0.8,
	distribution: 3,
	innerColor: 0xff6030,
	outerColor: 0x1b3984,
};
