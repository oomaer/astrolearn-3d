// shaders (and its animations) were generated with AI
export const spaceSphereVertexShader= `
          varying vec3 vPos;
          void main() {
            vPos = normalize((modelMatrix * vec4(position,1.0)).xyz);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        ` 
export const spaceSphereFramentShader= `
          precision highp float;
          varying vec3 vPos;
          uniform float time;
    
          // Classic Perlin-like noise
          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1,311.7, 74.7)))*43758.5453123);
          }
          
          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
    
            float n000 = hash(i + vec3(0.0,0.0,0.0));
            float n100 = hash(i + vec3(1.0,0.0,0.0));
            float n010 = hash(i + vec3(0.0,1.0,0.0));
            float n110 = hash(i + vec3(1.0,1.0,0.0));
            float n001 = hash(i + vec3(0.0,0.0,1.0));
            float n101 = hash(i + vec3(1.0,0.0,1.0));
            float n011 = hash(i + vec3(0.0,1.0,1.0));
            float n111 = hash(i + vec3(1.0,1.0,1.0));
    
            vec3 u = f*f*(3.0 - 2.0*f);
    
            float nx00 = mix(n000, n100, u.x);
            float nx01 = mix(n001, n101, u.x);
            float nx10 = mix(n010, n110, u.x);
            float nx11 = mix(n011, n111, u.x);
    
            float nxy0 = mix(nx00, nx10, u.y);
            float nxy1 = mix(nx01, nx11, u.y);
    
            return mix(nxy0, nxy1, u.z);
          }
    
          void main() {
            vec3 p = vPos * 4.0;
            p += vec3(0.0, time * 0.2, time * 0.1);
    
            float n = noise(p);
            float n2 = noise(p * 2.0);
            float n3 = noise(p * 0.5 + 10.0);
    
            // Combine noise layers softly for depth
            float combinedNoise = (n + n2 * 0.6 + n3 * 0.4) / 2.0;
    
            // Base galaxy colors (dark blues and purples)
            vec3 color1 = vec3(0.05, 0.05, 0.15);
            vec3 color2 = vec3(0.2, 0.05, 0.3);
            vec3 color3 = vec3(0.15, 0.1, 0.25);
    
            // Blend colors by noise value, smooth transitions
            vec3 color = mix(color1, color2, smoothstep(0.3, 0.7, combinedNoise));
            color = mix(color, color3, smoothstep(0.5, 0.9, combinedNoise));
    
            // Slight glow effect in bright spots
            float glow = smoothstep(0.7, 1.0, combinedNoise);
            color += vec3(0.3, 0.2, 0.5) * pow(glow, 3.0) * 0.15;
    
            // Keep colors deep and subtle (clamp)
            color = clamp(color, 0.0, 1.0);
    
            gl_FragColor = vec4(color, 1.0);
          }
        `

export const sunVertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vUv = uv;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

