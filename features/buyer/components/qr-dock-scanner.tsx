"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, ScanLine, Truck, Video } from "lucide-react";
import type { DeliveryManifest } from "@/lib/buyer/billing";
import { formatMetricTonsFromKg } from "@/lib/buyer/store";

type QrDockScannerProps = {
  manifests: DeliveryManifest[];
};

export function QrDockScanner({ manifests }: QrDockScannerProps) {
  const [trackingId, setTrackingId] = useState<string>("NIPOST-AGL-482100");
  const [validatedManifest, setValidatedManifest] = useState<DeliveryManifest | null>(null);
  const [error, setError] = useState<string>("");
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const manifestMap = useMemo(() => {
    return new Map<string, DeliveryManifest>(manifests.map((manifest) => [manifest.trackingId, manifest]));
  }, [manifests]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const manifest = manifestMap.get(trackingId.trim());

    if (!manifest) {
      setValidatedManifest(null);
      setError("No NIPOST delivery manifest matched this tracking ID.");
      return;
    }

    setValidatedManifest(manifest);
    setError("");
  }

  function simulateCameraScan() {
    setCameraActive(true);
    const firstManifest = manifests[0];
    setTrackingId(firstManifest.trackingId);
    setValidatedManifest(firstManifest);
    setError("");
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_440px]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Receiving dock scanner</h2>
            <p className="mt-1 text-sm text-slate-500">Paste manifest ID or simulate a desktop webcam QR scan.</p>
          </div>
          <ScanLine className="h-7 w-7 text-blue-700" />
        </div>

        <form className="mt-6 flex gap-3" onSubmit={handleSubmit}>
          <input
            className="h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setTrackingId(event.target.value)}
            placeholder="NIPOST-AGL-482100"
            value={trackingId}
          />
          <button className="rounded-xl bg-blue-700 px-5 text-sm font-black text-white hover:bg-blue-800" type="submit">
            Validate
          </button>
        </form>

        {error ? <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div> : null}
        {validatedManifest ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            Manifest validated. Intake batch is ready for goods-in confirmation.
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-zinc-950 p-4">
          <div className="flex aspect-video items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-slate-400">
            <div className="text-center">
              <Video className="mx-auto h-10 w-10" />
              <p className="mt-3 text-sm font-bold">{cameraActive ? "Desktop webcam stream active" : "Camera stream paused"}</p>
              <p className="mt-1 text-xs text-slate-500">QR frame simulation for receiving dock operators</p>
            </div>
          </div>
          <button className="mt-4 h-11 w-full rounded-xl bg-white text-sm font-black text-zinc-950 hover:bg-slate-100" onClick={simulateCameraScan} type="button">
            Simulate Webcam QR Scan
          </button>
        </div>
      </div>

      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">Validated intake manifest</h3>
        {validatedManifest ? (
          <div className="mt-5 space-y-4">
            <ManifestRow icon={ClipboardCheck} label="Batch reference" value={validatedManifest.batchReference} />
            <ManifestRow icon={Truck} label="Vehicle / driver" value={`${validatedManifest.vehiclePlate} · ${validatedManifest.driverName}`} />
            <ManifestRow label="Commodity" value={validatedManifest.cropSpecies} />
            <ManifestRow label="Origin hub" value={validatedManifest.originHub} />
            <ManifestRow label="Destination" value={validatedManifest.destinationWarehouse} />
            <ManifestRow
              label="Weight reconciliation"
              value={`${formatMetricTonsFromKg(validatedManifest.receivedWeightKg)} received / ${formatMetricTonsFromKg(validatedManifest.expectedWeightKg)} expected`}
            />
            <p className="break-all rounded-xl bg-slate-50 px-4 py-3 text-xs font-black text-slate-500">{validatedManifest.qrValue}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-500">Validated manifest details will appear here once a scan is confirmed.</p>
        )}
      </aside>
    </section>
  );
}

function ManifestRow({ icon: Icon, label, value }: { icon?: typeof ClipboardCheck; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
        {Icon ? <Icon className="h-4 w-4 text-blue-700" /> : null}
        {label}
      </div>
      <p className="mt-2 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}
