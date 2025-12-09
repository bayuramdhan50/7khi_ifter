import AppLayout from '@/layouts/app-layout';
import { Head, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ConfirmationModal } from './_components';
import { ArrowLeft, ArrowUp, Clock, Camera, CheckCircle2, AlertCircle, XCircle, Info } from 'lucide-react';
import { approve, reject } from '@/routes/orangtua/submissions';
import { dashboard } from '@/routes/orangtua';

interface DetailItem {
  label: string;
  is_checked: boolean;
}

interface SubmissionData {
  id: number;
  time: string;
  photo: string | null;
  status: 'approved' | 'pending' | 'rejected';
  details: Record<string, DetailItem>;
  notes?: string;
}

interface ActivityItem {
  id: number;
  title: string;
  icon: string;
  color: string;
  submission: SubmissionData | null;
}

interface StudentData {
  id: number;
  name: string;
  class: string;
}

interface ActivityDetailProps {
  auth: {
    user: {
      name: string;
    };
  };
  activities: ActivityItem[];
  student: StudentData;
  date: string;
}

export default function ActivityDetail({ auth, activities, student, date }: ActivityDetailProps) {
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    submissionId: number | null;
  }>({
    isOpen: false,
    type: 'approve',
    submissionId: null,
  });

  const [rejectionReason, setRejectionReason] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApprove = (submissionId: number) => {
    setConfirmationModal({
      isOpen: true,
      type: 'approve',
      submissionId,
    });
  };

  const handleReject = (submissionId: number) => {
    setConfirmationModal({ // Reset reason when opening
      isOpen: true,
      type: 'reject',
      submissionId,
    });
    setRejectionReason('');
  };

  const confirmAction = () => {
    if (!confirmationModal.submissionId) return;

    const route = confirmationModal.type === 'approve'
      ? approve.url(confirmationModal.submissionId)
      : reject.url(confirmationModal.submissionId);

    router.post(route, {
      reason: rejectionReason
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false, submissionId: null }));
      },
    });
  };

  // Format date properly without timezone issues
  // Split the date and create a date using local timezone
  const [year, month, day] = date.split('-').map(Number);
  const localDate = new Date(year, month - 1, day); // month is 0-indexed

  const formattedDate = localDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Helper for status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Disetujui
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Ditolak
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
            <AlertCircle className="w-3.5 h-3.5" />
            Menunggu
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <Head title={`Laporan Kegiatan - ${formattedDate}`} />

      <div className="min-h-screen bg-gray-50/50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Navigation Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Link
                href={dashboard.url()}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Kembali ke Dashboard</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Laporan Harian</h1>
              <p className="text-gray-500">
                {student.name} • {formattedDate}
              </p>
            </div>

            {/* Close Button - Below Topbar */}
            <Link
              href={dashboard.url()}
              className="absolute top-20 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-400 transition-all shadow-lg hover:shadow-xl"
              title="Tutup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {/* Timeline List */}
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${!activity.submission ? 'opacity-75 grayscale-[0.5]' : ''
                  }`}
              >
                <div className="bg-slate-700 px-6 py-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <span className="text-2xl">{activity.icon || '📋'}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{activity.title}</h3>
                      <p className="text-xs opacity-90 font-medium">Kebiasaan {index + 1}</p>
                    </div>
                  </div>
                  {activity.submission ? (
                    getStatusBadge(activity.submission.status)
                  ) : (
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-lg">Belum Mengisi</span>
                  )}
                </div>

                <div className="p-6">
                  {activity.submission ? (
                    <div className="space-y-6">
                      {/* Details Grid */}
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column: Checklist & Notes */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-gray-400" />
                              Rincian
                            </h4>
                            {Object.keys(activity.submission.details).length > 0 ? (
                              <div className="space-y-2">
                                {Object.entries(activity.submission.details).map(([key, detail]) => (
                                  <div key={key} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-sm text-gray-700 font-medium">{detail.label || key}</span>
                                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${detail.is_checked ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                                      }`}>
                                      {detail.is_checked ? '✓' : '✕'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                <Info className="w-4 h-4" />
                                Tidak ada rincian khusus
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right Column: Time & Photo */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              Waktu Submit
                            </h4>
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-center">
                              <span className="text-2xl font-mono font-bold text-blue-600 tracking-tight">
                                {activity.submission.time}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Camera className="w-4 h-4 text-gray-400" />
                              Bukti Foto
                            </h4>
                            {activity.submission.photo ? (
                              <div
                                className="relative group cursor-pointer overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                onClick={() => setSelectedPhoto(activity.submission!.photo!)}
                              >
                                <img
                                  src={activity.submission.photo}
                                  alt="Bukti"
                                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-medium transition-opacity">
                                    Lihat Fullscreen
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2">
                                <Camera className="w-8 h-8 opacity-50" />
                                <span className="text-xs">Tidak ada foto</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Footer */}
                      {activity.submission.status === 'pending' && (
                        <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3 justify-end">
                          <button
                            onClick={() => handleReject(activity.submission!.id)}
                            className="px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Tolak
                          </button>
                          <button
                            onClick={() => handleApprove(activity.submission!.id)}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 hover:shadow-md hover:shadow-green-200 transition-all flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Setujui
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                        <Clock className="w-6 h-6" />
                      </div>
                      <p className="text-gray-500 font-medium">Siswa belum mengisi kegiatan ini.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false, submissionId: null }))}
        onConfirm={confirmAction}
        title={confirmationModal.type === 'approve' ? 'Setujui Kegiatan' : 'Tolak Kegiatan'}
        message={confirmationModal.type === 'approve'
          ? 'Apakah Anda yakin ingin menyetujui kegiatan ini?'
          : 'Apakah Anda yakin ingin menolak kegiatan ini?'}
        type={confirmationModal.type}
      />

      {/* Scroll to Top Button - Mobile Only */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="md:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          title="Kembali ke Atas"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Tutup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {/* Photo */}
            <img
              src={selectedPhoto}
              alt="Bukti Foto"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
