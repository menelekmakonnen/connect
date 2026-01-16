'use client';

import { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Phase {
    id: string;
    name: string;
    startDay: number; // Days from project start
    duration: number; // Duration in days
    color: string;
    dependencies?: string[]; // IDs of phases that must finish before this starts
}

interface ProductionTimelineProps {
    totalDuration: number; // Total project duration in days
    phases: Phase[];
    onPhasesChange?: (phases: Phase[]) => void;
    className?: string;
}

export function ProductionTimeline({
    totalDuration,
    phases: initialPhases,
    onPhasesChange,
    className
}: ProductionTimelineProps) {
    const timelineRef = useRef<HTMLDivElement>(null);
    const [duration, setDuration] = useState(totalDuration);
    const [phases, setPhases] = useState<Phase[]>(initialPhases);

    // Drag state
    const [draggedPhase, setDraggedPhase] = useState<string | null>(null);
    const [dragStartX, setDragStartX] = useState<number>(0);
    const [dragStartDay, setDragStartDay] = useState<number>(0);

    useEffect(() => {
        setDuration(totalDuration);
    }, [totalDuration]);

    useEffect(() => {
        setPhases(initialPhases);
    }, [initialPhases]);

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDuration = parseInt(e.target.value);
        setDuration(newDuration);
        // Optionally notify parent if needed, or just keep local for this interaction view
    };

    // Determine time scale based on duration
    const getTimeScale = () => {
        if (duration <= 28) return 'days'; // Show days for up to 4 weeks
        return 'weeks'; // Switch to weeks after
    };

    const timeScale = getTimeScale();

    // Calculate grid divisions
    const getGridDivisions = () => {
        if (timeScale === 'days') return duration;
        return Math.ceil(duration / 7);
    };

    const gridDivisions = getGridDivisions();

    // Format time labels
    const getTimeLabel = (index: number) => {
        if (timeScale === 'days') {
            const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
            return days[index % 7];
        }
        // Weeks
        return `W${index + 1}`;
    };

    // ... (rest of logic using 'duration' instead of 'totalDuration')

    // Convert days to grid position percentage
    const dayToPercent = (day: number) => {
        return (day / duration) * 100;
    };

    // Convert pixel position to days
    const pixelToDay = (pixelX: number) => {
        if (!timelineRef.current) return 0;
        const rect = timelineRef.current.getBoundingClientRect();
        const percent = (pixelX - rect.left) / rect.width;
        return Math.max(0, Math.min(duration, Math.round(percent * duration)));
    };

    const handlePhaseMouseDown = (phaseId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const phase = phases.find(p => p.id === phaseId);
        if (!phase) return;

        setDraggedPhase(phaseId);
        setDragStartX(e.clientX);
        setDragStartDay(phase.startDay);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!draggedPhase || !timelineRef.current) return;

        const phase = phases.find(p => p.id === draggedPhase);
        if (!phase) return;

        const deltaX = e.clientX - dragStartX;
        const rect = timelineRef.current.getBoundingClientRect();
        const deltaDay = Math.round((deltaX / rect.width) * duration);

        const newStartDay = Math.max(0, Math.min(duration - phase.duration, dragStartDay + deltaDay));

        setPhases(prev => prev.map(p =>
            p.id === draggedPhase ? { ...p, startDay: newStartDay } : p
        ));
    };

    const handleMouseUp = () => {
        if (draggedPhase) {
            onPhasesChange?.(phases);
            setDraggedPhase(null);
        }
    };

    useEffect(() => {
        if (draggedPhase) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [draggedPhase, dragStartX, dragStartDay]);

    return (
        <div className={cn("w-full", className)}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                <div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Production Pipeline</h3>
                    <p className="text-slate-400 font-medium">
                        Drag phases to schedule. Visualize your project timeline.
                    </p>
                </div>

                {/* Duration Slider - Premium Control */}
                <div className="bg-[#1a1d29] border border-white/10 p-5 rounded-2xl min-w-[300px] shadow-lg">
                    <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                        <span>Project Duration</span>
                        <span className="text-purple-400">{duration} Days ({Math.ceil(duration / 7)} Weeks)</span>
                    </div>
                    <input
                        type="range"
                        min="7"
                        max="365"
                        step="1"
                        value={duration}
                        onChange={handleDurationChange}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                        aria-label="Project Duration"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mt-2">
                        <span>1 Week</span>
                        <span>1 Year</span>
                    </div>
                </div>
            </div>

            {/* Timeline Container */}
            <div className="bg-[#1a1d29]/60 backdrop-blur-xl rounded-[32px] border border-white/5 p-8 overflow-hidden shadow-2xl relative">
                {/* Time Axis */}
                <div className="mb-8">
                    <div className="relative h-10 border-b border-white/10">
                        {Array.from({ length: gridDivisions }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-0 h-full flex flex-col items-center justify-end text-[10px] font-black text-slate-500 uppercase tracking-wider"
                                style={{ left: `${(i / gridDivisions) * 100}%`, width: `${100 / gridDivisions}%` }}
                            >
                                <span className="mb-2">{getTimeLabel(i)}</span>
                                <div className="w-px h-2 bg-white/20" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phase Tracks */}
                <div ref={timelineRef} className="relative min-h-[300px] space-y-4">
                    {/* Grid lines */}
                    <div className="absolute inset-0 pointer-events-none">
                        {Array.from({ length: gridDivisions + 1 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-0 bottom-0 w-px bg-white/5"
                                style={{ left: `${(i / gridDivisions) * 100}%` }}
                            />
                        ))}
                    </div>

                    {/* Phase Bars */}
                    {phases.map((phase, index) => {
                        const left = dayToPercent(phase.startDay);
                        const width = dayToPercent(phase.duration);

                        return (
                            <div
                                key={phase.id}
                                className="relative h-20"
                                style={{ zIndex: draggedPhase === phase.id ? 50 : 10 + index }}
                            >
                                <div
                                    className={cn(
                                        "absolute top-0 h-full rounded-2xl flex items-center px-5 gap-4 transition-all duration-200 cursor-move group border-y-2 border-x",
                                        draggedPhase === phase.id
                                            ? "shadow-[0_10px_40px_rgba(0,0,0,0.5)] scale-[1.02] border-white/40 z-50 ring-2 ring-purple-500/50"
                                            : "border-transparent border-t-white/10 hover:border-white/20 hover:shadow-2xl"
                                    )}
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`,
                                        background: phase.color,
                                    }}
                                    onMouseDown={(e) => handlePhaseMouseDown(phase.id, e)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                                        <GripVertical size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="font-black text-white text-sm truncate uppercase tracking-wide drop-shadow-md">{phase.name}</div>
                                        <div className="text-[10px] font-bold text-white/80 uppercase tracking-widest bg-black/20 self-start px-2 py-0.5 rounded-md mt-1">
                                            {phase.duration} Days
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Default phase configurations
export const DEFAULT_PHASES: Phase[] = [
    {
        id: 'dev',
        name: 'Development',
        startDay: 0,
        duration: 21,
        color: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    },
    {
        id: 'pre',
        name: 'Pre-Production',
        startDay: 21,
        duration: 35,
        color: 'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)',
    },
    {
        id: 'prod',
        name: 'Production',
        startDay: 56,
        duration: 14,
        color: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
    },
    {
        id: 'post',
        name: 'Post-Production',
        startDay: 70,
        duration: 42,
        color: 'linear-gradient(135deg, #ea580c 0%, #db2777 100%)',
    },
];
