'use client';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import { Card } from '@/components/UI';
import { demoProjects } from '@/lib/demoData';
export default function ProjectsPage(){
  return (
    <AuthGuard>
      <Card className="p-4">
        <div className="text-lg font-semibold mb-3">All Projects</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {demoProjects.map(p=>(
            <Link key={p.id} href={`/projects/${p.id}`} className="border rounded-2xl p-3 bg-white hover:bg-black/5">
              <div className="font-medium text-brand-primary">
  {p.name ?? (p as any).title ?? p.id}
</div>

              <div className="text-sm text-black/60">{p.scope} · {p.status}</div>
              <div className="text-xs text-black/50 mt-1">{p.address}</div>
            </Link>
          ))}
        </div>
      </Card>
    </AuthGuard>
  );
}
