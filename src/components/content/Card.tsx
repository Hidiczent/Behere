import { Link } from "react-router-dom";
import { useContent } from "../../hooks/useContent";
import type { Section } from "../../types/content";
import { resolveContentImage } from "../../utils/images";

export const Card: React.FC = () => {
  const { data, loading, error } = useContent("content.json");

  if (loading) return <div className="p-5">ກຳລັງໂຫລດຂໍ້ມູນ</div>;
  if (error)
    return <div className="p-5 text-red-600">ບໍ່ສາມາດໂຫລດຂໍ້ມູນໄດ້</div>;

  const sections: Section[] = data?.sections ?? [];

  return (
    <div className="font-laoLooped text-gray-800">
      <header className="p-5 text-primary text-center">
        <h1 className="m-0 text-2xl font-bold">
          ບົດຄວາມທີ່ໃຫ້ກຳລັງໃຈ ປະຈຳອາທິດ
        </h1>
        <p className="mt-1 text-[#00334d]">
          ລວມເລື່ອງລາວ ແລະ ຄຳເວົ້າທີ່ຈະຊ່ວຍເຕີມພະລັງໃຈໃຫ້ເຈົ້າ
        </p>
      </header>

      <main>
        <section className="flex justify-center gap-5 flex-wrap p-5">
          {sections.map((sec) => (
            <article
              key={sec.id}
              className="bg-white rounded-lg shadow-md w-[300px] text-center p-4 transition-transform duration-200 hover:-translate-y-1"
            >
              <Link to={`/content/${sec.id}`}>
                {sec.images && (
                  <img
                    src={resolveContentImage(sec.images)}
                    alt={sec.id}
                    className="w-78 h-48 object-cover rounded-lg" // กำหนดขนาดคงที่
                  />
                )}
              </Link>
              <h3 className="mt-3 font-semibold">{sec.title}</h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                {sec.intro}
              </p>
              <div className="mt-3">
                <Link
                  to={`/content/${sec.id}`}
                  className="text-primary underline"
                >
                  ອ່ານເພິ່ມ
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};
