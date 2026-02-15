import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button';

type VisitProofData = {
    id: number;
    visitor_name: string;
    visitor_email: string;
    inmate_name: string;
    scheduled_date: string;
    scheduled_time: string | null;
    access_key: string | null;
    access_key_expires_at: string | null;
};

type Props = {
    visit: VisitProofData;
};

export default function VisitProof({ visit }: Props) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title="Proof of Appointment" />
            <div className="min-h-screen bg-white p-6 print:p-8">
                {/* Print button - hidden when printing */}
                <div className="mb-6 flex justify-end print:hidden">
                    <Button onClick={handlePrint} className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print / Save as PDF
                    </Button>
                </div>

                <div className="mx-auto max-w-2xl border border-gray-300 p-8 print:border-gray-800">
                    <div className="mb-8 flex justify-center print:mb-6">
                        <img
                            src="/edalaw_logo.png"
                            alt="EDALaw Logo"
                            className="h-16 w-auto object-contain print:h-14"
                        />
                    </div>
                    <h1 className="mb-2 text-center text-2xl font-bold uppercase tracking-wide text-gray-900">
                        Proof of Appointment
                    </h1>
                    <p className="mb-8 text-center text-sm text-gray-600">
                        Present this document to the officer during your physical visit
                    </p>

                    <div className="space-y-4 text-gray-800">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-medium">Reference ID</span>
                            <span>#{visit.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-medium">Visitor</span>
                            <span>{visit.visitor_name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-medium">Email</span>
                            <span>{visit.visitor_email}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-medium">Inmate</span>
                            <span>{visit.inmate_name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-medium">Scheduled Date</span>
                            <span>{visit.scheduled_date}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="font-medium">Scheduled Time</span>
                            <span>{visit.scheduled_time ?? '—'}</span>
                        </div>
                        {visit.access_key && (
                            <>
                                <div className="mt-6 border-t-2 border-gray-300 pt-4">
                                    <p className="mb-2 text-sm font-medium text-gray-700">
                                        Access Key (show to officer at the facility)
                                    </p>
                                    <p className="rounded bg-gray-100 p-4 text-center font-mono text-2xl font-bold tracking-widest print:bg-gray-200">
                                        {visit.access_key}
                                    </p>
                                </div>
                                {visit.access_key_expires_at && (
                                    <p className="mt-2 text-xs text-gray-600">
                                        Valid until: {visit.access_key_expires_at}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    <p className="mt-8 text-center text-xs text-gray-500">
                        This is an official proof of your approved physical visit. Please print and bring this document
                        with you.
                    </p>

                    <div className="mt-12 grid grid-cols-2 gap-8 border-t border-gray-200 pt-8 print:mt-16">
                        <div className="flex flex-col">
                            <p className="mb-2 h-6 border-b border-gray-400" aria-hidden="true" />
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Name of Visitor
                            </p>
                            <p className="border-b border-gray-400 pb-1 text-base font-medium text-gray-900">
                                {visit.visitor_name}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <p className="mb-2 h-6 border-b border-gray-400" aria-hidden="true" />
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Warden
                            </p>
                            <p className="h-6 border-b border-gray-300" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
