
import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// CONFIGURATION
// ============================================================================

// DISABLE MOCK MODE - Backend is now working!
const MOCK_MODE = false;

// The deployed Apps Script Web App URL (base URL without /api)
// We'll pass the path as ?path=/api/talents instead of /exec/api/talents
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfTsG6zs5KaxdO5FL0_Yr_lSadFOPi6CYedwfLkNOzReyHvH_4TG37Ou0dB9YnRbl5/exec';

// ============================================================================
// ROUTE HANDLERS (Next.js 15+ Compatible)
// ============================================================================

export async function GET(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    return handleRequest(request, params.path);
}

export async function POST(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    return handleRequest(request, params.path);
}

export async function PUT(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    return handleRequest(request, params.path);
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    return handleRequest(request, params.path);
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    const params = await props.params;
    return handleRequest(request, params.path);
}

// ============================================================================
// MAIN DISPATCHER
// ============================================================================

async function handleRequest(request: NextRequest, pathSegments: string[]) {
    // 1. Reconstruct path
    const path = '/' + pathSegments.join('/');
    console.log(`[Proxy] ${request.method} ${path} (Mock Mode: ${MOCK_MODE})`);

    // 2. Mock Mode Intercept
    if (MOCK_MODE) {
        return handleMockRequest(request, pathSegments);
    }

    // 3. Real Backend Proxy
    return handleRealProxy(request, path, pathSegments);
}

// ============================================================================
// MOCK DATA HANDLER
// ============================================================================

async function handleMockRequest(request: NextRequest, pathSegments: string[]) {
    const resource = pathSegments[0]; // 'talents', 'projects', etc.
    const id = pathSegments[1];

    // DELAY SIMULATION (simulate network latency)
    await new Promise(resolve => setTimeout(resolve, 600));

    // --- TALENTS ---
    if (resource === 'talents') {
        // GET /talents (Search/List)
        if (!id && request.method === 'GET') {
            return response(MOCK_TALENTS_RESPONSE);
        }
        // GET /talents/:id (Profile)
        if (id && request.method === 'GET') {
            // Find specific talent or default to first
            const talent = MOCK_TALENTS_RESPONSE.data.items.find(t => t.talent_id === id) || MOCK_TALENTS_RESPONSE.data.items[0];
            return response({ ok: true, data: talent });
        }
    }

    // --- PROJECTS ---
    if (resource === 'projects') {
        if (!id && request.method === 'GET') {
            return response(MOCK_PROJECTS_RESPONSE);
        }
    }

    // Fallback for unknown mocks
    return response({ ok: false, error: 'Endpoint not mocked yet' }, 404);
}

function response(data: any, status = 200) {
    return NextResponse.json(data, { status });
}

// ============================================================================
// REAL PROXY LOGIC (Legacy)
// ============================================================================

async function handleRealProxy(request: NextRequest, path: string, pathSegments: string[]) {
    try {
        // CRITICAL: Google Apps Script doesn't support URL path segments after /exec
        // We must pass the path as a query parameter: ?path=/api/talents
        const url = new URL(APPS_SCRIPT_URL);

        // Add the path as a query parameter
        // IMPORTANT: The path needs to include '/api' prefix because our Router expects it
        // but Next.js route /api/proxy/[...path] strips it from pathSegments
        const fullPath = '/api' + path;
        url.searchParams.append('path', fullPath);

        // Copy all other query parameters from the original request
        request.nextUrl.searchParams.forEach((value, key) => {
            url.searchParams.append(key, value);
        });

        // Prep headers
        const headers = new Headers();
        const authHeader = request.headers.get('authorization');
        if (authHeader) url.searchParams.append('authorization', authHeader);
        headers.set('Content-Type', 'text/plain;charset=utf-8');

        const fetchOptions: RequestInit = {
            method: request.method,
            headers: headers,
            redirect: 'follow',
        };

        if (request.method !== 'GET' && request.method !== 'HEAD') {
            fetchOptions.body = await request.text();
        }

        console.log(`[Proxy] Forwarding to Apps Script: ${url.toString().substring(0, 150)}...`);

        const response = await fetch(url.toString(), fetchOptions);
        const responseData = await response.text();

        try {
            const json = JSON.parse(responseData);
            console.log(`[Proxy] ✅ Received valid JSON from backend`);
            return NextResponse.json(json, { status: 200 });
        } catch (e) {
            console.error('[Proxy] ❌ Received non-JSON:', responseData.substring(0, 500));
            return new NextResponse(responseData, {
                status: response.status,
                headers: { 'Content-Type': 'text/html' }
            });
        }
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: `Proxy Error: ${error.message}` },
            { status: 500 }
        );
    }
}