export const sunFragmentShader = `
    precision highp float;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    uniform float time;

    // Improved noise functions for more detailed fire effect
    float hash(vec3 p) {
        p = fract(p * vec3(0.1031, 0.1030, 0.0973));
        p += dot(p, p.yxz + 33.33);
        return fract((p.x + p.y) * p.z);
    }

    float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);

        float n = mix(
            mix(
                mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
                mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
                f.y
            ),
            mix(
                mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
                mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
                f.y
            ),
            f.z
        );
        return n;
    }

    // Turbulence function for more complex fire patterns
    float turbulence(vec3 p) {
        float t = 0.0;
        float scale = 1.0;
        for(int i = 0; i < 4; i++) {
            t += abs(noise(p * scale)) / scale;
            scale *= 2.0;
            p = p * 1.5 + vec3(0.0, time * 0.05, 0.0);
        }
        return t;
    }

    void main() {
        // Base fire colors - more orange focused
        vec3 fireColor1 = vec3(1.0, 0.4, 0.0);  // Deep orange-red
        vec3 fireColor2 = vec3(1.0, 0.5, 0.1);  // Bright orange
        vec3 fireColor3 = vec3(1.0, 0.6, 0.2);  // Light orange
        
        // Create dynamic fire effect
        vec3 pos = vPosition * 2.0;
        pos += vec3(0.0, time * 0.2, time * 0.1);
        
        // Generate multiple layers of fire
        float t1 = turbulence(pos);
        float t2 = turbulence(pos * 1.5 + 5.0);
        float t3 = turbulence(pos * 2.0 + 10.0);
        
        // Combine turbulence layers
        float fire = (t1 + t2 * 0.5 + t3 * 0.25) / 1.75;
        
        // Create core
        float core = smoothstep(0.5, 0.0, length(vPosition));
        fire = max(fire, core * 0.9);
        
        // Add very subtle flickering
        float flicker = sin(time * 2.0) * 0.02 + 0.98;
        fire *= flicker;
        
        // Blend fire colors - more orange focused
        vec3 color = mix(fireColor1, fireColor2, smoothstep(0.3, 0.7, fire));
        color = mix(color, fireColor3, smoothstep(0.5, 0.9, fire));
        
        // Add intense glow with more orange
        float glow = pow(fire, 1.5) * 1.5;
        color += vec3(1.0, 0.5, 0.1) * glow;
        
        // Add edge distortion with orange tint
        float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        color += vec3(1.0, 0.5, 0.1) * pow(edge, 2.0) * 0.3;
        
        // Calculate distance from center for glow
        float dist = length(vPosition);
        
        // Create multiple layers of external glow
        float outerGlow = smoothstep(2.0, 0.8, dist) * 0.8; // Main outer glow
        float innerGlow = smoothstep(1.2, 0.8, dist) * 0.6; // Inner glow
        float coronaGlow = smoothstep(1.5, 1.0, dist) * 0.4; // Corona effect
        
        // Animate the glow
        float glowNoise = noise(vWorldPosition * 0.3 + time * 0.05);
        outerGlow *= (0.9 + glowNoise * 0.1);
        
        // Create glow colors
        vec3 outerGlowColor = mix(
            vec3(1.0, 0.4, 0.0), // Deep orange
            vec3(1.0, 0.6, 0.2), // Light orange
            smoothstep(0.8, 2.0, dist)
        );
        
        vec3 coronaColor = vec3(1.0, 0.5, 0.1); // Bright orange for corona
        
        // Combine all glow effects
        float totalGlow = outerGlow + innerGlow + coronaGlow;
        vec3 glowColor = mix(outerGlowColor, coronaColor, coronaGlow / (totalGlow + 0.001));
        
        // Blend with main color
        color = mix(color, glowColor, totalGlow);
        
        // Add subtle pulsing to the entire effect
        float pulse = sin(time * 0.5) * 0.05 + 0.95;
        color *= pulse;
        
        // Ensure brightness and add very subtle randomness
        color = clamp(color, 0.0, 1.0);
        color += vec3(0.05, 0.02, 0.0) * noise(vWorldPosition + time * 0.5);
        
        gl_FragColor = vec4(color, 1.0);
    }
`

export const earthVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    
    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

export const earthFragmentShader = `
    precision highp float;
    uniform float time;
    uniform sampler2D earthTexture;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;

    // Improved noise function for clouds
    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // FBM (Fractal Brownian Motion) for more natural cloud patterns
    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;
        
        for(int i = 0; i < 6; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
        }
        
        return value;
    }

    void main() {
        // Base texture
        vec4 texColor = texture2D(earthTexture, vUv);
        
        // Calculate light direction based on world position
        vec3 lightDir = normalize(-vWorldPosition);
        
        // Calculate day/night transition
        float dayNight = max(dot(vNormal, lightDir), 0.0);
        
        // Generate cloud pattern
        vec2 cloudUv = vUv + time * 0.1;
        float cloudPattern = fbm(cloudUv * 4.0);
        float clouds = smoothstep(0.4, 0.6, cloudPattern);
        
        // Base color with day/night transition
        vec3 finalColor = texColor.rgb;
        
        // Add clouds
        vec3 cloudColor = vec3(1.0);
        finalColor = mix(finalColor, cloudColor, clouds * 0.3);
        
        // Add atmospheric glow
        float rim = 1.0 - max(dot(vNormal, normalize(cameraPosition - vWorldPosition)), 0.0);
        rim = pow(rim, 3.0);
        vec3 atmosphereColor = mix(vec3(0.1, 0.2, 0.4), vec3(0.3, 0.6, 1.0), dayNight);
        finalColor = mix(finalColor, atmosphereColor, rim * 0.5);
        
        // Apply day/night transition
        finalColor *= mix(0.3, 1.0, dayNight);
        
        // Add city lights on night side
        float cityLights = noise(vUv * 20.0) * (1.0 - dayNight);
        finalColor += vec3(1.0, 0.9, 0.7) * cityLights * 0.2;
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`