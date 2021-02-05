import * as THREE from 'three';
import Random from './utils/Random';

type StarsParameters = { starTexture: THREE.Texture } & typeof Stars.DEFAULTS;
export default class Stars extends THREE.Points {
	public starCount: number;
	public radiusMin: number;
	public radiusMax: number;
	public starSize: number;
	public constructor(settings?: Partial<StarsParameters>) {
		const starTexture = settings?.starTexture;
		const starCount = settings?.starCount ?? Stars.DEFAULTS.starCount;
		const starSize = settings?.starSize ?? Stars.DEFAULTS.starSize;

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
		this.radiusMin = settings?.radiusMin ?? Stars.DEFAULTS.radiusMin;
		this.radiusMax = settings?.radiusMax ?? Stars.DEFAULTS.radiusMax;
		this.__create();
	}
	private __create() {
		const positionHelper = new THREE.Vector3();
		const positions = this.geometry.attributes.position.array as Float32Array;
		const colors = this.geometry.attributes.color.array as Float32Array;
		for (let i = 0; i < this.starCount; i++) {
			positionHelper
				.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
				.normalize()
				.multiplyScalar(Random.floatBetween(this.radiusMin, this.radiusMax));
			const { x, y, z } = positionHelper;

			const i3 = i * 3;
			positions[i3] = x;
			positions[i3 + 1] = y;
			positions[i3 + 2] = z;

			colors[i3] = Random.curve(1 / 5);
			colors[i3 + 1] = 0.85;
			colors[i3 + 2] = Random.curve(1 / 5);
		}
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
		starCount: 3_000,
		radiusMin: 20,
		radiusMax: 40,
		starSize: 0.33,
	};
}
