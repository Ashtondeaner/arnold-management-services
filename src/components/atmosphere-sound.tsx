import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ams-atmosphere-sound";

type Graph = {
  ctx: AudioContext;
  source: AudioBufferSourceNode;
  gain: GainNode;
  lfo: OscillatorNode;
};

function buildSurf(ctx: AudioContext): Graph {
  const duration = 4;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.015 * white) / 1.015;
    data[i] = last * 4.2;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  filter.Q.value = 0.7;

  const gain = ctx.createGain();
  gain.gain.value = 0;

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.07;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 90;
  lfo.connect(lfoDepth);
  lfoDepth.connect(filter.frequency);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  lfo.start();

  return { ctx, source, gain, lfo };
}

export function AtmosphereSound() {
  const graph = useRef<Graph | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    return () => {
      const g = graph.current;
      if (!g) return;
      try {
        g.source.stop();
        g.lfo.stop();
        void g.ctx.close();
      } catch {
        /* already closed */
      }
      graph.current = null;
    };
  }, []);

  async function toggle() {
    if (on) {
      const g = graph.current;
      if (g) {
        g.gain.gain.cancelScheduledValues(g.ctx.currentTime);
        g.gain.gain.linearRampToValueAtTime(0, g.ctx.currentTime + 0.6);
      }
      setOn(false);
      try {
        localStorage.setItem(STORAGE_KEY, "off");
      } catch {
        /* ignore */
      }
      return;
    }

    try {
      if (!graph.current) {
        const ctx = new AudioContext();
        graph.current = buildSurf(ctx);
      }
      const g = graph.current;
      if (g.ctx.state === "suspended") await g.ctx.resume();
      g.gain.gain.cancelScheduledValues(g.ctx.currentTime);
      g.gain.gain.linearRampToValueAtTime(0.045, g.ctx.currentTime + 1.4);
      setOn(true);
      localStorage.setItem(STORAGE_KEY, "on");
    } catch {
      setOn(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      aria-pressed={on}
      aria-label={on ? "Turn off water sound" : "Listen to water"}
      className={cn(
        "fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated/90 px-3.5 py-2 text-xs font-medium tracking-wide text-fg shadow-[var(--shadow-soft)] backdrop-blur-sm transition-colors hover:bg-bg focus-ring",
      )}
    >
      {on ? <Volume2 className="size-3.5 text-primary" /> : <VolumeX className="size-3.5 text-fg-muted" />}
      {on ? "Water on" : "Listen to water"}
    </button>
  );
}
