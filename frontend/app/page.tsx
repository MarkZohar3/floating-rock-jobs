import { appControllerGetJobs } from "@/src/generated/client";

export default async function Home() {
  let jobs: Array<{ title: string; company: string }> = [];

  try {
    const response = await appControllerGetJobs({ cache: "no-store" });
    const payload = response.data as unknown;

    if (Array.isArray(payload)) {
      jobs = payload;
    } else if (
      payload &&
      typeof payload === "object" &&
      Array.isArray((payload as { data?: unknown }).data)
    ) {
      jobs = (payload as { data: Array<{ title: string; company: string }> }).data;
    }
  } catch {
    jobs = [];
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl bg-zinc-50 px-6 py-10 text-zinc-900">
      <h1 className="text-3xl font-semibold tracking-tight">Open Jobs</h1>
      <p className="mt-2 text-zinc-600">Fetched from backend API.</p>

      <ul className="mt-8 space-y-3">
        {jobs.length === 0 ? (
          <li className="rounded-xl border border-zinc-200 bg-white p-4 text-zinc-600 shadow-sm">
            No jobs available right now.
          </li>
        ) : (
          jobs.map((job) => (
            <li
              key={`${job.company}-${job.title}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <p className="text-lg font-medium">{job.title}</p>
              <p className="text-zinc-600">{job.company}</p>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
