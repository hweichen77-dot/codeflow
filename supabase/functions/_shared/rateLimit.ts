let kvPromise: Promise<Deno.Kv | null> | null = null;
function getKv(): Promise<Deno.Kv | null> {
  if (kvPromise === null) {
    kvPromise = (async () => {
      try {
        return await Deno.openKv();
      } catch {
        return null;
      }
    })();
  }
  return kvPromise;
}

const mem = new Map<string, { c: number; r: number }>();
function memConsume(bucket: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const e = mem.get(bucket);
  if (!e || now >= e.r) {
    mem.set(bucket, { c: 1, r: now + windowMs });
    if (mem.size > 5000) {
      for (const [k, v] of mem) if (now >= v.r) mem.delete(k);
    }
    return true;
  }
  if (e.c >= max) return false;
  e.c += 1;
  return true;
}

async function consume(bucket: string, max: number, windowMs: number): Promise<boolean> {
  const kv = await getKv();
  if (!kv) return memConsume(bucket, max, windowMs);
  const key = ["rl", bucket];
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await kv.get<{ c: number; r: number }>(key);
    const now = Date.now();
    const v = res.value;
    if (!v || now >= v.r) {
      const ok = await kv.atomic().check(res).set(key, { c: 1, r: now + windowMs }, { expireIn: windowMs }).commit();
      if (ok.ok) return true;
      continue;
    }
    if (v.c >= max) return false;
    const ok = await kv.atomic().check(res).set(key, { c: v.c + 1, r: v.r }, { expireIn: Math.max(1000, v.r - now) }).commit();
    if (ok.ok) return true;
  }
  return true;
}

export interface RateOpts {
  caller: string;
  fn: string;
  perMin: number;
  perDay?: number;
  globalPerMin: number;
  globalPerDay: number;
}

export async function checkLimits(o: RateOpts): Promise<string | null> {
  if (!(await consume(`u:${o.fn}:${o.caller}`, o.perMin, 60_000))) {
    return "rate limit exceeded — slow down and try again in a minute";
  }
  if (o.perDay && !(await consume(`ud:${o.fn}:${o.caller}`, o.perDay, 86_400_000))) {
    return "daily limit reached for this device — sign in to keep going";
  }
  if (!(await consume(`g:${o.fn}`, o.globalPerMin, 60_000))) {
    return "service is busy right now — try again shortly";
  }
  if (!(await consume(`d:${o.fn}`, o.globalPerDay, 86_400_000))) {
    return "daily capacity reached — please try again tomorrow";
  }
  return null;
}
