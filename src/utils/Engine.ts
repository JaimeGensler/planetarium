import * as THREE from 'three';

type FrameListener = (delta: number) => void;

export default class Engine {
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
		this.addDynamicToScene(this.camera);
		this.__setupLoadingManager();
	}

	public start() {
		this.__tick(0);
	}
	public addFrameListener(l: FrameListener) {
		this.__frameListeners.push(l);
	}
	public addStaticToScene(...objects: THREE.Object3D[]) {
		objects.forEach(object => {
			if (object.matrixAutoUpdate) {
				console.warn(
					'An object passed to Engine.addStaticToScene did not have matrixAutoUpdate disabled. Engine disabled autoupdate. Object:',
					object,
				);
				object.matrixAutoUpdate = false;
			}
			this.__addObjectToScene(object);
		});
	}
	public addDynamicToScene(...objects: THREE.Object3D[]) {
		objects.forEach(object => {
			if ('update' in object && typeof object['update'] === 'function') {
				//@ts-ignore: It's been verified that this object has an update function
				this.addFrameListener(object.update.bind(object));
			}
			this.__addObjectToScene(object);
		});
	}
	public loadTextures(...files: string[]) {
		if (files.length === 0) {
			throw new Error('Must provide at least one file to load!');
		}
		return files.map(file => this.__textureLoader.load(file));
	}

	// ====== Private API =====
	private __addObjectToScene(...objects: THREE.Object3D[]) {
		this.scene.add(...objects);
	}
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
	private __setupLoadingManager() {
		this.__loadingManager.onLoad = () => {
			console.log('LOAD_MANAGER: All assets finished loading.');
		};
		this.__loadingManager.onError = url => {
			console.error(`LOAD_MANAGER: Could not load "${url}"`);
		};
	}
}
