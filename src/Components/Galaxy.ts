import * as THREE from 'three';
import Angle from '../utils/Angle';
import Random from '../utils/Random';

type GalaxyParameters = Partial<
	{ starTexture: THREE.Texture } & typeof Galaxy.DEFAULTS
>;
export default class Galaxy extends THREE.Points {
	public spinSpeed: number;
	public starCount: number;
	public starSize: number;
	public radius: number;
	public branchCount: number;
	public spinAmount: number;
	public distribution: number;
	public innerColor: THREE.Color;
	public outerColor: THREE.Color;

	public constructor(settings?: GalaxyParameters) {
		const starCount = settings?.starCount ?? Galaxy.DEFAULTS.starCount;
		const starSize = settings?.starSize ?? Galaxy.DEFAULTS.starSize;
		const starTexture = settings?.starTexture;

		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(starCount * 3);
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		const colors = new Float32Array(starCount * 3);
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: starSize,
			sizeAttenuation: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			vertexColors: true,

			alphaMap: starTexture,
			transparent: !!starTexture,
		});

		super(geometry, material);

		this.starCount = starCount;
		this.starSize = starSize;
		this.radius = settings?.radius ?? Galaxy.DEFAULTS.radius;
		this.branchCount = settings?.branchCount ?? Galaxy.DEFAULTS.branchCount;
		this.spinAmount = settings?.spinAmount ?? Galaxy.DEFAULTS.spinAmount;
		this.distribution = settings?.distribution ?? Galaxy.DEFAULTS.distribution;
		this.innerColor = settings?.innerColor ?? Galaxy.DEFAULTS.innerColor;
		this.outerColor = settings?.outerColor ?? Galaxy.DEFAULTS.outerColor;
		this.spinSpeed = settings?.spinSpeed ?? Galaxy.DEFAULTS.spinSpeed;

		this.__create();
	}

	private __create() {
		// This method may cause issues if called after the first render.
		// (At the moment, it's being called before the first frame.)
		// In particular, vertexColors may need some help in that scenario.
		// https://threejs.org/docs/#manual/en/introduction/How-to-update-things
		const positions = this.geometry.attributes.position.array as Float32Array;
		const colors = this.geometry.attributes.color.array as Float32Array;

		for (let i = 0; i < this.starCount; i++) {
			const i3 = i * 3;

			const pointRadius = Math.random() * this.radius;
			const spinAngle = pointRadius * this.spinAmount;
			const branchAngle = Angle.fragmentToRadians(
				(i % this.branchCount) / this.branchCount,
			);

			const offsetX = Random.sign(Random.curve(this.distribution));
			const offsetY = Random.sign(Random.curve(this.distribution) / 6);
			const offsetZ = Random.sign(Random.curve(this.distribution));

			positions[i3] = Math.cos(branchAngle + spinAngle) * pointRadius + offsetX;
			positions[i3 + 1] = offsetY;
			positions[i3 + 2] =
				Math.sin(branchAngle + spinAngle) * pointRadius + offsetZ;

			const mixedColor = this.innerColor.clone();
			mixedColor.lerp(this.outerColor, pointRadius / this.radius);

			colors[i3] = mixedColor.r;
			colors[i3 + 1] = mixedColor.g;
			colors[i3 + 2] = mixedColor.b;
		}
		this.updateMatrix();
	}

	public fixedUpdate() {
		this.rotation.y += this.spinSpeed * 0.02;
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
		starSize: 0.02,
		radius: 5,
		branchCount: 5,
		spinAmount: 0.8,
		distribution: 2.5,
		innerColor: new THREE.Color(0xff6030),
		outerColor: new THREE.Color(0x1b3984),
		spinSpeed: 0.025,
	};
}
