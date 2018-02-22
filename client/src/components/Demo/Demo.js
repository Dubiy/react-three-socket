import React, {Component} from 'react'
import * as THREE from 'three'
import OrbitControlsLib from 'three-orbit-controls'
import './Demo.css'

const OrbitControls = OrbitControlsLib(THREE);

export default class Demo extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let width = this.container.clientWidth,
            height = this.container.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        let orbit = new OrbitControls(this.camera, this.renderer.domElement);
        orbit.enableZoom = false;
        orbit.enableKeys = false;

        let geometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
        let material = new THREE.MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: true
        });
        let cube = new THREE.Mesh(geometry, material);

        let lights = [
            new THREE.PointLight( 0xffffff, 1, 0 ),
            new THREE.PointLight( 0xffffff, 1, 0 ),
            new THREE.PointLight( 0xffffff, 1, 0 )
        ];

        lights[ 0 ].position.set( 0, 200, 0 );
        lights[ 1 ].position.set( 100, 200, 100 );
        lights[ 2 ].position.set( - 100, - 200, - 100 );

        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);

        this.camera.position.z = 4;
        this.scene.add(cube);
        this.renderer.setClearColor(0x000000);
        this.renderer.setSize(width, height);

        this.cube = cube;

        this.container.appendChild(this.renderer.domElement);
        this.start();
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    };

    stop = () => {
        cancelAnimationFrame(this.animate);
    };

    animate = () => {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.02;

        this.renderScene();
        this.frameId = requestAnimationFrame(this.animate);
    };

    renderScene = () => {
        this.renderer.render(this.scene, this.camera);
    };

    componentWillUnmount() {
        this.stop();
        this.container.removeChild(this.renderer.domElement);
    }

    render() {
        return (
            <div className='threejs-app'>
                <div className='scene' ref={container => this.container = container}/>
            </div>
        )
    }
}