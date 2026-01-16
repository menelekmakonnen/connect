// ICUNI Connect - Core Type Definitions

// ============ Enums ============

export type AccountType = 'talent' | 'pm' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';
export type City = 'Accra' | 'Kumasi' | 'Tema' | 'Takoradi' | 'Other';
export type VerificationLevel = 'unverified' | 'profile_verified' | 'work_verified' | 'pro_verified';
export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';
export type RateVisibility = 'hidden' | 'range_public' | 'exact_private';
export type RateType = 'hourly' | 'half_day' | 'day' | 'per_project' | 'package';
export type ProjectType = 'music_video' | 'brand_shoot' | 'short_film' | 'doc' | 'event' | 'other';
export type ProjectStatus = 'draft' | 'staffing' | 'requests_sent' | 'locked' | 'booked' | 'completed' | 'cancelled';
export type BudgetTier = 'low' | 'mid' | 'premium';
export type SlotPriority = 'must_have' | 'nice_to_have';
export type SlotStatus = 'open' | 'filled' | 'cancelled';
export type LineupStatus = 'shortlisted' | 'invited' | 'accepted' | 'declined' | 'negotiating' | 'locked' | 'removed';
export type RequestStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'question' | 'countered' | 'expired' | 'cancelled';
export type ResponseType = 'accept' | 'decline' | 'question' | 'counter';
export type LinkType = 'instagram' | 'tiktok' | 'youtube' | 'vimeo' | 'behance' | 'website' | 'linkedin' | 'drive_folder' | 'google_photos' | 'other';
export type RoleCategory = 'Cast' | 'Production' | 'Camera' | 'Sound' | 'Lighting/Grip' | 'Art/Wardrobe' | 'HairMakeup' | 'Post' | 'Stills' | 'Services' | 'Other';

// ============ Core Entities ============

export interface User {
    user_id: string;
    email: string;
    display_name: string;
    phone?: string;
    account_type: AccountType;
    status: UserStatus;
    created_at: string;
    last_login_at?: string;
    timezone: string;
    preferred_channel: 'email' | 'telegram' | 'whatsapp';
}

export interface Role {
    role_id: string;
    role_name: string;
    role_category: RoleCategory;
    search_terms: string;
    active: boolean;
}

export interface RoleAlias {
    alias_id: string;
    alias_text: string;
    role_id: string;
    weight: number;
}

export interface Talent {
    talent_id: string;
    user_id?: string;
    public_slug: string;
    display_name: string;
    headline?: string;
    bio?: string;
    city: City;
    neighborhood?: string;
    languages: string[];
    roles_primary: string[]; // role_ids
    roles_secondary: string[];
    roles?: Role[]; // Enriched role objects for display
    verification_level: VerificationLevel;
    availability_status: AvailabilityStatus;
    availability_notes?: string;
    profile_photo_file_id?: string;
    // Enriched/Computed fields
    avatar_url?: string;
    profile_photo_url?: string; // Alias
    day_rate_min?: number;
    day_rate_max?: number;

    portfolio_folder_id?: string;
    featured: boolean;
    tags_style: string[];
    created_at: string;
    updated_at: string;
    // Enriched relations
    links?: TalentLink[];
    rates?: TalentRate[];
}

export interface TalentLink {
    link_id: string;
    talent_id: string;
    link_type: LinkType;
    label?: string;
    url: string;
    is_primary: boolean;
    created_at: string;
}

export interface TalentRate {
    rate_id: string;
    talent_id: string;
    rate_visibility: RateVisibility;
    rate_type: RateType;
    currency: string;
    amount_min?: number;
    amount_max?: number;
    amount_exact?: number;
    includes?: string;
    overtime_policy?: string;
    usage_policy?: string;
    cancellation_policy?: string;
    updated_at: string;
}

export interface RoleSlot {
    slot_id: string;
    project_id: string;
    role_id: string;
    qty: number;
    // Enriched fields from Role
    role_name: string;
    role_category: RoleCategory;

    requirements?: string;
    target_fee?: number;
    currency: string;
    priority: SlotPriority;
    status: SlotStatus;
    // Enriched field: Assigned talents
    assigned?: LineupEntry[];
}

export interface Project {
    project_id: string;
    owner_user_id: string;
    title: string;
    type: ProjectType;
    status: ProjectStatus;
    start_date?: string;
    end_date?: string;
    location_city?: string;
    location_notes?: string;
    brief?: string;
    references_links: string[];
    budget_tier: BudgetTier;
    client_name?: string;
    public_private: 'public' | 'private';
    created_at: string;
    updated_at: string;
    // Enriched fields
    role_slots: RoleSlot[];
}

export interface LineupEntry {
    lineup_id: string;
    project_id: string;
    slot_id: string;
    talent_id: string;
    assigned_role_label?: string;
    offer_fee?: number;
    currency: string;
    deliverables?: string;
    notes_private?: string;
    status: LineupStatus;
    created_at: string;
    updated_at: string;
}

export interface Request {
    request_id: string;
    project_id: string;
    slot_id: string;
    talent_id: string;
    lineup_id: string;
    sent_by_user_id: string;
    offer_fee?: number;
    currency: string;
    message?: string;
    status: RequestStatus;
    sent_at?: string;
    viewed_at?: string;
    responded_at?: string;
    response_type?: ResponseType;
    response_text?: string;
    counter_fee?: number;
    expires_at?: string;
}

// ============ UI / Display Types ============

export interface TalentCard {
    talent_id: string;
    public_slug: string;
    display_name: string;
    headline?: string;
    city: City;
    roles?: Role[]; // Optional - may be undefined in API response
    verification_level: VerificationLevel;
    availability_status: AvailabilityStatus;
    profile_photo_url?: string;
    rate_range?: { min: number; max: number; currency: string };
    featured: boolean;
    tags_style: string[];
}

export interface ProjectSummary {
    project_id: string;
    title: string;
    type: ProjectType;
    status: ProjectStatus;
    start_date?: string;
    location_city?: string;
    budget_tier: BudgetTier;
    public_private: 'public' | 'private';
    slots_count: number;
    lineup_count: number;
    pending_requests: number;
    created_at: string;
    updated_at: string;
}

export interface RequestInboxItem {
    request_id: string;
    project_title: string;
    project_type: ProjectType;
    role_name: string;
    offer_fee?: number;
    currency: string;
    start_date?: string;
    location_city?: string;
    sent_at: string;
    status: RequestStatus;
    pm_name: string;
    team_preview: string[]; // Names of other confirmed talent
}

// ============ API Response Types ============

export interface ApiResponse<T> {
    ok: boolean;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    has_more: boolean;
}

// ============ Search / Filter Types ============

export interface TalentSearchFilters {
    q?: string;
    roles?: string[];
    city?: City;
    availability?: AvailabilityStatus;
    budget_tier?: BudgetTier;
    verified_only?: boolean;
    featured_only?: boolean;
    tags_style?: string[];
}

export interface ProjectFilters {
    status?: ProjectStatus;
    type?: ProjectType;
    budget_tier?: BudgetTier;
    public_private?: 'public' | 'private';
}
