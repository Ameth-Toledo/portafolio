import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import {
    Clock, PerspectiveCamera, Scene, WebGLRenderer, SRGBColorSpace, MathUtils,
    Vector2, Vector3, MeshPhysicalMaterial, Color, Object3D, InstancedMesh,
    PMREMGenerator, SphereGeometry, AmbientLight, PointLight, ACESFilmicToneMapping,
    Raycaster, Plane,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon, Target } from 'lucide-react';
import { cn } from "@/lib/utils";
import { BlurText } from "@/components/ui/portfolio-hero";

interface RgbColor { r: number; g: number; b: number }

const parseRgbColor = (s: string | null | undefined): RgbColor | null => {
    if (!s) return null;
    const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    return m ? { r: +m[1], g: +m[2], b: +m[3] } : null;
};

class X {
    #config: any;
    #resizeObserver?: ResizeObserver;
    #intersectionObserver?: IntersectionObserver;
    #resizeTimer?: number;
    #animationFrameId: number = 0;
    #clock: Clock = new Clock();
    #animationState = { elapsed: 0, delta: 0 };
    #isAnimating: boolean = false;
    #isVisible: boolean = false;
    canvas: HTMLCanvasElement;
    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    size: any = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
    onBeforeRender: (state: { elapsed: number; delta: number }) => void = () => {};
    onAfterResize: (size: any) => void = () => {};

