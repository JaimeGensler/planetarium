import * as THREE from 'three';

type FrameListener = (delta: number) => void;

export default class Game {
	private readonly __sizes = {
		height: window.innerHeight,
		width: window.innerWidth,
	};

	public readonly scene: THREE.Scene;
	public readonly renderer: THREE.WebGLRenderer;
	public readonly camera: THREE.PerspectiveCamera;

	private __frameListeners: FrameListener[] = [];
	private __previousTime: number = 0;

	public constructor() {
		const canvas = document.getElementById('webgl');
		if (!(canvas instanceof HTMLCanvasElement)) {
			throw new Error('Could not find HTML Canvas Element with id "webgl"');
		}
		this.renderer = new THREE.WebGLRenderer({ canvas });
		this.renderer.setSize(this.__sizes.width, this.__sizes.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		window.addEventListener('resize', this.__handleResize.bind(this));

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(
			75,
			this.__sizes.width / this.__sizes.height,
			0.1,
			100,
		);
		this.addStaticToScene(this.camera);
	}

	public start() {
		this.__tick(0);
	}
	public addFrameListener(l: FrameListener) {
		this.__frameListeners.push(l);
	}
	public addStaticToScene(...objects: THREE.Object3D[]) {
		this.scene.add(...objects);
	}
	public addDynamicToScene(...objects: THREE.Object3D[]) {
		objects.forEach(object => {
			if ('update' in object && typeof object['update'] === 'function') {
				//@ts-ignore: It's been checked lol
				this.addFrameListener(object.update.bind(object));
				this.addStaticToScene(object);
			}
		});
	}

	// ====== Private API =====
	private __tick(frameTime: number) {
		const delta = (frameTime - this.__previousTime) / 1000;
		this.__previousTime = frameTime;

		this.__frameListeners.forEach(l => l(delta));
		this.renderer.render(this.scene, this.camera);
		window.requestAnimationFrame(this.__tick.bind(this));
	}
	private __handleResize() {
		this.__sizes.height = window.innerHeight;
		this.__sizes.width = window.innerWidth;

		this.camera.aspect = this.__sizes.width / this.__sizes.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.__sizes.width, this.__sizes.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	}
}
