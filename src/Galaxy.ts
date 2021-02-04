import * as THREE from 'three';
import Angle from './utils/Angle';
import Random from './utils/Random';

const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('/textures/particles/1.png');

export default class Galaxy extends THREE.Points {
	public spinSpeed: number;
	public starCount: number;
	public radius: number;
	public branchCount: number;
	public spinAmount: number;
	public distribution: number;
	public innerColor: THREE.Color;
	public outercolor: THREE.Color;

	public constructor(settings?: Partial<GalaxyParameters>) {
		const {
			starCount,
			particleSize,
			radius,
			branchCount,
			spinAmount,
			distribution,
			innerColor: insideColor,
			outerColor: outsideColor,
		} = {
			...Galaxy.DEFAULTS,
			...settings,
		};
		const innerColor = new THREE.Color(insideColor);
		const outerColor = new THREE.Color(outsideColor);

		const positions = new Float32Array(starCount * 3);
		const colors = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			const i3 = i * 3;

			const pointRadius = Math.random() * radius;
			const spinAngle = pointRadius * spinAmount;
			const branchAngle = Angle.fragmentToRadians(
				(i % branchCount) / branchCount,
			);

			const offsetX = Random.sign(Random.curve(distribution));
			const offsetY = Random.sign(Random.curve(distribution) / 6);
			const offsetZ = Random.sign(Random.curve(distribution));
			positions[i3] = Math.cos(branchAngle + spinAngle) * pointRadius + offsetX;
			positions[i3 + 1] = offsetY;
			positions[i3 + 2] =
				Math.sin(branchAngle + spinAngle) * pointRadius + offsetZ;

			const mixedColor = innerColor.clone();
			mixedColor.lerp(outerColor, pointRadius / radius);

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

		this.starCount = starCount;
		this.radius = radius;
		this.branchCount = branchCount;
		this.spinAmount = spinAmount;
		this.distribution = distribution;
		this.innerColor = innerColor;
		this.outercolor = outerColor;
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

	public static readonly DEFAULTS = {
		starCount: 100_000,
		particleSize: 0.02,
		radius: 5,
		branchCount: 5,
		spinAmount: 0.8,
		distribution: 3,
		innerColor: new THREE.Color(0xff6030),
		outerColor: new THREE.Color(0x1b3984),
		spinSpeed: 0.025,
	};
}

export interface GalaxyParameters {
	starCount: number;
	particleSize: number;
	radius: number;
	branchCount: number;
	spinAmount: number;
	distribution: number;
	innerColor: number;
	outerColor: number;
}
