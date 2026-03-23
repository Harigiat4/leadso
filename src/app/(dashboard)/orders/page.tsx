"use client";

import { useState, useEffect } from "react";
import { Download, X, FileText, Calendar, Hash, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: React.ReactNode; border: string; text: string; bg: string }> = {
    Completed: {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      border: "border-primary/25",
      text: "text-primary",
      bg: "bg-primary/5",
    },
    Pending: {
      icon: <Clock className="w-3.5 h-3.5" />,
      border: "border-yellow-400/25",
      text: "text-yellow-400",
      bg: "bg-yellow-400/5",
    },
    Failed: {
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      border: "border-red-500/25",
      text: "text-red-400",
      bg: "bg-red-500/5",
    },
  };
  const s = map[status] ?? map["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-semibold ${s.border} ${s.text} ${s.bg}`}>
      {s.icon}
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    const fetchOrders = () => {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => { if (Array.isArray(data)) setOrders(data); })
        .catch((err) => console.error("Error fetching orders:", err));
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    window.open(`/api/download/${id}`, "_blank");
  };

  return (
    <div className="p-8 md:p-12 max-w-[1400px] mx-auto w-full">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">Order History</h1>
        <p className="text-muted-foreground text-sm">View past scrapes, enriched lists, and download your CSVs.</p>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <Card className="rounded-3xl border-white/5 bg-[#111111]/80 p-16 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No orders yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Run a scrape job and your completed orders will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-6 py-2">
            {["JOB ID", "SEARCH NAME", "DATE", "LEADS", "VERIFIED", "STATUS", ""].map((h) => (
              <span key={h} className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                {h}
              </span>
            ))}
          </div>

          {/* Order Rows */}
          {orders.map((order) => (
            <Card
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="rounded-2xl border-white/5 bg-[#111111]/80 hover:border-primary/20 hover:bg-[#141414] transition-all duration-150 cursor-pointer group px-6 py-4"
            >
              <div className="grid md:grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center">
                {/* Job ID */}
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-white/20 shrink-0" />
                  <span className="font-mono text-sm text-white/50 truncate">{order.id}</span>
                </div>
                {/* Name */}
                <span className="text-sm font-semibold text-white truncate">{order.name}</span>
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Calendar className="w-3.5 h-3.5 shrink-0 text-white/20" />
                  {order.date}
                </div>
                {/* Leads */}
                <span className="text-sm font-medium text-white/80">{order.leads}</span>
                {/* Verified */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-semibold text-primary">{order.verified}</span>
                  <span className="text-xs text-muted-foreground">({order.percent})</span>
                </div>
                {/* Status */}
                <StatusBadge status={order.status} />
                {/* Actions */}
                <button
                  onClick={(e) => handleDownload(e, order.id)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                  title="Download CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Slide-out Overlay */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}
        />
      )}

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#0B0B0B] border-l border-white/5 z-50 shadow-2xl transition-transform duration-300 ease-in-out ${selectedOrder ? "translate-x-0" : "translate-x-full"}`}
      >
        {selectedOrder && (
          <div className="h-full flex flex-col">
            {/* Panel Header */}
            <div className="px-8 py-6 border-b border-white/5 flex items-start justify-between bg-[#111111]/60">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h2 className="text-xl font-bold text-white tracking-tight">{selectedOrder.name}</h2>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <p className="text-xs font-mono text-muted-foreground">{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors mt-0.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-8 flex-1 overflow-y-auto space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-5 rounded-2xl bg-[#1A1A1A] border-white/5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Total Leads</p>
                  <p className="text-3xl font-bold text-white">{selectedOrder.leads}</p>
                </Card>
                <Card className="p-5 rounded-2xl bg-[#1A1A1A] border-primary/15 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full" />
                  <p className="text-xs uppercase tracking-wider text-primary mb-2">Verified Emails</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-primary">{selectedOrder.verified}</p>
                    <p className="text-sm text-primary/60">({selectedOrder.percent})</p>
                  </div>
                </Card>
              </div>

              {/* Job Details */}
              <Card className="p-5 rounded-2xl bg-[#131313] border-white/5 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/60 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Job Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date Created</p>
                    <p className="text-sm text-white/80">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Target Persona</p>
                    <p className="text-sm text-white/80">Default Icebreaker</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Apify Configuration</p>
                    <div className="text-xs font-mono text-white/40 bg-black/40 p-3 rounded-xl border border-white/5 whitespace-pre-wrap">
{`{
  "maxItems": ${selectedOrder.leads},
  "searchUrl": "Extracted via Job Name"
}`}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Panel Footer */}
            <div className="p-6 border-t border-white/5 bg-[#111111]/80 backdrop-blur-md">
              <Button
                onClick={(e) => handleDownload(e as any, selectedOrder.id)}
                className="w-full h-12 rounded-xl text-black bg-primary hover:bg-primary/90 font-bold text-base"
              >
                <Download className="mr-2 w-5 h-5" /> Download Full CSV
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
