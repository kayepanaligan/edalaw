<?php

namespace App\Http\Controllers\BjmpOfficer;

use App\Http\Controllers\Controller;
use App\Models\Cell;
use App\Models\CellScheduleTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CellManagementController extends Controller
{
    /**
     * Display a listing of cells.
     */
    public function index(Request $request): Response
    {
        $query = Cell::withCount(['inmates' => function ($q) {
            $q->where('status', 'active');
        }]);

        // Search filter
        if ($search = $request->input('search')) {
            $query->where('cell_number', 'like', "%{$search}%");
        }

        // Status filter
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $cells = $query->orderBy('cell_number')->paginate(10)->withQueryString();

        return Inertia::render('BjmpOfficer/CellManagement', [
            'cells' => $cells,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    /**
     * Store a newly created cell.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cell_number' => 'required|string|max:50|unique:cells',
            'capacity' => 'required|integer|min:1|max:50',
            'status' => 'required|in:active,inactive',
        ]);

        $cell = Cell::create($validated);

        // Initialize schedule templates for the new cell
        CellScheduleTemplate::initializeForCell($cell->id);

        return redirect()->back()->with('success', 'Cell created successfully.');
    }

    /**
     * Update the specified cell.
     */
    public function update(Request $request, Cell $cell)
    {
        $validated = $request->validate([
            'cell_number' => 'required|string|max:50|unique:cells,cell_number,' . $cell->id,
            'capacity' => 'required|integer|min:1|max:50',
            'status' => 'required|in:active,inactive',
        ]);

        // Check if capacity is being reduced below current inmates
        if ($validated['capacity'] < $cell->current_inmates_count) {
            return redirect()->back()->with('error', 'Cannot reduce capacity below current number of inmates.');
        }

        $cell->update($validated);

        return redirect()->back()->with('success', 'Cell updated successfully.');
    }

    /**
     * Remove the specified cell.
     */
    public function destroy(Cell $cell)
    {
        // Check if cell has inmates
        if ($cell->inmates()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete cell with assigned inmates. Please transfer inmates first.');
        }

        $cell->delete();

        return redirect()->back()->with('success', 'Cell deleted successfully.');
    }
}
