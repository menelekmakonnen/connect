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
}

interface ProductionGanttProps {
    totalDuration: number; // Total project duration in days
    phases: Phase[];
    onPhasesChange?: (phases: Phase[]) => void;
    onDurationChange?: (duration: number) => void;
    className?: string;
}

export function ProductionGantt({
    totalDuration,
    phases: initialPhases,
    onPhasesChange,
    onDurationChange,
    className
}: ProductionGanttProps) {
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
        onDurationChange?.(newDuration);
    };

    // Determine time scale based on duration
    const getTimeScale = () => {
        if (duration <= 35) return 'days'; // Show days for up to 5 weeks
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

    // Convert days to grid position percentage
    const dayToPercent = (day: number) => {
        return (day / duration) * 100;
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
        <div className={cn("w-full bg-[#1a1d29]/60 backdrop-blur-xl rounded-[32px] border border-white/5 p-8 shadow-2xl", className)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Production Pipeline</h3>
                    <p className="text-slate-400 font-medium">
                        Interactive Gantt Chart. Overlap phases to accelerate delivery.
                    </p>
                </div>

                {/* Duration Slider */}
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
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-0 border border-white/10 rounded-2xl overflow-hidden bg-[#151720]">
                {/* Sidebar - Phase Names */}
                <div className="hidden lg:block w-48 bg-[#1e2130] border-r border-white/10 shrink-0">
                    <div className="h-10 border-b border-white/10 bg-[#1a1d29]" /> {/* Header spacer */}
                    {phases.map(phase => (
                        <div key={phase.id} className="h-16 flex items-center px-6 border-b border-white/5 last:border-0">
                            <span className="text-xs font-black text-white uppercase tracking-wider">{phase.name}</span>
                        </div>
                    ))}
                </div>

                {/* Timeline Graph */}
                <div className="flex-1 overflow-x-auto relative">
                    {/* Time Axis Header */}
                    <div className="h-10 border-b border-white/10 relative bg-[#1a1d29] min-w-full" style={{ width: '100%' }}>
                        {Array.from({ length: gridDivisions }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-0 h-full flex flex-col items-center justify-end text-[10px] font-black text-slate-500 uppercase"
                                style={{ left: `${(i / gridDivisions) * 100}%`, width: `${100 / gridDivisions}%` }}
                            >
                                <span className="mb-2">{getTimeLabel(i)}</span>
                                <div className="w-px h-2 bg-white/20" />
                            </div>
                        ))}
                    </div>

                    {/* Tracks Area */}
                    <div ref={timelineRef} className="relative min-w-full">
                        {/* Vertical Grid Lines */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            {Array.from({ length: gridDivisions + 1 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute top-0 bottom-0 w-px bg-white/5"
                                    style={{ left: `${(i / gridDivisions) * 100}%` }}
                                />
                            ))}
                        </div>

                        {/* Phase Rows */}
                        {phases.map((phase) => (
                            <div key={phase.id} className="h-16 relative border-b border-white/5 last:border-0 z-10 w-full group">
                                {/* Mobile Label (Visible only on small screens) */}
                                <div className="lg:hidden absolute left-2 top-1 text-[9px] font-bold text-slate-500 uppercase pointer-events-none z-20">
                                    {phase.name}
                                </div>

                                {/* Draggable Bar */}
                                <div
                                    className={cn(
                                        "absolute top-3 bottom-3 rounded-lg flex items-center px-3 gap-2 transition-all duration-200 cursor-move border shadow-sm",
                                        draggedPhase === phase.id
                                            ? "shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-[1.02] border-white/40 z-50 ring-1 ring-white/50"
                                            : "border-transparent border-t-white/10 hover:border-white/20 hover:shadow-lg"
                                    )}
                                    style={{
                                        left: `${dayToPercent(phase.startDay)}%`,
                                        width: `${dayToPercent(phase.duration)}%`,
                                        background: phase.color,
                                    }}
                                    onMouseDown={(e) => handlePhaseMouseDown(phase.id, e)}
                                >
                                    <div className="w-1 h-4 rounded-full bg-black/20" /> {/* Grip handle */}

                                    <div className="text-[9px] font-bold text-white/90 uppercase tracking-wider drop-shadow-md truncate">
                                        {phase.duration}d
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
        startDay: 10,
        duration: 35,
        color: 'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)',
    },
    {
        id: 'prod',
        name: 'Production',
        startDay: 40,
        duration: 14,
        color: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
    },
    {
        id: 'post',
        name: 'Post-Production',
        startDay: 50,
        duration: 42,
        color: 'linear-gradient(135deg, #ea580c 0%, #db2777 100%)',
    },
];
