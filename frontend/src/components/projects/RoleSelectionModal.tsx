'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Select, Card } from '@/components/ui';
import type { TalentCard, Role } from '@/lib/types';

interface RoleSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    talent: TalentCard;
    onConfirm: (roleId?: string) => void;
    projectRoles?: Role[]; // Available roles in the project
}

export function RoleSelectionModal({
    isOpen,
    onClose,
    talent,
    onConfirm,
    projectRoles = []
}: RoleSelectionModalProps) {
    const [selectedRole, setSelectedRole] = useState<string>('');

    if (!isOpen) return null;

    // Filter project roles to only show ones matching talent's skills
    const matchingRoles = projectRoles.filter(role =>
        (talent.roles || []).some(talentRole => talentRole.role_id === role.role_id)
    );

    const handleConfirm = () => {
        onConfirm(selectedRole || undefined);
        setSelectedRole('');
        onClose();
    };

    const handleSkip = () => {
        onConfirm(undefined);
        setSelectedRole('');
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                <Card className="w-full max-w-md bg-[#1a1d29] border-white/10 shadow-2xl pointer-events-auto animate-in zoom-in-95 fade-in duration-200">
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-white/5">
                        <div>
                            <h3 className="text-xl font-bold text-white">Assign Role</h3>
                            <p className="text-sm text-slate-400 mt-1">
                                Adding <span className="text-white font-medium">{talent.display_name}</span> to project
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Talent Skills Summary */}
                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                                Confirmed Skills
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(talent.roles) && talent.roles.map(role => (
                                    <span
                                        key={role.role_id}
                                        className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/20"
                                    >
                                        {role.role_name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Select Primary Role
                            </label>

                            {/* Logic: If projectRoles exist, allow only matching. If NO projectRoles (Draft), allow picking any of usage skills */}
                            {projectRoles.length === 0 ? (
                                <>
                                    <Select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full bg-[#0f1117] border-white/10"
                                        title="Select role"
                                    >
                                        <option value="">Select a role...</option>
                                        {Array.isArray(talent.roles) && talent.roles.map(role => (
                                            <option key={role.role_id} value={role.role_name}>
                                                {role.role_name}
                                            </option>
                                        ))}
                                    </Select>
                                    <p className="text-xs text-slate-500 mt-2">
                                        💡 Creating a new project? Select one of their verified skills to assign as their role.
                                    </p>
                                </>
                            ) : matchingRoles.length > 0 ? (
                                <>
                                    <Select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full bg-[#0f1117] border-white/10"
                                        title="Select role"
                                    >
                                        <option value="">Choose a project role...</option>
                                        {Array.isArray(matchingRoles) && matchingRoles.map(role => (
                                            <option key={role.role_id} value={role.role_id}>
                                                {role.role_name}
                                            </option>
                                        ))}
                                    </Select>
                                    <p className="text-xs text-slate-500 mt-2">
                                        💡 Only showing project roles that match this talent's skills.
                                    </p>
                                </>
                            ) : (
                                <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-sm text-yellow-400">
                                    No open roles in this project match this talent's skills.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t border-white/5">
                        <Button
                            onClick={handleSkip}
                            variant="secondary"
                            className="flex-1"
                        >
                            Skip for Now
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            className="flex-1 btn-gradient"
                            disabled={
                                (projectRoles.length === 0 && !selectedRole) || // Require selection in draft mode? Or allow generic add? User said "need to allocate... or skip for later".
                                (projectRoles.length > 0 && matchingRoles.length > 0 && !selectedRole) // Require selection if matching roles exist
                            }
                        >
                            Add to Project
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
}
