import { NextRequest, NextResponse } from "next/server";

const WMS_SOURCES: Record<string, string> = {
    // Correct GloFAS OWS endpoint
    floodHazard: "https://ows.globalfloods.eu/glofas-ows/ows.py",
    lecz: "https://sedac.ciesin.columbia.edu/geoserver/wms",
};

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const source = searchParams.get("source");

    if (!source || !WMS_SOURCES[source]) {
        return NextResponse.json({ error: "Unknown source" }, { status: 400 });
    }

    const forward = new URLSearchParams();
    searchParams.forEach((value, key) => {
        if (key !== "source") forward.set(key, value);
    });

    const url = `${WMS_SOURCES[source]}?${forward.toString()}`;
    console.log("[wms-proxy] →", url);

    try {
        const upstream = await fetch(url, {
            headers: {
                "User-Agent": "ABOW-Atlas/1.0",
                Accept: "image/png,image/*",
            },
            signal: AbortSignal.timeout(10000),
        });

        if (!upstream.ok) {
            const text = await upstream.text();
            console.error("[wms-proxy] upstream error:", upstream.status, text.slice(0, 200));
            return NextResponse.json(
                { error: `Upstream ${upstream.status}`, detail: text.slice(0, 200) },
                { status: 502 }
            );
        }

        const buffer = await upstream.arrayBuffer();
        const contentType = upstream.headers.get("content-type") ?? "image/png";

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (err) {
        console.error("[wms-proxy] fetch failed:", err);
        return NextResponse.json({ error: "Proxy fetch failed" }, { status: 502 });
    }
}