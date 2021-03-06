import React, {Component} from 'react'
import * as THREE from 'three'
import OrbitControlsLib from 'three-orbit-controls'
import './Demo.css'
import throttle from 'lodash/throttle'
import socketIOClient from "socket.io-client"

const OrbitControls = OrbitControlsLib(THREE);

export default class Demo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dx: 0,
            dy: 0,
            dz: 0
        };
        this.socket = false;
        this.resizeWindow = throttle(this.resizeWindow, 300);
    }

    componentDidMount() {
        this.socket = socketIOClient('/');

        this.socket.on("welcome", data => {
            console.log('socket.on(welcome)', data)
        });

        this.socket.on('update-delta', delta => {
            this.setState(delta);
        });

        this.socket.on('update-camera', camera => {
            this.camera.position.set(camera.position.x, camera.position.y, camera.position.z);
            this.camera.lookAt(camera.direction.x, camera.direction.y, camera.direction.z);
            this.camera.updateProjectionMatrix();
        });

        let width = this.container.clientWidth,
            height = this.container.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        let orbit = new OrbitControls(this.camera, this.renderer.domElement);
        orbit.enableZoom = false;
        orbit.enableKeys = false;
        orbit.addEventListener('change', throttle(() => {
            console.log('orbit.eventListener(change)', this.camera);
            this.socket.emit('update-camera', {
                position: this.camera.position,
                direction: this.camera.getWorldDirection()
            })
        }, 300), false);

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
        window.addEventListener("resize", this.resizeWindow);
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
        this.cube.rotation.x += this.state.dx;
        this.cube.rotation.y += this.state.dy;
        this.cube.rotation.z += this.state.dz;

        this.renderScene();
        this.frameId = requestAnimationFrame(this.animate);
    };

    updateDelta = ({target}) => {
        this.setState({
            [target.name]: parseFloat(target.value)
        });
        this.socket.emit('update-delta', {
            [target.name]: parseFloat(target.value)
        })
    };

    renderScene = () => {
        this.renderer.render(this.scene, this.camera);
    };

    resizeWindow = () => {
        let width = this.container.clientWidth,
            height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        console.log('resizeWindow()');
    };

    componentWillUnmount() {
        this.stop();
        this.container.removeChild(this.renderer.domElement);
        window.removeEventListener("resize", this.resizeWindow);
        ['welcome', 'update-delta', 'update-camera'].forEach(name => {
            this.socket.removeListener(name);
        })
    }

    render() {
        return (
            <div className='threejs-app'>
                <div className='scene' ref={container => this.container = container}/>
                <div className='panel'>
                    <input name='dx' type="range" min="-0.03" max="0.03" step={0.01} value={this.state.dx} onChange={this.updateDelta} />
                    <input name='dy' type="range" min="-0.03" max="0.03" step={0.01} value={this.state.dy} onChange={this.updateDelta} />
                    <input name='dz' type="range" min="-0.03" max="0.03" step={0.01} value={this.state.dz} onChange={this.updateDelta} />
                </div>
            </div>
        )
    }
}