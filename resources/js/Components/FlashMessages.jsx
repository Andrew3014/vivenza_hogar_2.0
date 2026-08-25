import { usePage } from '@inertiajs/react';

export default function FlashMessages() {
    const { flash } = usePage().props;

    if (!flash?.success && !flash?.error) {
        return null;
    }

    return (
        <div className="space-y-3 mb-6">
            {flash.success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <p className="text-green-800 font-medium">{flash.success}</p>
                </div>
            )}
            {flash.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <p className="text-red-800 font-medium">{flash.error}</p>
                </div>
            )}
        </div>
    );
}
