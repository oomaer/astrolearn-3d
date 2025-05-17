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