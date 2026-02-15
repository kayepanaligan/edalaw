<?php

namespace App\Services;

use App\Models\ChatExport;
use App\Models\VisitSession;
use Barryvdh\DomPDF\Facade\Pdf as PdfFacade;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;

class ChatExportService
{
    public function __construct(
        private string $disk = 'local'
    ) {
        $this->disk = config('filesystems.chat_exports_disk', config('filesystems.default'));
    }

    /**
     * Export session chat to PDF or DOCX; store on disk and create ChatExport record.
     */
    public function export(VisitSession $session, string $format, int $generatedBy): ChatExport
    {
        $format = strtolower($format);
        if (! in_array($format, ['pdf', 'docx'], true)) {
            throw new \InvalidArgumentException('Format must be pdf or docx.');
        }

        $session->load('chatLogs');
        $path = sprintf('chat-exports/%s/%s.%s', $session->id, Str::uuid(), $format);

        if ($format === 'pdf') {
            $this->generatePdf($session, $path);
        } else {
            $this->generateDocx($session, $path);
        }

        return ChatExport::create([
            'visit_session_id' => $session->id,
            'file_path' => $path,
            'format' => $format,
            'generated_by' => $generatedBy,
        ]);
    }

    private function generatePdf(VisitSession $session, string $path): void
    {
        $html = view('exports.chat-pdf', [
            'session' => $session,
            'messages' => $session->chatLogs,
        ])->render();

        $pdf = PdfFacade::loadHTML($html);
        $content = $pdf->output();

        Storage::disk($this->disk)->put($path, $content);
    }

    private function generateDocx(VisitSession $session, string $path): void
    {
        $phpWord = new PhpWord;
        $section = $phpWord->addSection();

        $section->addTitle('Chat export – Session #'.$session->id, 1);
        $section->addTextBreak(1);

        foreach ($session->chatLogs as $log) {
            $sender = $log->sender.($log->sent_at ? ' ('.$log->sent_at->format('Y-m-d H:i:s').')' : '');
            $section->addText($sender, ['bold' => true]);
            $section->addText($log->message);
            if ($log->flagged) {
                $section->addText('[Flagged: '.($log->flag_reason ?? 'N/A').']', ['italic' => true, 'color' => 'cc0000']);
            }
            $section->addTextBreak(1);
        }

        $tmpFile = tempnam(sys_get_temp_dir(), 'chat_').'.docx';
        $writer = IOFactory::createWriter($phpWord, 'Word2007');
        $writer->save($tmpFile);

        Storage::disk($this->disk)->put($path, file_get_contents($tmpFile));
        @unlink($tmpFile);
    }
}
