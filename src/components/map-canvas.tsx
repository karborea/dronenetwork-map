"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";

import type { Locale } from "@/lib/i18n";
import type { PilotProfile } from "@/types/pilot";

interface MapCanvasProps {
  pilots: PilotProfile[];
  activeId: number | null;
  onSelect: (pilot: PilotProfile) => void;
  locale: Locale;
}

function buildPinHTML(pilot: PilotProfile, active: boolean): string {
  const color =
    pilot.kind === "school" ? "var(--color-lime)" : "var(--color-iris)";
  const symbol =
    pilot.kind === "school"
      ? "/assets/symbol-onyx.svg"
      : "/assets/symbol-paper.svg";
  const ribbon = pilot.pro ? `<div class="dn-pin-ribbon">PRO</div>` : "";
  const proBorder = pilot.pro ? "2px solid var(--color-lime)" : "none";
  return `
    <div class="dn-pin-wrap${active ? " is-active" : ""}">
      ${ribbon}
      <div class="dn-pin-body" style="background:${color};border:${proBorder};">
        <img src="${symbol}" width="20" height="20" alt="" />
      </div>
    </div>
  `;
}

function buildClusterHTML(count: number, locale: Locale): string {
  const label = locale === "fr" ? "membres" : "members";
  return `
    <div class="dn-cluster-pill">
      <span class="dn-cluster-count">${count}</span>
      <span class="dn-cluster-label">${label}</span>
    </div>
  `;
}

/**
 * Brand-styled Leaflet map. CARTO Dark Matter tiles, custom teardrop pins
 * with the propeller symbol, Pro ribbon for advanced-license pilots, and
 * marker clustering. Recalculates size on resize and re-fits bounds when
 * the filtered pilot list changes.
 */
export function MapCanvas({
  pilots,
  activeId,
  onSelect,
  locale,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);

  // Keep latest onSelect without re-binding marker click listeners
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Init the map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [56, -95],
      zoom: 3.4,
      zoomControl: false,
      attributionControl: true,
      worldCopyJump: false,
      minZoom: 2,
    });
    mapRef.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      },
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 50,
      iconCreateFunction: (c) =>
        L.divIcon({
          html: buildClusterHTML(c.getChildCount(), locale),
          className: "dn-cluster-icon",
          iconSize: [80, 44],
          iconAnchor: [40, 22],
        }),
    });
    clusterRef.current = cluster;
    map.addLayer(cluster);

    // Recompute size — flex layouts settle after first paint
    const fixSize = () => map.invalidateSize();
    const t1 = setTimeout(fixSize, 60);
    const t2 = setTimeout(fixSize, 250);
    const t3 = setTimeout(fixSize, 600);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(fixSize);
      ro.observe(containerRef.current);
    }

    const tReady = setTimeout(() => setReady(true), 80);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tReady);
      if (ro) ro.disconnect();
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync markers whenever the filtered list or active selection changes
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    cluster.clearLayers();

    pilots.forEach((p) => {
      const isPro = !!p.pro;
      const icon = L.divIcon({
        html: buildPinHTML(p, activeId === p.id),
        className: "dn-pin-icon",
        iconSize: [60, isPro ? 80 : 56],
        iconAnchor: [30, isPro ? 72 : 50],
      });
      const marker = L.marker([p.lat, p.lng], { icon, riseOnHover: true });
      marker.on("click", () => onSelectRef.current(p));
      cluster.addLayer(marker);
    });
  }, [pilots, activeId]);

  // Re-fit bounds when the filtered list changes (waits for layout to settle)
  const pilotsKey = pilots.map((p) => p.id).join(",");
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map || pilots.length === 0) return;

    const tid = setTimeout(() => {
      if (!mapRef.current) return;
      mapRef.current.invalidateSize();
      const size = mapRef.current.getSize();
      if (size.x < 100 || size.y < 100) return;

      if (pilots.length === 1) {
        mapRef.current.flyTo([pilots[0].lat, pilots[0].lng], 9, {
          duration: 0.9,
        });
        return;
      }

      const bounds = L.latLngBounds(
        pilots.map((p) => [p.lat, p.lng] as [number, number]),
      );
      mapRef.current.flyToBounds(bounds, {
        padding: [50, 50],
        maxZoom: 7,
        duration: 0.9,
      });
    }, 220);

    return () => clearTimeout(tid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, pilotsKey]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
