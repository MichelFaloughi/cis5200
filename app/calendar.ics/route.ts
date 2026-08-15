import { buildCalendarIcs } from "@/lib/ics";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildCalendarIcs(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="cis5200.ics"',
    },
  });
}
