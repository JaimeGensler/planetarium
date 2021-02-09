import * as THREE from 'three';

type FrameListener = (delta: number) => void;
type Listener = () => void;

export default class Engine {
	public static fixedUpdateInterval = 0.02;

	public readonly scene: THREE.Scene;
	public readonly renderer: THREE.WebGLRenderer;
	public readonly camera: THREE.PerspectiveCamera;

	private readonly __loadingManager = new THREE.LoadingManager();
	private readonly __textureLoader = new THREE.TextureLoader(
		this.__loadingManager,
	);
	private readonly __sizes = {
		height: window.innerHeight,
		width: window.innerWidth,
	};
	private __frameListeners: FrameListener[] = [];
	private __fixedListeners: Listener[] = [];
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
		this.scene.add(this.camera);
		this.__setupLoadingManager();
		this.__tick = this.__tick.bind(this);
	}

	public start() {
		this.__tick(0);
		this.__startFixedUpdates();
	}
	public addToScene(...objects: THREE.Object3D[]) {
		objects.forEach(object => {
			let mayUpdate = false;
			if ('update' in object && typeof object['update'] === 'function') {
				mayUpdate = true;
				//@ts-ignore: Checked
				this.__frameListeners.push(object.update.bind(object));
			}
			if (
				'fixedUpdate' in object &&
				typeof object['fixedUpdate'] === 'function'
			) {
				mayUpdate = true;
				//@ts-ignore: Checked
				this.__fixedListeners.push(object.fixedUpdate.bind(object));
			}
			if (!mayUpdate && object.matrixAutoUpdate) {
				object.matrixAutoUpdate = false;
				console.warn('Engine disabled "matrixAutoUpdate" on', object);
			}
			console.log('about to add to scene');
			this.scene.add(object);
		});
	}
	public addFrameListener(l: Listener) {
		this.__frameListeners.push(l);
	}
	public loadTextures(...files: string[]) {
		if (files.length === 0) {
			throw new Error('Must provide at least one file to load!');
		}
		return files.map(file => this.__textureLoader.load(file));
	}

	// ====== Private API =====
	private __tick(frameTime: number) {
		const delta = (frameTime - this.__previousTime) / 1000;
		this.__previousTime = frameTime;

		this.__frameListeners.forEach(l => l(delta));
		this.renderer.render(this.scene, this.camera);
		window.requestAnimationFrame(this.__tick);
	}
	private __handleResize() {
		this.__sizes.height = window.innerHeight;
		this.__sizes.width = window.innerWidth;

		this.camera.aspect = this.__sizes.width / this.__sizes.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.__sizes.width, this.__sizes.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	}
	private __setupLoadingManager() {
		this.__loadingManager.onLoad = () => {
			console.log('LOAD_MANAGER: All assets finished loading.');
		};
		this.__loadingManager.onError = url => {
			console.error(`LOAD_MANAGER: Could not load "${url}"`);
		};
	}
	private __startFixedUpdates() {
		const interval = Engine.fixedUpdateInterval * 1000;
		setInterval(() => {
			this.__fixedListeners.forEach(l => l());
		}, interval);
	}
}
