"use client";

import { useEffect, useRef, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SessionRoom({ params }) {
  const resolvedParams = use(params);
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;

    script.onload = () => {
      const api = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName: `FPI-ELearning-${resolvedParams.roomId}`,
        parentNode: jitsiContainerRef.current,
        width: "100%",
        height: "100%",
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [resolvedParams.roomId]);

  return (
    <div className="p-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-green-800 mb-4 hover:underline"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>
      <div
        ref={jitsiContainerRef}
        style={{ height: "80vh", width: "100%" }}
        className="rounded-lg overflow-hidden bg-black"
      ></div>
    </div>
  );
}