// ============================================================================
// MOCK DATA STORE
// ============================================================================

const MOCK_TALENTS_RESPONSE = {
    ok: true,
    data: {
        total: 6,
        page: 1,
        per_page: 20,
        has_more: false,
        items: [
            {
                talent_id: 'TLNT_MOCK_01',
                public_slug: 'kwame-mensah',
                display_name: 'Kwame Mensah',
                headline: 'Award-Winning Cinematographer',
                city: 'Accra',
                roles: [{ role_name: 'Director of Photography', role_category: 'Camera' }],
                verification_level: 'pro_verified',
                availability_status: 'available',
                featured: true,
                tags_style: ['Cinematic', 'Documentary', 'Commercial'],
                rate_range: { min: 3000, max: 5000, currency: 'GHS' }
            },
            {
                talent_id: 'TLNT_MOCK_02',
                public_slug: 'ama-darko',
                display_name: 'Ama Darko',
                headline: 'Professional MUA for Film & TV',
                city: 'Accra',
                roles: [{ role_name: 'Makeup Artist', role_category: 'HairMakeup' }],
                verification_level: 'work_verified',
                availability_status: 'limited',
                featured: false,
                tags_style: ['SFX', 'Glam', 'Natural'],
                rate_range: { min: 1500, max: 2500, currency: 'GHS' }
            },
            {
                talent_id: 'TLNT_MOCK_03',
                public_slug: 'kofi-antwi',
                display_name: 'Kofi Antwi',
                headline: 'Gaffer / Lighting Best Boy',
                city: 'Kumasi',
                roles: [{ role_name: 'Gaffer', role_category: 'Lighting/Grip' }],
                verification_level: 'profile_verified',
                availability_status: 'available',
                featured: false,
                tags_style: ['Studio', 'Location', 'Night Shoots'],
                rate_range: { min: 1200, max: 2000, currency: 'GHS' }
            },
            {
                talent_id: 'TLNT_MOCK_04',
                public_slug: 'adwoa-smart',
                display_name: 'Adwoa Smart',
                headline: 'Production Manager',
                city: 'Accra',
                roles: [{ role_name: 'Production Manager', role_category: 'Production' }],
                verification_level: 'unverified',
                availability_status: 'unavailable',
                featured: false,
                tags_style: ['Logistics', 'Budgeting'],
                rate_range: { min: 500, max: 800, currency: 'USD' } // USD Example
            },
            {
                talent_id: 'TLNT_MOCK_05',
                public_slug: 'yaw-b',
                display_name: 'Yaw B. Rock',
                headline: 'Sound Recordist & Mixer',
                city: 'Tema',
                roles: [{ role_name: 'Sound Mixer', role_category: 'Sound' }],
                verification_level: 'work_verified',
                availability_status: 'available',
                featured: true,
                tags_style: ['Field Recording', 'Boom Op'],
                rate_range: { min: 2000, max: 3500, currency: 'GHS' }
            },
            {
                talent_id: 'TLNT_MOCK_06',
                public_slug: 'elorm-art',
                display_name: 'Elorm Artistry',
                headline: 'Art Director',
                city: 'Other',
                roles: [{ role_name: 'Art Director', role_category: 'Art/Wardrobe' }],
                verification_level: 'profile_verified',
                availability_status: 'available',
                featured: false,
                tags_style: ['Set Design', 'Prop Master'],
                rate_range: { min: 2500, max: 4000, currency: 'GHS' }
            }
        ]
    }
};

const MOCK_PROJECTS_RESPONSE = {
    ok: true,
    data: {
        total: 2,
        items: [
            {
                project_id: 'PRJ_MOCK_01',
                title: 'Summer Vibes Commercial',
                type: 'brand_shoot',
                status: 'staffing',
                start_date: '2024-02-15',
                location_city: 'Accra',
                budget_tier: 'premium',
                slots_count: 5,
                lineup_count: 2,
                pending_requests: 1
            },
            {
                project_id: 'PRJ_MOCK_02',
                title: 'Indie Short Film "Echoes"',
                type: 'short_film',
                status: 'draft',
                start_date: '2024-03-01',
                budget_tier: 'low',
                slots_count: 8,
                lineup_count: 0,
                pending_requests: 0
            }
        ]
    }
};

