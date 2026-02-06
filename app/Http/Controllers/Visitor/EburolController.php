<?php

namespace App\Http\Controllers\Visitor;

use App\EburolStatus;
use App\Http\Controllers\Controller;
use App\Models\Eburol;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class EburolController extends Controller
{
    /**
     * Display the e-burol management page.
     */
    public function index(): Response
    {
        $eburols = Eburol::where('user_id', auth()->id())
            ->orderBy('wake_start_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($eburol) {
                return [
                    'id' => $eburol->id,
                    'inmate_first_name' => $eburol->inmate_first_name,
                    'inmate_middle_name' => $eburol->inmate_middle_name,
                    'inmate_last_name' => $eburol->inmate_last_name,
                    'deceased_first_name' => $eburol->deceased_first_name,
                    'deceased_middle_name' => $eburol->deceased_middle_name,
                    'deceased_last_name' => $eburol->deceased_last_name,
                    'deceased_date_of_death' => $eburol->deceased_date_of_death->format('Y-m-d'),
                    'relationship_to_inmate' => $eburol->relationship_to_inmate,
                    'wake_start_date' => $eburol->wake_start_date->format('Y-m-d'),
                    'wake_end_date' => $eburol->wake_end_date->format('Y-m-d'),
                    'preferred_time' => $eburol->preferred_time,
                    'wake_location' => $eburol->wake_location,
                    'additional_details' => $eburol->additional_details,
                    'death_certificate_path' => $eburol->death_certificate_path ? Storage::disk('public')->url($eburol->death_certificate_path) : null,
                    'relationship_proof_path' => $eburol->relationship_proof_path ? Storage::disk('public')->url($eburol->relationship_proof_path) : null,
                    'status' => $eburol->status->value,
                    'admin_notes' => $eburol->admin_notes,
                    'created_at' => $eburol->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Visitor/EburolManagement', [
            'eburols' => $eburols,
        ]);
    }

    /**
     * Store a new e-burol request.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'inmate_first_name' => ['required', 'string', 'max:255'],
            'inmate_middle_name' => ['nullable', 'string', 'max:255'],
            'inmate_last_name' => ['required', 'string', 'max:255'],
            'deceased_first_name' => ['required', 'string', 'max:255'],
            'deceased_middle_name' => ['nullable', 'string', 'max:255'],
            'deceased_last_name' => ['required', 'string', 'max:255'],
            'deceased_date_of_death' => ['required', 'date', 'before_or_equal:today'],
            'relationship_to_inmate' => ['required', 'string', 'max:255'],
            'wake_start_date' => ['required', 'date', 'after_or_equal:today'],
            'wake_end_date' => ['required', 'date', 'after_or_equal:wake_start_date'],
            'preferred_time' => ['nullable', 'date_format:H:i'],
            'wake_location' => ['required', 'string', 'max:500'],
            'additional_details' => ['nullable', 'string', 'max:2000'],
            'death_certificate' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'], // 10MB max
            'relationship_proof' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'], // 10MB max
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Store uploaded files
        $deathCertificatePath = null;
        $relationshipProofPath = null;

        if ($request->hasFile('death_certificate')) {
            $deathCertificatePath = $request->file('death_certificate')->store('eburols/death_certificates', 'public');
        }

        if ($request->hasFile('relationship_proof')) {
            $relationshipProofPath = $request->file('relationship_proof')->store('eburols/relationship_proofs', 'public');
        }

        $eburol = Eburol::create([
            'user_id' => auth()->id(),
            'inmate_first_name' => $request->inmate_first_name,
            'inmate_middle_name' => $request->inmate_middle_name,
            'inmate_last_name' => $request->inmate_last_name,
            'deceased_first_name' => $request->deceased_first_name,
            'deceased_middle_name' => $request->deceased_middle_name,
            'deceased_last_name' => $request->deceased_last_name,
            'deceased_date_of_death' => $request->deceased_date_of_death,
            'relationship_to_inmate' => $request->relationship_to_inmate,
            'wake_start_date' => $request->wake_start_date,
            'wake_end_date' => $request->wake_end_date,
            'preferred_time' => $request->preferred_time,
            'wake_location' => $request->wake_location,
            'additional_details' => $request->additional_details,
            'death_certificate_path' => $deathCertificatePath,
            'relationship_proof_path' => $relationshipProofPath,
            'status' => EburolStatus::Pending,
        ]);

        // Create notification that application was received
        NotificationService::createEburolSubmittedNotification($eburol);
        NotificationService::notifySuperAdminsAboutEburol($eburol);

        return redirect()->back()->with('success', 'E-burol application submitted successfully. Your application has been sent to the BJMP officer for review. Please wait for approval.');
    }

    /**
     * Show a specific e-burol request.
     */
    public function show(Eburol $eburol): Response
    {
        // Ensure the eburol belongs to the authenticated user
        if ($eburol->user_id !== auth()->id()) {
            abort(403);
        }

        $eburolData = [
            'id' => $eburol->id,
            'inmate_first_name' => $eburol->inmate_first_name,
            'inmate_middle_name' => $eburol->inmate_middle_name,
            'inmate_last_name' => $eburol->inmate_last_name,
            'deceased_first_name' => $eburol->deceased_first_name,
            'deceased_middle_name' => $eburol->deceased_middle_name,
            'deceased_last_name' => $eburol->deceased_last_name,
            'deceased_date_of_death' => $eburol->deceased_date_of_death->format('Y-m-d'),
            'relationship_to_inmate' => $eburol->relationship_to_inmate,
            'wake_start_date' => $eburol->wake_start_date->format('Y-m-d'),
            'wake_end_date' => $eburol->wake_end_date->format('Y-m-d'),
            'preferred_time' => $eburol->preferred_time,
            'wake_location' => $eburol->wake_location,
            'additional_details' => $eburol->additional_details,
            'death_certificate_path' => $eburol->death_certificate_path ? Storage::url($eburol->death_certificate_path) : null,
            'relationship_proof_path' => $eburol->relationship_proof_path ? Storage::url($eburol->relationship_proof_path) : null,
            'status' => $eburol->status->value,
            'admin_notes' => $eburol->admin_notes,
            'created_at' => $eburol->created_at->format('Y-m-d H:i:s'),
        ];

        return Inertia::render('Visitor/EburolShow', [
            'eburol' => $eburolData,
        ]);
    }
}