    constructor(config: any) {
        this.#config = config;
        this.canvas = this.#config.canvas;
        this.camera = new PerspectiveCamera(50, 1, 0.1, 100);
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            powerPreference: "high-performance",
            alpha: true,
            antialias: true,
            ...this.#config.rendererOptions,
        });
        this.renderer.outputColorSpace = SRGBColorSpace;
        this.canvas.style.display = "block";
        this.#initObservers();
        this.resize();
    }

    #initObservers() {
        const parentEl = this.#config.size === "parent" ? this.canvas.parentNode as Element : null;
        if (parentEl) {
            this.#resizeObserver = new ResizeObserver(this.#onResize.bind(this));
            this.#resizeObserver.observe(parentEl);
        } else {
            window.addEventListener("resize", this.#onResize.bind(this));
        }
        this.#intersectionObserver = new IntersectionObserver(this.#onIntersection.bind(this), { threshold: 0 });
        this.#intersectionObserver.observe(this.canvas);
        document.addEventListener("visibilitychange", this.#onVisibilityChange.bind(this));
    }

    #onResize() {
        if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
        this.#resizeTimer = window.setTimeout(this.resize.bind(this), 100);
    }

    resize() {
        const parentEl = this.#config.size === "parent" ? this.canvas.parentNode as HTMLElement : null;
        const w = parentEl ? parentEl.offsetWidth : window.innerWidth;
        const h = parentEl ? parentEl.offsetHeight : window.innerHeight;
        this.size.width = w; this.size.height = h; this.size.ratio = w / h;
        this.camera.aspect = this.size.ratio; this.camera.updateProjectionMatrix();
        const fovRad = (this.camera.fov * Math.PI) / 180;
        this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.z;
        this.size.wWidth = this.size.wHeight * this.camera.aspect;
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.onAfterResize(this.size);
    }

    #onIntersection(e: IntersectionObserverEntry[]) {
        this.#isAnimating = e[0].isIntersecting;
        this.#isAnimating ? this.#startAnimation() : this.#stopAnimation();
    }

    #onVisibilityChange() {
        if (this.#isAnimating) document.hidden ? this.#stopAnimation() : this.#startAnimation();
    }

    #startAnimation() {
        if (this.#isVisible) return;
        this.#isVisible = true;
        this.#clock.start();
        const f = () => {
            this.#animationFrameId = requestAnimationFrame(f);
            this.#animationState.delta = this.#clock.getDelta();
            this.#animationState.elapsed += this.#animationState.delta;
            this.onBeforeRender(this.#animationState);
            this.renderer.render(this.scene, this.camera);
        };
        f();
    }

    #stopAnimation() {
        if (this.#isVisible) {
            cancelAnimationFrame(this.#animationFrameId);
            this.#isVisible = false;
            this.#clock.stop();
        }
    }

    dispose() {
        this.#stopAnimation();
        this.#resizeObserver?.disconnect();
        this.#intersectionObserver?.disconnect();
        window.removeEventListener("resize", this.#onResize.bind(this));
        document.removeEventListener("visibilitychange", this.#onVisibilityChange.bind(this));
        this.scene.clear();
        this.renderer.dispose();
    }
}

class W {
    config: any;
    positionData: Float32Array;
    velocityData: Float32Array;
    sizeData: Float32Array;
    center: Vector3 = new Vector3();

    constructor(config: any) {
        this.config = config;
        this.positionData = new Float32Array(3 * config.count);
        this.velocityData = new Float32Array(3 * config.count);
        this.sizeData = new Float32Array(config.count);
        this.#initializePositions();
        this.setSizes();
    }

    #initializePositions() {
        const { count, maxX, maxY, maxZ } = this.config;
        this.center.toArray(this.positionData, 0);
        for (let i = 1; i < count; i++) {
            const idx = 3 * i;
            this.positionData[idx] = MathUtils.randFloatSpread(2 * maxX);
            this.positionData[idx + 1] = MathUtils.randFloatSpread(2 * maxY);
            this.positionData[idx + 2] = MathUtils.randFloatSpread(2 * maxZ);
        }
    }

    setSizes() {
        const { count, size0, minSize, maxSize } = this.config;
        this.sizeData[0] = size0;
        for (let i = 1; i < count; i++) this.sizeData[i] = MathUtils.randFloat(minSize, maxSize);
    }

    update(deltaInfo: { delta: number }) {
        const { config, center, positionData, sizeData, velocityData } = this;
        const startIdx = config.controlSphere0 ? 1 : 0;
        if (config.controlSphere0) {
            new Vector3().fromArray(positionData, 0).lerp(center, 0.1).toArray(positionData, 0);
            new Vector3(0, 0, 0).toArray(velocityData, 0);
        }
        for (let i = startIdx; i < config.count; i++) {
            const base = 3 * i;
            const pos = new Vector3().fromArray(positionData, base);
            const vel = new Vector3().fromArray(velocityData, base);
            vel.y -= deltaInfo.delta * config.gravity * sizeData[i];
            vel.multiplyScalar(config.friction);
            vel.clampLength(0, config.maxVelocity);
            pos.add(vel);
            for (let j = i + 1; j < config.count; j++) {
                const otherBase = 3 * j;
                const otherPos = new Vector3().fromArray(positionData, otherBase);
                const diff = new Vector3().subVectors(otherPos, pos);
                const dist = diff.length();
                const sumRadius = sizeData[i] + sizeData[j];
                if (dist < sumRadius) {
                    const overlap = (sumRadius - dist) * 0.5;
                    diff.normalize();
                    pos.addScaledVector(diff, -overlap);
                    otherPos.addScaledVector(diff, overlap);
                    pos.toArray(positionData, base);
                    otherPos.toArray(positionData, otherBase);
                }
            }
            if (Math.abs(pos.x) + sizeData[i] > config.maxX) { pos.x = Math.sign(pos.x) * (config.maxX - sizeData[i]); vel.x *= -config.wallBounce; }
            if (pos.y - sizeData[i] < -config.maxY) { pos.y = -config.maxY + sizeData[i]; vel.y *= -config.wallBounce; }
            if (Math.abs(pos.z) + sizeData[i] > config.maxZ) { pos.z = Math.sign(pos.z) * (config.maxZ - sizeData[i]); vel.z *= -config.wallBounce; }
            pos.toArray(positionData, base);
            vel.toArray(velocityData, base);
        }
    }
}

const U = new Object3D();

class Z extends InstancedMesh {
    config: any;
    physics: W;
    ambientLight: AmbientLight;
    light: PointLight;

    constructor(renderer: WebGLRenderer, params: any) {
        const pmrem = new PMREMGenerator(renderer);
        const envTexture = pmrem.fromScene(new RoomEnvironment()).texture;
        pmrem.dispose();
        const geometry = new SphereGeometry(1, 24, 24);
        const material = new MeshPhysicalMaterial({ envMap: envTexture, ...params.materialParams });
        super(geometry, material, params.count);
        this.config = params;
        this.physics = new W(this.config);
        this.ambientLight = new AmbientLight(0xffffff, params.ambientIntensity);
        this.add(this.ambientLight);
        this.light = new PointLight(0xffffff, params.lightIntensity, 100, 1);
        this.add(this.light);
        this.setColors(this.config.colors);
    }

    setColors(colors: (string | Color)[]) {
        if (!Array.isArray(colors) || !colors.length) return;
        const colorObjs = colors.map(c => c instanceof Color ? c : new Color(c));
        for (let i = 0; i < this.count; i++) this.setColorAt(i, colorObjs[i % colorObjs.length]);
        if (this.instanceColor) this.instanceColor.needsUpdate = true;
    }

    update(deltaInfo: { delta: number }) {
        this.physics.update(deltaInfo);
        for (let i = 0; i < this.count; i++) {
            U.position.fromArray(this.physics.positionData, 3 * i);
            U.scale.setScalar(this.physics.sizeData[i]);
            U.updateMatrix();
            this.setMatrixAt(i, U.matrix);
        }
        this.instanceMatrix.needsUpdate = true;
        if (this.config.controlSphere0) this.light.position.fromArray(this.physics.positionData, 0);
    }
}

const pointer = new Vector2();
function onPointerMove(e: PointerEvent) {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
}

const defaultBallpitConfig = {
    count: 200,
    materialParams: { metalness: 0.7, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2 },
    minSize: 0.3, maxSize: 0.8, size0: 1.0,
    gravity: 0.4, friction: 0.995, wallBounce: 0.2, maxVelocity: 0.1,
    maxX: 10, maxY: 10, maxZ: 10,
    controlSphere0: true, followCursor: true,
    lightIntensity: 3, ambientIntensity: 1.5,
};

const lightColors = ["#E5E5E5", "#CCCCCC", "#B2B2B2"];
const darkColors = ["#444444", "#222222", "#111111"];

type BallpitProps = Partial<typeof defaultBallpitConfig & { colors: (string | Color)[] }>;

interface InteractiveHeroProps {
    brandName?: string;
    heroTitle?: string;
    heroDescription?: string;
    className?: string;
    ballpitConfig?: BallpitProps;
    showInternalHeader?: boolean;
}

export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
    brandName = "NEXUS",
    heroTitle = "Innovation Meets Simplicity",
    heroDescription = "Discover cutting-edge solutions designed for the modern digital landscape.",
    className,
    ballpitConfig = {},
    showInternalHeader = true,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Arrow canvas
    const arrowCanvasRef = useRef<HTMLCanvasElement>(null);
    const contactBtnRef = useRef<HTMLAnchorElement>(null);
    const mousePosRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
    const arrowCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const arrowFrameRef = useRef<number>(0);
    const arrowColorRef = useRef<RgbColor>({ r: 128, g: 128, b: 128 });

    const config = useMemo(() => ({
        ...defaultBallpitConfig,
        ...ballpitConfig,
        colors: theme === 'dark' ? darkColors : lightColors,
    }), [ballpitConfig, theme]);

    // Sync arrow color with theme
    useEffect(() => {
        const el = document.createElement('div');
        el.style.display = 'none';
        document.body.appendChild(el);

        const sync = () => {
            el.style.color = 'var(--foreground)';
            const parsed = parseRgbColor(getComputedStyle(el).color);
            if (parsed) arrowColorRef.current = parsed;
        };

        sync();
        const mo = new MutationObserver(sync);
        mo.observe(document.documentElement, { attributes: true });
        return () => { mo.disconnect(); el.parentNode?.removeChild(el); };
    }, []);

    const drawArrow = useCallback(() => {
        const ctx = arrowCtxRef.current;
        const target = contactBtnRef.current;
        const mouse = mousePosRef.current;
        if (!ctx || !target || mouse.x === null || mouse.y === null) return;

        const x0 = mouse.x, y0 = mouse.y;
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const a = Math.atan2(cy - y0, cx - x0);
        const x1 = cx - Math.cos(a) * (rect.width / 2 + 12);
        const y1 = cy - Math.sin(a) * (rect.height / 2 + 12);

        const midX = (x0 + x1) / 2, midY = (y0 + y1) / 2;
        const offset = Math.min(200, Math.hypot(x1 - x0, y1 - y0) * 0.5);
        const t = Math.max(-1, Math.min(1, (y0 - y1) / 200));
        const controlX = midX, controlY = midY + offset * t;

        const dist = Math.hypot(x1 - x0, y1 - y0);
        const opacity = Math.min(1.0, (dist - Math.max(rect.width, rect.height) / 2) / 500);
        const { r, g, b } = arrowColorRef.current;

        ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`;
        ctx.lineWidth = 2;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(controlX, controlY, x1, y1);
        ctx.setLineDash([10, 5]);
        ctx.stroke();
        ctx.restore();

        const angle = Math.atan2(y1 - controlY, x1 - controlX);
        const head = 10 * (2 / 1.5);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - head * Math.cos(angle - Math.PI / 6), y1 - head * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - head * Math.cos(angle + Math.PI / 6), y1 - head * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    }, []);

    useEffect(() => {
        const ac = arrowCanvasRef.current;
        if (!ac) return;
        arrowCtxRef.current = ac.getContext('2d');

        const resize = () => { ac.width = window.innerWidth; ac.height = window.innerHeight; };
        const move = (e: MouseEvent) => { mousePosRef.current = { x: e.clientX, y: e.clientY }; };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', move);
        resize();

        const loop = () => {
            arrowCtxRef.current?.clearRect(0, 0, ac.width, ac.height);
            drawArrow();
            arrowFrameRef.current = requestAnimationFrame(loop);
        };
        arrowFrameRef.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', move);
            cancelAnimationFrame(arrowFrameRef.current);
        };
    }, [drawArrow]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const three = new X({ canvas, size: "parent" });
        three.renderer.toneMapping = ACESFilmicToneMapping;
        three.camera.position.set(0, 0, 20);

        const spheres = new Z(three.renderer, config);
        three.scene.add(spheres);

        const raycaster = new Raycaster();
        const plane = new Plane(new Vector3(0, 0, 1), 0);
        const intersectionPoint = new Vector3();

        if (config.followCursor) {
            window.addEventListener("pointermove", onPointerMove);
        }

        three.onBeforeRender = (deltaInfo) => {
            if (config.followCursor) {
                raycaster.setFromCamera(pointer, three.camera);
                if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
                    spheres.physics.center.copy(intersectionPoint);
                }
            }
            spheres.update(deltaInfo);
        };

        let initialized = false;
        three.onAfterResize = (size) => {
            spheres.physics.config.maxX = size.wWidth / 2;
            spheres.physics.config.maxY = size.wHeight / 2;
            spheres.physics.config.maxZ = size.wWidth / 10;

            // Re-scatter on first real resize so positions use actual viewport bounds
            if (!initialized) {
                initialized = true;
                const { count, maxX, maxY, maxZ } = spheres.physics.config;
                for (let i = 1; i < count; i++) {
                    const idx = 3 * i;
                    spheres.physics.positionData[idx]     = MathUtils.randFloatSpread(2 * maxX);
                    spheres.physics.positionData[idx + 1] = MathUtils.randFloatSpread(2 * maxY);
                    spheres.physics.positionData[idx + 2] = MathUtils.randFloatSpread(2 * maxZ);
                }
            }
        };

        // Force resize now that camera z and callback are set
        three.resize();

        return () => {
            if (config.followCursor) {
                window.removeEventListener("pointermove", onPointerMove);
            }
            three.dispose();
        };
    }, [config]);

    return (
        <div className={cn("relative w-full h-screen overflow-hidden bg-background", className)}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
            <canvas ref={arrowCanvasRef} className="fixed inset-0 pointer-events-none z-[60]" />

            {showInternalHeader && <header className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between gap-4">
                    <a href="#" className="font-bold text-2xl text-foreground tracking-tight">
                        {brandName}
                    </a>
                    <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <a href="#" className="hover:text-foreground px-3 py-2 transition-colors rounded-md">About</a>
                        <a href="#" className="hover:text-foreground px-3 py-2 transition-colors rounded-md">Blog</a>
                        <a href="#" className="hover:text-foreground px-3 py-2 transition-colors rounded-md">Contact</a>
                    </nav>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="bg-secondary/50 hover:bg-secondary flex-shrink-0 p-2.5 rounded-full transition-colors"
                            aria-label="Toggle theme"
                        >
                            <Sun className="h-5 w-5 text-foreground dark:hidden" />
                            <Moon className="h-5 w-5 text-foreground hidden dark:block" />
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2.5" aria-label="Open menu">
                            <Menu className="h-6 w-6 text-foreground" />
                        </button>
                    </div>
                </div>
            </header>}

            <main className={cn(
                "relative z-10 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-8 px-6 sm:px-10 lg:px-16",
                showInternalHeader ? "h-[calc(100%-100px)]" : "h-full pt-14 md:pt-16"
            )}>
                <div className="flex-1 min-w-0 w-full">
                    <div>
                        <BlurText
                            text="AMETH"
                            delay={100}
                            animateBy="letters"
                            direction="top"
                            className="font-bold text-[52px] sm:text-[90px] md:text-[120px] lg:text-[160px] xl:text-[200px] leading-[0.85] tracking-tighter uppercase"
                            style={{ color: "#C3E41D", fontFamily: "'Fira Code', monospace" }}
                        />
                    </div>
                    <div>
                        <BlurText
                            text="TOLEDO"
                            delay={100}
                            animateBy="letters"
                            direction="top"
                            className="font-bold text-[52px] sm:text-[90px] md:text-[120px] lg:text-[160px] xl:text-[200px] leading-[0.85] tracking-tighter uppercase"
                            style={{ color: "#C3E41D", fontFamily: "'Fira Code', monospace" }}
                        />
                    </div>
                    <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg font-medium text-muted-foreground tracking-widest uppercase">
                        {heroTitle}
                    </p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground max-w-md">
                        {heroDescription}
                    </p>
                    <div className="mt-5 sm:mt-8 flex flex-row flex-wrap items-center gap-3">
                        <a
                            ref={contactBtnRef}
                            href="#contacto"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm transition-colors"
                        >
                            Contáctame
                        </a>
                        <a
                            href="#proyectos"
                            className="bg-secondary/50 hover:bg-secondary text-foreground border border-border px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm transition-colors"
                        >
                            Ver Proyectos
                        </a>
                    </div>
                </div>

                {/* Profile photo — hidden on very small portrait screens */}
                <div className="hidden sm:flex flex-shrink-0 items-center justify-center
                                w-32 md:w-44 lg:w-52 xl:w-64
                                mb-2 md:mb-0 md:mr-4 lg:mr-10">
                    <div className="relative w-full">
                        {/* Rotating conic-gradient border — same mechanic as InfoCard */}
                        <div
                            className="w-full rounded-[1em] p-[2px] shadow-2xl"
                            style={{
                                backgroundImage: `linear-gradient(#0d0d0d, #0d0d0d), conic-gradient(from var(--photo-rot, 0deg), #C3E41D 0deg, #C3E41D 80deg, #2a2a2a 80deg, #2a2a2a 360deg)`,
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                            } as React.CSSProperties}
                            onMouseMove={(e) => {
                                const el = e.currentTarget as HTMLDivElement;
                                const rect = el.getBoundingClientRect();
                                const angle = Math.atan2(
                                    e.clientY - rect.top  - rect.height / 2,
                                    e.clientX - rect.left - rect.width  / 2
                                );
                                el.style.setProperty('--photo-rot', `${angle}rad`);
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.setProperty('--photo-rot', '0deg');
                            }}
                        >
                            {/* Terminal window inner */}
                            <div className="rounded-[calc(1em-2px)] overflow-hidden w-full bg-zinc-950">
                                {/* Title bar */}
                                <div className="bg-zinc-900 px-3 py-2 flex items-center gap-2 border-b border-white/5">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-red-500/70" />
                                        <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
                                        <span className="w-2 h-2 rounded-full bg-green-500/70" />
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-500 truncate">~/ameth/profile.png</span>
                                </div>
                                {/* Photo */}
                                <div className="aspect-[3/4] overflow-hidden">
                                    <img
                                        src="/assets/profile.png"
                                        alt="Ameth Toledo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Disponible badge */}
                        <div className="mt-3 mx-auto w-fit bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl">
                            <span className="w-2 h-2 rounded-full bg-[#C3E41D] animate-pulse" />
                            <span className="text-[11px] font-mono text-zinc-300">disponible</span>
                        </div>

                        {/* Certificate chip */}
                        <a
                            href="/assets/pdf/UI-UXCertificado.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute -top-3 -left-14 bg-zinc-900 border border-[#C3E41D]/30 hover:border-[#C3E41D]/70 px-3 py-2 rounded-xl flex items-center gap-2 shadow-xl transition-colors group"
                        >
                            <Target className="w-4 h-4 text-[#C3E41D] group-hover:rotate-12 transition-transform" />
                            <div>
                                <p className="text-[10px] font-mono font-bold text-[#C3E41D]">UI/UX</p>
                                <p className="text-[10px] font-mono text-zinc-500">Coursera</p>
                            </div>
                        </a>
                    </div>
                </div>
            </main>

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-0 left-0 w-full h-full bg-background/80 backdrop-blur-sm z-20">
                    <div className="absolute top-24 right-8 p-4 bg-card border shadow-lg rounded-xl w-48">
                        <nav className="flex flex-col gap-2 text-muted-foreground font-medium">
                            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">About</a>
                            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">Blog</a>
                            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg">Contact</a>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};
