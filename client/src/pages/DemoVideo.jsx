import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Layers,
  ExternalLink,
  ShieldCheck,
  Check,
  Zap,
  Subtitles,
  RotateCw,
  Clock,
  User,
  ArrowUpRight,
  CheckCircle,
  Mic,
  Headphones,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export default function DemoVideo() {
  const TOTAL_DURATION = 90; // 90 seconds continuous video demonstration
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Start paused so initial click unlocks browser audio!
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);

  // SpeechSynthesis Voice Management
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceStatus, setVoiceStatus] = useState('ready'); // 'ready' | 'speaking' | 'muted'

  const videoContainerRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTickRef = useRef(Date.now());
  const lastSpokenSceneRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const speakTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const { demoLogin } = useAuth();

  // Continuous scenes timeline mapping across 90 continuous seconds
  const SCENES = [
    {
      id: 'dashboard',
      startTime: 0,
      endTime: 13,
      phaseNumber: '01',
      phaseLabel: 'Freelancer Entry & Portfolio Metrics',
      role: 'Alex Rivera (Freelancer)',
      roleBadgeBg: 'bg-[#E0EFE6] text-[#0D2B1D] border-[#B7D8C4]',
      title: 'Alex Rivera Logs In to the Contract Dashboard',
      caption: 'Alex Rivera logs in as Freelancer. The dashboard aggregates active contracts, total earnings ($4,500 pipeline), and current stage-gate status.',
      narration: 'Alex Rivera logs in as a verified Freelancer. His personalized dashboard immediately aggregates active contracts, total pipeline value, and escrow milestones in real time.',
      cursorStart: { x: 22, y: 35 },
      cursorEnd: { x: 86, y: 22 },
      actionLabel: 'Clicking "+ New Contract"',
    },
    {
      id: 'createProject',
      startTime: 13,
      endTime: 27,
      phaseNumber: '02',
      phaseLabel: 'Project Definition & Client Authorization',
      role: 'Alex Rivera (Freelancer)',
      roleBadgeBg: 'bg-[#FAF6EC] text-[#0D2B1D] border-[#DCCFBA]',
      title: 'Defining Contract Scope for Client Sarah Chen',
      caption: 'Alex enters project parameters: $4,500 budget, 30-day timeline, and designates Sarah Chen (sarah@company.com) as the authorized client.',
      narration: 'Alex defines the contract parameters: an E-commerce web storefront with a four thousand five hundred dollar budget, thirty day timeline, and designates Sarah Chen as the client.',
      cursorStart: { x: 45, y: 35 },
      cursorEnd: { x: 74, y: 82 },
      actionLabel: 'Triggering Gemini 3.8 Flash AI',
    },
    {
      id: 'geminiAI',
      startTime: 27,
      endTime: 43,
      phaseNumber: '03',
      phaseLabel: 'Gemini 3.8 Flash Scoping & Zero-Sum Logic',
      role: 'Gemini 3.8 Flash AI Engine',
      roleBadgeBg: 'bg-[#FFEAE6] text-[#EB442C] border-[#FFD2CA]',
      title: 'AI Decomposes Scope into 4 Zero-Sum Milestones',
      caption: 'Google Gemini 3.8 Flash decomposes the scope into 4 chronological milestones with concrete acceptance criteria and zero-sum balanced budgets.',
      narration: 'With one click, Google Gemini 3.8 Flash analyzes the brief, generating four chronological milestones with zero-sum balanced budgets summing exactly to four thousand five hundred dollars.',
      cursorStart: { x: 74, y: 82 },
      cursorEnd: { x: 86, y: 88 },
      actionLabel: 'Clicking "Publish & Send Roadmap"',
    },
    {
      id: 'clientReview',
      startTime: 43,
      endTime: 57,
      phaseNumber: '04',
      phaseLabel: 'Client Inspection & Roadmap Commitment',
      role: 'Sarah Chen (Client)',
      roleBadgeBg: 'bg-[#FAF6EC] text-[#EB442C] border-[#EB442C]',
      title: 'Sarah Chen Inspects & Signs Off on Roadmap',
      caption: 'Client Sarah Chen receives the project invitation, verifies milestone deliverables and deadlines, and approves the roadmap to initiate Stage-Gate 1.',
      narration: 'Sarah Chen logs in as Client, verifies milestone deliverables and timelines, and signs off on the roadmap to formally initiate Stage-Gate 1 without upfront financial risk.',
      cursorStart: { x: 28, y: 28 },
      cursorEnd: { x: 80, y: 80 },
      actionLabel: 'Clicking "Approve Milestone Roadmap"',
    },
    {
      id: 'submitWork',
      startTime: 57,
      endTime: 69,
      phaseNumber: '05',
      phaseLabel: 'Milestone Execution & Deliverable Proof',
      role: 'Alex Rivera (Freelancer)',
      roleBadgeBg: 'bg-[#E0EFE6] text-[#0D2B1D] border-[#B7D8C4]',
      title: 'Alex Submits Milestone 1 Deliverables for Review',
      caption: 'Alex checks off task items, attaches the GitHub pull request and live staging API link, and submits Milestone 1 for stage-gate inspection.',
      narration: 'Alex completes Milestone 1 micro-tasks, attaches the GitHub pull request and live staging URLs, and submits the milestone for client stage-gate inspection.',
      cursorStart: { x: 42, y: 40 },
      cursorEnd: { x: 82, y: 76 },
      actionLabel: 'Clicking "Submit for Review"',
    },
    {
      id: 'inspectionPayment',
      startTime: 69,
      endTime: 81,
      phaseNumber: '06',
      phaseLabel: 'Stage-Gate Inspection & PayPal Checkout',
      role: 'Sarah Chen (Client) & PayPal',
      roleBadgeBg: 'bg-[#751307] text-[#FAF6EC] border-[#751307]',
      title: 'Sarah Approves Work & Releases $900 via PayPal',
      caption: 'Sarah validates the live deliverables against the criteria. Approval unlocks the PayPal button, opening PayPal Sandbox Checkout for the $900 payout.',
      narration: 'Sarah inspects the live deliverable. It meets all criteria, so she approves the work, which unlocks the PayPal button and authorizes the nine hundred dollar milestone payment.',
      cursorStart: { x: 48, y: 52 },
      cursorEnd: { x: 76, y: 72 },
      actionLabel: 'Authorizing $900.00 via PayPal Sandbox',
    },
    {
      id: 'settlement',
      startTime: 81,
      endTime: 90,
      phaseNumber: '07',
      phaseLabel: 'Server Capture & Ledger Settlement',
      role: 'MilestoneMate Ledger Settlement',
      roleBadgeBg: 'bg-[#E0EFE6] text-[#0D2B1D] border-[#B7D8C4]',
      title: 'Server Captures PayPal Funds & Unlocks Stage-Gate 2',
      caption: 'The backend verifies the PayPal transaction, records the Capture ID in the immutable ledger, marks Milestone 1 Paid, and unlocks Stage-Gate 2.',
      narration: 'The server captures the transaction, logs the PayPal Capture ID to the immutable ledger, marks Milestone 1 Paid, and unlocks Stage-Gate 2 for continuous progress.',
      cursorStart: { x: 76, y: 72 },
      cursorEnd: { x: 50, y: 50 },
      actionLabel: 'Milestone 1 Paid • Stage-Gate 2 Active',
    },
  ];

  // Determine current active scene
  const activeSceneIndex = Math.min(
    SCENES.length - 1,
    Math.max(
      0,
      SCENES.findIndex((s) => currentTime >= s.startTime && currentTime < s.endTime) !== -1
        ? SCENES.findIndex((s) => currentTime >= s.startTime && currentTime < s.endTime)
        : SCENES.length - 1
    )
  );
  const activeScene = SCENES[activeSceneIndex];

  // Normalized progress within current scene (0.0 to 1.0)
  const sceneProgress = Math.min(
    1,
    Math.max(
      0,
      (currentTime - activeScene.startTime) / (activeScene.endTime - activeScene.startTime)
    )
  );

  // Smooth interpolated cursor positions
  const cursorX = activeScene.cursorStart.x + (activeScene.cursorEnd.x - activeScene.cursorStart.x) * sceneProgress;
  const cursorY = activeScene.cursorStart.y + (activeScene.cursorEnd.y - activeScene.cursorStart.y) * sceneProgress;

  // Web Audio feedback tone (sound cue confirmation)
  const playAudioCue = (type = 'start') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'start') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {}
  };

  // Discover and prioritize natural English voices
  useEffect(() => {
    const initVoices = () => {
      if (!window.speechSynthesis) return;
      const all = window.speechSynthesis.getVoices();
      if (all && all.length > 0) {
        setAvailableVoices(all);
        const english = all.filter((v) => v.lang.startsWith('en'));
        const preferred =
          english.find(
            (v) =>
              v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Online')
          ) ||
          english.find(
            (v) =>
              v.name.includes('Zira') ||
              v.name.includes('David') ||
              v.name.includes('Jenny') ||
              v.name.includes('Aria')
          ) ||
          english[0] ||
          all[0];

        setSelectedVoice(preferred);
      }
    };

    initVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = initVoices;
    }
  }, []);

  // Robust, debounced speech synthesis narrator
  const speakNarration = (text) => {
    if (isMuted || !window.speechSynthesis) {
      setVoiceStatus('muted');
      return;
    }

    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);

    // Cancel existing speech first
    try {
      window.speechSynthesis.cancel();
    } catch {}

    // Tiny 60ms timeout to avoid Chromium cancel/speak collision race condition
    speakTimeoutRef.current = setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        currentUtteranceRef.current = utterance;
        window._activeSpeechUtterance = utterance; // Prevent garbage collection!

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.lang = 'en-US';
        utterance.rate = 1.0 * playbackSpeed;
        utterance.pitch = 1.0;
        utterance.volume = 1.0; // 100% Volume

        utterance.onstart = () => {
          setVoiceStatus('speaking');
        };

        utterance.onend = () => {
          setVoiceStatus('ready');
          currentUtteranceRef.current = null;
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          setVoiceStatus('ready');
          currentUtteranceRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
        window.speechSynthesis.resume();
      } catch (err) {
        console.warn('Speech synthesis call failed:', err);
      }
    }, 60);
  };

  // Continuous playback loop running smoothly via requestAnimationFrame
  useEffect(() => {
    lastTickRef.current = Date.now();

    const loop = () => {
      const now = Date.now();
      const deltaSec = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + deltaSec * playbackSpeed;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return next;
        });
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Synchronize speech narration when active scene transitions or unpauses
  useEffect(() => {
    if (!isPlaying) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setVoiceStatus('ready');
      return;
    }

    if (!audioUnlocked) return; // Wait for initial user click to satisfy browser policy

    if (lastSpokenSceneRef.current !== activeScene.id) {
      lastSpokenSceneRef.current = activeScene.id;
      speakNarration(activeScene.narration);
    }
  }, [activeScene.id, isPlaying, isMuted, audioUnlocked, playbackSpeed, selectedVoice]);

  // Chrome SpeechSynthesis keep-alive heartbeat (prevents 15-second speech freeze)
  useEffect(() => {
    const keepAlive = setInterval(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 6000);
    return () => clearInterval(keepAlive);
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Unlock audio via sanctioned user gesture and begin playing
  const handleStartWithAudio = () => {
    setAudioUnlocked(true);
    setIsMuted(false);
    setIsPlaying(true);
    playAudioCue('start');

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    }

    lastSpokenSceneRef.current = activeScene.id;
    speakNarration(activeScene.narration);
  };

  // Dedicated Test Voice button
  const handleTestVoice = () => {
    setAudioUnlocked(true);
    setIsMuted(false);
    playAudioCue('start');
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    }
    speakNarration(activeScene.narration);
  };

  // Timeline scrubber click handler
  const handleScrubberClick = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const targetTime = (clickX / rect.width) * TOTAL_DURATION;
    setCurrentTime(targetTime);
    lastSpokenSceneRef.current = null;

    if (!audioUnlocked) {
      handleStartWithAudio();
    } else if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handleScrubberMouseMove = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHoverTime((hoverX / rect.width) * TOTAL_DURATION);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    lastSpokenSceneRef.current = null;
    setIsPlaying(true);
    if (audioUnlocked) speakNarration(SCENES[0].narration);
  };

  const handleSkip = (seconds) => {
    setCurrentTime((curr) => {
      const next = Math.max(0, Math.min(TOTAL_DURATION, curr + seconds));
      lastSpokenSceneRef.current = null;
      return next;
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleLaunchRole = async (role) => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    try {
      const user = await demoLogin(role);
      navigate(user?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
    } catch {
      try {
        await api.post('/seed');
        const user = await demoLogin(role);
        navigate(user?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
      } catch {
        navigate('/login');
      }
    }
  };

  const formatTime = (secs) => {
    const s = Math.floor(secs || 0);
    const m = Math.floor(s / 60);
    const remainingS = s % 60;
    return `${m}:${remainingS < 10 ? '0' : ''}${remainingS}`;
  };

  const titleText = 'E-Commerce Web Storefront with PayPal Escrow';
  const typedLength = Math.floor(sceneProgress * titleText.length);
  const currentTypedTitle = titleText.slice(0, typedLength);

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#0D2B1D] flex flex-col selection:bg-[#EB442C]/20 selection:text-[#0D2B1D]">
      {/* Header Banner */}
      <section className="py-8 sm:py-12 bg-[#FAF6EC] border-b border-[#E2D7C5] risograph-texture">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEAE6] border border-[#FFD2CA] text-xs font-black text-[#EB442C] uppercase tracking-widest mb-3 shadow-2xs">
            <Volume2 className="w-3.5 h-3.5 fill-current" /> AI Voice-Narrated Continuous Video Walkthrough
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D2B1D] tracking-tight">
            MilestoneMate Full Protocol Walkthrough
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#526058] max-w-2xl mx-auto font-medium">
            Watch the uninterrupted, live demonstration showing how Gemini 3.8 Flash automates project milestones, stage-gate inspections, and authoritative PayPal sandbox settlements.
          </p>
        </div>
      </section>

      {/* Main Continuous Video Theater */}
      <section className="py-8 sm:py-12 bg-[#F5F0E6] flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Video Frame */}
          <div
            ref={videoContainerRef}
            className="w-full bg-[#0A2217] rounded-3xl border-2 border-[#184230] shadow-2xl overflow-hidden flex flex-col transition-all relative"
          >
            {/* Player Top Status Bar */}
            <div className="px-5 py-3 border-b border-[#184230] bg-[#071911] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EB442C] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EB442C]" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-white">
                  Continuous AI Screencast
                </span>
                <span className="text-[#6A7870]">•</span>
                <span className="text-[11px] font-bold text-[#A4B5AC] hidden sm:inline">
                  {activeScene.phaseLabel}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Voice Status Pill */}
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#184230] border border-[#2E6B4E] text-[11px] font-bold text-[#A4B5AC]">
                  <Volume2 className={`w-3.5 h-3.5 ${voiceStatus === 'speaking' ? 'text-emerald-400 animate-pulse' : 'text-[#A4B5AC]'}`} />
                  <span>{selectedVoice?.name ? selectedVoice.name.split(' ')[0] : 'AI Voice Ready'}</span>
                </div>

                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${activeScene.roleBadgeBg}`}>
                  {activeScene.role}
                </span>

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg text-[#A4B5AC] hover:text-white hover:bg-[#184230] transition cursor-pointer hidden sm:block"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Simulated Live Screencast Canvas */}
            <div className="relative aspect-video w-full bg-linear-to-b from-[#0D2B1D] to-[#071911] flex items-center justify-center p-3 sm:p-7 overflow-hidden select-none">
              {/* Radial subtle grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#184230_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

              {/* Autoplay Audio Unlock Overlay (Shown when audio is pending user click) */}
              {!audioUnlocked && (
                <div className="absolute inset-0 z-40 bg-[#071911]/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-3xl bg-[#EB442C] text-white flex items-center justify-center shadow-2xl mb-4 group hover:scale-105 transition">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Start Video with AI Voice Narration
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#A4B5AC] max-w-md font-medium">
                    Web browsers require a user click to enable speech audio output. Click below to begin the full 90s screencast with voice.
                  </p>
                  <button
                    onClick={handleStartWithAudio}
                    className="mt-5 px-6 py-3.5 bg-[#EB442C] hover:bg-[#D4341E] text-white font-black text-sm rounded-xl shadow-xl flex items-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Video with Voice Narration</span>
                  </button>
                </div>
              )}

              {/* Animated Floating Cursor Pointer */}
              <div
                className="absolute pointer-events-none z-30 transition-all duration-150 ease-out flex items-center"
                style={{
                  left: `${cursorX}%`,
                  top: `${cursorY}%`,
                  transform: 'translate(-3px, -3px)',
                }}
              >
                <svg className="w-6 h-6 text-black drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 0l16 12.279-6.951 1.17 4.325 8.817-3.596 1.734-4.35-8.879-5.428 5.879z" />
                </svg>

                {/* Tactile click pulse ring near end of scene */}
                {sceneProgress > 0.8 && (
                  <span className="absolute -top-1.5 -left-1.5 w-9 h-9 rounded-full bg-[#EB442C]/40 animate-ping" />
                )}

                {/* Cursor action label tag */}
                <span className="ml-3 px-2 py-0.5 bg-[#0D2B1D] text-[#FAF6EC] text-[10px] font-bold rounded shadow-md whitespace-nowrap opacity-90 border border-[#2E6B4E]">
                  {activeScene.actionLabel}
                </span>
              </div>

              {/* In-Video Application Screen Mockup */}
              <div className="relative z-10 w-full max-w-3xl bg-[#F5F0E6] text-[#0D2B1D] rounded-2xl border-2 border-[#DCCFBA] shadow-2xl p-4 sm:p-6 transition-all duration-300">
                {/* Browser window chrome bar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DCCFBA]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EB442C]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-mono text-[#6A7870] ml-2 hidden sm:inline">
                      https://milestonemate.dev/app
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#6A7870]">
                      {formatTime(currentTime)} / 01:30
                    </span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FAF6EC] text-[#0D2B1D] border border-[#DCCFBA]">
                      Live Walkthrough
                    </span>
                  </div>
                </div>

                {/* SCENE 1: Freelancer Dashboard (0s - 13s) */}
                {activeScene.id === 'dashboard' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-sm sm:text-base font-black text-[#0D2B1D]">
                          Alex Rivera (Freelancer Dashboard)
                        </h2>
                        <p className="text-[11px] text-[#526058]">Real-Time Contract Ledger &amp; Velocity</p>
                      </div>
                      <span className="px-3 py-1 bg-[#E0EFE6] text-[#0D2B1D] text-xs font-black rounded-lg border border-[#B7D8C4]">
                        Pipeline: $4,500.00 USD
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center">
                      <div className="p-2.5 bg-[#FAF6EC] rounded-xl border border-[#DCCFBA]">
                        <span className="text-[10px] text-[#6A7870] font-bold block">Active Contracts</span>
                        <span className="text-sm font-black text-[#0D2B1D]">1 In Scoping</span>
                      </div>
                      <div className="p-2.5 bg-[#FAF6EC] rounded-xl border border-[#DCCFBA]">
                        <span className="text-[10px] text-[#6A7870] font-bold block">Verified Payouts</span>
                        <span className="text-sm font-black text-[#0D2B1D]">$0.00 (Escrow Ready)</span>
                      </div>
                      <div className="p-2.5 bg-[#FAF6EC] rounded-xl border border-[#DCCFBA]">
                        <span className="text-[10px] text-[#6A7870] font-bold block">Next Stage-Gate</span>
                        <span className="text-sm font-black text-[#EB442C]">Architecture Review</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAF6EC] rounded-xl border border-[#DCCFBA] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#0D2B1D] text-[#FAF6EC] flex items-center justify-center font-black text-xs">
                          EM
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#0D2B1D]">E-Commerce Website Development</p>
                          <p className="text-[10px] text-[#6A7870]">Client: Sarah Chen (sarah@company.com)</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`px-3 py-1.5 bg-[#0D2B1D] text-[#FAF6EC] text-xs font-black rounded-lg transition flex items-center gap-1 ${
                          sceneProgress > 0.7 ? 'scale-105 ring-2 ring-[#EB442C]' : ''
                        }`}
                      >
                        + New Contract <ArrowRight className="w-3 h-3 text-[#EB442C]" />
                      </button>
                    </div>
                  </div>
                )}

                {/* SCENE 2: Project Definition & Brief Input (13s - 27s) */}
                {activeScene.id === 'createProject' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm sm:text-base font-black text-[#0D2B1D]">
                        Contract Parameters &amp; Client Scoping
                      </h2>
                      <span className="text-xs font-mono font-bold text-[#EB442C]">$4,500.00 USD</span>
                    </div>

                    <div className="p-3 bg-[#FAF6EC] rounded-xl border border-[#DCCFBA] text-xs space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#6A7870] block">Project Title:</span>
                        <div className="h-6 flex items-center font-bold text-[#0D2B1D] font-mono">
                          {currentTypedTitle}
                          <span className="w-1.5 h-4 bg-[#EB442C] ml-0.5 animate-pulse" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#DCCFBA]/60">
                        <div>
                          <span className="text-[10px] font-bold text-[#6A7870] block">Client Identity:</span>
                          <span className="font-bold text-[#0D2B1D]">Sarah Chen (sarah@company.com)</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#6A7870] block">Target Delivery:</span>
                          <span className="font-bold text-[#0D2B1D]">30 Calendar Days</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        className={`px-4 py-2 bg-[#EB442C] text-white text-xs font-black rounded-xl shadow-sm transition flex items-center gap-1.5 ${
                          sceneProgress > 0.7 ? 'scale-105 ring-2 ring-emerald-500' : ''
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        Generate Milestones with Gemini AI
                      </button>
                    </div>
                  </div>
                )}

                {/* SCENE 3: Gemini 3.8 Flash Streaming Decomposition (27s - 43s) */}
                {activeScene.id === 'geminiAI' && (
                  <div className="space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#0D2B1D]">
                        <Sparkles className="w-4 h-4 text-[#EB442C] animate-spin" />
                        <span>Gemini 3.8 Flash Decomposition</span>
                      </div>
                      <span className="text-[10px] bg-[#E0EFE6] text-[#0D2B1D] font-black px-2.5 py-0.5 rounded-full border border-[#B7D8C4]">
                        Zero-Sum Balanced: $4,500.00
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-[#FAF6EC] rounded-lg border border-[#DCCFBA]">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[#0D2B1D]">M1: Architecture &amp; Schemas</span>
                          <span className="font-bold text-emerald-800">$900.00</span>
                        </div>
                        <span className="text-[10px] text-[#6A7870]">OpenAPI 3.0, ERD models, scaffolding</span>
                      </div>
                      <div className="p-2 bg-[#FAF6EC] rounded-lg border border-[#DCCFBA]">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[#0D2B1D]">M2: Storefront &amp; Cart</span>
                          <span className="font-bold text-emerald-800">$1,200.00</span>
                        </div>
                        <span className="text-[10px] text-[#6A7870]">Product grid, responsive cart UI</span>
                      </div>
                      <div className="p-2 bg-[#FAF6EC] rounded-lg border border-[#DCCFBA]">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[#0D2B1D]">M3: PayPal Integration</span>
                          <span className="font-bold text-emerald-800">$1,400.00</span>
                        </div>
                        <span className="text-[10px] text-[#6A7870]">Orders v2 API, capture webhook</span>
                      </div>
                      <div className="p-2 bg-[#FAF6EC] rounded-lg border border-[#DCCFBA]">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-[#0D2B1D]">M4: Testing &amp; Handover</span>
                          <span className="font-bold text-emerald-800">$1,000.00</span>
                        </div>
                        <span className="text-[10px] text-[#6A7870]">Cypress tests, production docs</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[10px] text-[#526058] font-bold">
                        Calculated Mathematical Sum = $4,500.00 (Zero Drift)
                      </span>
                      <button
                        type="button"
                        className={`px-3 py-1.5 bg-[#0D2B1D] text-[#FAF6EC] text-xs font-black rounded-lg transition ${
                          sceneProgress > 0.7 ? 'scale-105 ring-2 ring-[#EB442C]' : ''
                        }`}
                      >
                        Publish &amp; Send Roadmap →
                      </button>
                    </div>
                  </div>
                )}

                {/* SCENE 4: Client Review & Approval Gate (43s - 57s) */}
                {activeScene.id === 'clientReview' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-sm sm:text-base font-black text-[#0D2B1D]">
                          Sarah Chen (Client Review View)
                        </h2>
                        <p className="text-[11px] text-[#526058]">Roadmap Sign-Off &amp; Scope Commitment</p>
                      </div>
                      <span className="px-2.5 py-0.5 bg-[#FFEAE6] text-[#EB442C] text-xs font-black rounded-full border border-[#FFD2CA]">
                        Pending Client Approval
                      </span>
                    </div>

                    <div className="p-3 bg-[#FAF6EC] rounded-xl border border-[#DCCFBA] text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-[#0D2B1D]">
                        <span>4 Chronological Milestones Totaling $4,500.00</span>
                        <span className="text-emerald-700">Stage-Gate 1: $900.00</span>
                      </div>
                      <p className="text-[#526058] text-[11px]">
                        Sarah inspects the tasks, deliverables, and timeline before approving. No funds are charged until each stage-gate is inspected and accepted.
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className={`px-4 py-2 bg-[#0D2B1D] text-white text-xs font-black rounded-xl shadow-sm transition flex items-center gap-1.5 ${
                          sceneProgress > 0.7 ? 'scale-105 ring-2 ring-emerald-400' : ''
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Approve Milestone Roadmap
                      </button>
                    </div>
                  </div>
                )}

                {/* SCENE 5: Deliverable Submission (57s - 69s) */}
                {activeScene.id === 'submitWork' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm sm:text-base font-black text-[#0D2B1D]">
                        Alex Submits Milestone 1 Deliverables
                      </h2>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                        Tasks Completed
                      </span>
                    </div>

                    <div className="p-3 bg-[#FAF6EC] rounded-xl border border-[#DCCFBA] text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold">
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-mono text-[11px]">github.com/milestonemate/storefront-api/pull/1</span>
                      </div>
                      <p className="text-[#526058] text-[11px]">
                        OpenAPI schemas, database models, and unit test suites are attached for client inspection.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        className={`px-4 py-2 bg-[#0D2B1D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 ${
                          sceneProgress > 0.7 ? 'scale-105 ring-2 ring-[#EB442C]' : ''
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Submit for Client Inspection
                      </button>
                    </div>
                  </div>
                )}

                {/* SCENE 6: Stage-Gate Inspection & PayPal Checkout (69s - 81s) */}
                {activeScene.id === 'inspectionPayment' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0D2B1D]">
                        Stage-Gate 1 Inspection &amp; Escrow Release
                      </span>
                      <span className="text-[10px] bg-[#E0EFE6] text-[#0D2B1D] font-black px-2 py-0.5 rounded-full">
                        Deliverables Verified
                      </span>
                    </div>

                    <div className="p-3 bg-[#FAF6EC] rounded-xl border-2 border-[#003087] text-center space-y-1.5">
                      <div className="inline-block px-2.5 py-0.5 bg-[#003087] text-white font-black rounded text-[10px]">
                        PayPal Sandbox Checkout
                      </div>
                      <p className="text-xs font-black text-[#0D2B1D]">
                        Authorize Milestone 1 Release: $900.00 USD to Alex Rivera
                      </p>
                      <button
                        type="button"
                        className={`inline-flex items-center gap-1.5 px-5 py-2 bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] text-xs font-black rounded-full shadow-md transition ${
                          sceneProgress > 0.6 ? 'scale-105 ring-2 ring-[#003087]' : ''
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pay with PayPal ($900.00)
                      </button>
                    </div>
                  </div>
                )}

                {/* SCENE 7: Settlement & Stage-Gate 2 Unlock (81s - 90s) */}
                {activeScene.id === 'settlement' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="p-3.5 bg-emerald-50 rounded-xl border-2 border-emerald-400 text-xs text-[#065F46] space-y-1.5">
                      <div className="flex items-center gap-2 font-black text-emerald-800 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>PayPal Settlement Captured &amp; Verified!</span>
                      </div>
                      <p className="font-mono text-[10px] text-emerald-700">
                        Capture ID: SANDBOX-CAPTURE-89102-VERIFIED • Authorized by PayPal Orders v2
                      </p>
                      <p className="text-[11px] text-emerald-900 font-medium">
                        Milestone 1 marked <strong>PAID ($900.00)</strong>. Milestone 2 automatically unlocked in active development!
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <span className="px-3 py-1 bg-[#0D2B1D] text-[#FAF6EC] text-xs font-black rounded-lg">
                        Stage-Gate 2 Unlocked ✓
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Subtitles Overlay Bar */}
              {showSubtitles && (
                <div className="absolute bottom-3 inset-x-4 sm:inset-x-8 bg-[#071911]/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#184230] text-center shadow-lg transition-all">
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                    <span className="font-black text-[#EB442C] mr-2">[{activeScene.role}]</span>
                    {activeScene.caption}
                  </p>
                </div>
              )}
            </div>

            {/* Continuous Video Controls & Timeline Bar */}
            <div className="px-5 py-4 bg-[#071911] border-t border-[#184230] flex flex-col gap-3.5">
              {/* Single Continuous Timeline Scrubber (YouTube-Style) */}
              <div className="flex flex-col gap-1">
                <div
                  ref={progressBarRef}
                  onClick={handleScrubberClick}
                  onMouseMove={handleScrubberMouseMove}
                  onMouseLeave={() => setHoverTime(null)}
                  className="relative w-full h-3 bg-[#184230] rounded-full cursor-pointer group flex items-center"
                  title="Click or drag to scrub anywhere in the video"
                >
                  {/* Subtle scene transition markers */}
                  {SCENES.slice(1).map((s, idx) => (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 w-0.5 bg-[#0D2B1D] z-10 opacity-70 pointer-events-none"
                      style={{ left: `${(s.startTime / TOTAL_DURATION) * 100}%` }}
                    />
                  ))}

                  {/* Played progress red track */}
                  <div
                    className="h-full bg-linear-to-r from-[#EB442C] via-[#FF6347] to-emerald-400 rounded-full transition-all duration-75 relative"
                    style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
                  >
                    {/* Scrubber thumb handle */}
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-md border-2 border-[#EB442C] group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Scrubber hover time tooltip */}
                  {hoverTime !== null && (
                    <div
                      className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 bg-[#0D2B1D] text-white text-[10px] font-mono rounded shadow pointer-events-none z-20 border border-[#2E6B4E]"
                      style={{ left: `${(hoverTime / TOTAL_DURATION) * 100}%` }}
                    >
                      {formatTime(hoverTime)}
                    </div>
                  )}
                </div>

                {/* Time Display */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A4B5AC] px-1">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-white font-bold">{activeScene.title}</span>
                  <span>{formatTime(TOTAL_DURATION)}</span>
                </div>
              </div>

              {/* Action Buttons & Speed / Audio Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  {/* Play / Pause */}
                  <button
                    onClick={() => {
                      if (!audioUnlocked) {
                        handleStartWithAudio();
                      } else {
                        setIsPlaying(!isPlaying);
                      }
                    }}
                    className="w-10 h-10 rounded-xl bg-[#FAF6EC] hover:bg-white text-[#0D2B1D] flex items-center justify-center transition shadow-2xs cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  {/* Skip -10s */}
                  <button
                    onClick={() => handleSkip(-10)}
                    className="p-2 rounded-lg text-[#A4B5AC] hover:text-white hover:bg-[#184230] transition cursor-pointer text-xs font-bold"
                    title="Rewind 10 Seconds"
                  >
                    -10s
                  </button>

                  {/* Skip +10s */}
                  <button
                    onClick={() => handleSkip(10)}
                    className="p-2 rounded-lg text-[#A4B5AC] hover:text-white hover:bg-[#184230] transition cursor-pointer text-xs font-bold"
                    title="Forward 10 Seconds"
                  >
                    +10s
                  </button>

                  {/* Restart */}
                  <button
                    onClick={handleRestart}
                    className="p-2 rounded-lg text-[#A4B5AC] hover:text-white hover:bg-[#184230] transition cursor-pointer"
                    title="Replay from Beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Mute / Unmute */}
                  <button
                    onClick={() => {
                      if (!audioUnlocked) {
                        handleStartWithAudio();
                      } else {
                        const newMuted = !isMuted;
                        setIsMuted(newMuted);
                        if (!newMuted) {
                          speakNarration(activeScene.narration);
                        } else if (window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                        }
                      }
                    }}
                    className="p-2 rounded-xl text-[#A4B5AC] hover:text-white hover:bg-[#184230] transition cursor-pointer ml-1"
                    title={isMuted ? 'Unmute Voice Narration' : 'Mute Voice Narration'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-[#EB442C]" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  {/* Test / Replay Voice Button */}
                  <button
                    onClick={handleTestVoice}
                    className="px-2.5 py-1 rounded-lg bg-[#184230] hover:bg-[#235b43] text-emerald-300 text-[11px] font-black transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Click to hear AI voice narration right now"
                  >
                    <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Replay Voice</span>
                  </button>

                  {/* Subtitles CC Toggle */}
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      showSubtitles ? 'bg-[#184230] text-emerald-400' : 'text-[#A4B5AC] hover:text-white'
                    }`}
                    title="Toggle Subtitles"
                  >
                    <Subtitles className="w-4 h-4" />
                  </button>

                  {/* Playback Speed */}
                  <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#A4B5AC] ml-1">
                    {[1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition ${
                          playbackSpeed === spd ? 'bg-[#184230] text-emerald-400 font-black' : 'hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Sandbox Quick Test CTAs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLaunchRole('freelancer')}
                    className="px-3.5 py-2 bg-[#FAF6EC] hover:bg-white text-[#0D2B1D] text-xs font-black rounded-xl transition shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    Try Freelancer (Alex) <ArrowRight className="w-3.5 h-3.5 text-[#EB442C]" />
                  </button>
                  <button
                    onClick={() => handleLaunchRole('client')}
                    className="px-3.5 py-2 bg-[#EB442C] hover:bg-[#D4341E] text-white text-xs font-black rounded-xl transition shadow-2xs cursor-pointer"
                  >
                    Try Client (Sarah)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Protocol Flow Indicator */}
          <div className="mt-10 bg-[#FAF6EC] p-6 rounded-3xl border border-[#DCCFBA] shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-[#DCCFBA]">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#EB442C] block">
                  Continuous Protocol Timeline
                </span>
                <h3 className="text-xl font-black text-[#0D2B1D]">
                  How the End-to-End Pipeline Executes
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestVoice}
                  className="px-3 py-1 bg-[#0D2B1D] hover:bg-[#184230] text-white text-xs font-black rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Test Voice Audio</span>
                </button>
                <span className="text-xs font-bold text-[#526058]">
                  <span className="font-mono text-[#0D2B1D] font-black">{formatTime(currentTime)}</span> / 01:30
                </span>
              </div>
            </div>

            {/* Seamless Progress Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 text-xs">
              {SCENES.map((scene, idx) => {
                const isActive = activeScene.id === scene.id;
                const isPassed = currentTime >= scene.endTime;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentTime(scene.startTime);
                      lastSpokenSceneRef.current = null;
                      if (!audioUnlocked) {
                        handleStartWithAudio();
                      } else {
                        setIsPlaying(true);
                        speakNarration(scene.narration);
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#0D2B1D] text-[#FAF6EC] border-[#0D2B1D] shadow-md ring-2 ring-[#EB442C]'
                        : isPassed
                        ? 'bg-[#E0EFE6] text-[#0D2B1D] border-[#B7D8C4]'
                        : 'bg-[#F5F0E6] text-[#6A7870] border-[#DCCFBA] hover:border-[#0D2B1D]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black ${isActive ? 'text-[#EB442C]' : ''}`}>
                          {scene.phaseNumber}
                        </span>
                        {isPassed && <CheckCircle className="w-3 h-3 text-emerald-700" />}
                      </div>
                      <p className={`text-[11px] font-black leading-tight ${isActive ? 'text-white' : ''}`}>
                        {scene.phaseLabel}
                      </p>
                    </div>
                    <span className="text-[9px] font-mono mt-2 opacity-80">
                      {formatTime(scene.startTime)} - {formatTime(scene.endTime)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer in Deep Ink Emerald */}
      <footer className="mt-auto bg-[#0A2217] text-[#DCE7E1] py-10 border-t border-[#123524] text-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-white font-black text-sm">
            <div className="w-7 h-7 rounded-lg bg-[#0D2B1D] border border-[#2E6B4E] flex items-center justify-center text-white">
              <Layers className="w-4 h-4 text-[#EB442C]" />
            </div>
            <span>Milestone<span className="text-[#EB442C]">Mate</span></span>
          </div>
          <div className="flex gap-4 font-bold text-[#A4B5AC]">
            <Link to="/features" className="hover:text-white transition">Features</Link>
            <Link to="/how-it-works" className="hover:text-white transition">How It Works</Link>
            <Link to="/demo-video" className="text-white transition">AI Video Demo</Link>
            <Link to="/login" className="hover:text-[#EB442C] transition">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
