import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const name = String(body?.name ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const email = String(body?.email ?? "").trim() || null;
    const company = String(body?.company ?? "").trim() || null;
    const topic = String(body?.topic ?? "").trim();
    const message = String(body?.message ?? "").trim() || null;

    if (name.length < 2) return Response.json({ error: "نام را کامل وارد کنید" }, { status: 400 });
    if (!/^[\d+\s\-()۰-۹٠-٩]{8,20}$/.test(phone))
      return Response.json({ error: "شماره تماس معتبر وارد کنید" }, { status: 400 });
    if (!topic) return Response.json({ error: "موضوع مشاوره را انتخاب کنید" }, { status: 400 });

    const saved = await db.consultation.create({
      data: { name, phone, email, company, topic, message },
    });

    return Response.json({ ok: true, id: saved.id });
  } catch (e) {
    console.error("POST /api/consultation", e);
    return Response.json({ error: "خطا در ثبت درخواست" }, { status: 500 });
  }
}
