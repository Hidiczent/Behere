// pages/content/ContentDetail.tsx
import { Link, useParams } from "react-router-dom";
import { useContent } from "../hooks/useContent";
import type { Section } from ".././types/content";
import { resolveContentImage } from "../utils/images";

export default function ContentDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const { data, loading, error } = useContent("content.json");

  if (loading) return <div className="p-5">ກຳລັງໂຫລດຂໍ້ມູນ…</div>;
  if (error)
    return <div className="p-5 text-red-600">ບໍ່ສາມາດໂຫລດຂໍ້ມູນໄດ້</div>;

  const sec: Section | undefined = data?.sections.find((s) => s.id === id);
  if (!sec) {
    return (
      <div className="p-6">
        <p className="text-red-600">ไม่พบเนื้อหา (id: {id})</p>
        <Link to="/content" className="text-primary underline">
          ກັບຄືນ Card
        </Link>
      </div>
    );
  }

  return (
    <article className="font-laoLooped max-w-3xl mx-auto p-6 text-gray-800">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">{sec.title}</h1>
        <p className="mt-2 text-gray-600 mb-10">{sec.intro}</p>
        {sec.images && (
          <img
            src={resolveContentImage(sec.images)}
            alt={sec.id}
            className="max-w-full rounded-lg"
          />
        )}
      </header>

      <section className="space-y-4">
        {sec.items?.map((it) => (
          <div key={it.no} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold">
              {it.no}. {it.title}
            </h3>
            <p className="mt-1 text-sm text-gray-700">{it.body}</p>
          </div>
        ))}
      </section>

      {sec.summary && (
        <footer className="mt-6 p-4 bg-[#f7fafc] rounded-lg">
          <h4 className="font-semibold mb-1">ສະຫຼຸບ</h4>
          <p className="text-sm text-gray-700">{sec.summary}</p>
        </footer>
      )}

      <div className="mt-6">
        <Link to="/content" className="text-primary underline">
          ກັບຄືນ
        </Link>
      </div>
    </article>
  );
}
