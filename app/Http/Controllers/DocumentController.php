<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    /**
     * Serve user ID documents (for Super Admin only).
     */
    public function serveUserIdDocument(string $path): StreamedResponse
    {
        // Only allow super admins
        if (!Auth::check() || !Auth::user()->role || Auth::user()->role->slug !== 'super_admin') {
            abort(403, 'Unauthorized access to user documents.');
        }

        // Sanitize path to prevent directory traversal
        $path = str_replace(['..', '\\'], ['', '/'], $path);
        $path = trim($path, '/');
        
        // Ensure path is within users directory
        if (!str_starts_with($path, 'users/')) {
            abort(404, 'Document not found.');
        }

        // Check if file exists
        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'Document not found.');
        }

        // Get file contents
        $file = Storage::disk('public')->get($path);
        $mimeType = Storage::disk('public')->mimeType($path);

        return response()->stream(function () use ($file) {
            echo $file;
        }, 200, [
            'Content-Type' => $mimeType ?: 'application/octet-stream',
            'Content-Disposition' => 'inline; filename="'.basename($path).'"',
        ]);
    }

    /**
     * Serve visit supporting documents (for Jail Officers and BJMP Officers).
     */
    public function serveVisitDocument(string $path): StreamedResponse
    {
        $user = Auth::user();
        
        // Only allow jail officers and bjmp officers
        if (!$user || !$user->role || !in_array($user->role->slug, ['jail_officer', 'bjmp_officer'])) {
            abort(403, 'Unauthorized access to visit documents.');
        }

        // Sanitize path to prevent directory traversal
        $path = str_replace(['..', '\\'], ['', '/'], $path);
        $path = trim($path, '/');
        
        // Ensure path is within visits directory
        if (!str_starts_with($path, 'visits/')) {
            abort(404, 'Document not found.');
        }

        // Check if file exists
        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'Document not found.');
        }

        // Get file contents
        $file = Storage::disk('public')->get($path);
        $mimeType = Storage::disk('public')->mimeType($path);

        return response()->stream(function () use ($file) {
            echo $file;
        }, 200, [
            'Content-Type' => $mimeType ?: 'application/octet-stream',
            'Content-Disposition' => 'inline; filename="'.basename($path).'"',
        ]);
    }
}
