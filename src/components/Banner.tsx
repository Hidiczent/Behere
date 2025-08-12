import heroJpg from "@/assets/img/banner7.jpg"; // ← เปลี่ยนชื่อไฟล์ตามจริง
import { NavLink } from "react-router-dom";

const Baner = () => {
  return (
    <section className="relative isolate lg:grid lg:min-h-[80vh] lg:place-content-center">
      {/* BG image (WebP + JPG fallback) */}
      <picture>
        <source srcSet={heroJpg} type="image/webp" />
        <img
          src={heroJpg}
          className="
            absolute inset-0 h-full w-full object-cover
            object-[60%_50%] sm:object-[58%_50%] lg:object-[65%_50%]
          "
          aria-hidden="true"
        />
      </picture>

      {/* Overlay ให้อ่านตัวอักษรง่ายขึ้น */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* hairline แต่งหัว section เบา ๆ */}
        <div className="mx-auto h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

        <div className="mx-auto max-w-3xl py-16 sm:py-24 lg:py-32 text-center text-white">
          <h1
            className="font-laoLooped text-3xl sm:text-4xl lg:text-5xl font-bold
               leading-[1.25] sm:leading-[1.25] tracking-[0.015em] sm:tracking-[0.02em] text-[#F8F1E6]"
          >
            <span className="block ">ເພາະຄວາມຮູ້ສຶກຂອງເຈົ້າມີຄຸນຄ່າ</span>
            <span className="mt-10 inline-block rounded-xl text-secondary">
              ແລະ " ເຈົ້າບໍ່ໄດ້ຢູ່ຄົນດຽວ "
            </span>
          </h1>
          <p className="font-laoLooped mx-auto mt-6 max-w-prose text-pretty text-base sm:text-lg leading-[1.85] ext-secondary">
            ບາງຄັ້ງການທີ່ໄດ້ເວົ້າອອກມາກໍພຽງພໍ ແລະ ບາງຄັ້ງການທີ່ມີຄົນຮັບຟັງ
            ໂດຍທີ່ບໍ່ມີການຕັດສິນກໍເປັນສິ່ງທີ່ເຮົາຕ້ອງການ
            ທ່ານມີສິດທີ່ຈະໄດ້ຮັບການຮັບຟັງຢ່າງເຂົ້າໃຈ
            ເຮົາຢູ່ທີ່ນີ້ເພື່ອຮັບຟັງທ່ານດ້ວຍໃຈທີ່ເປິດກວ້າງ
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
            <NavLink
              to="/"
              className="font-laoLooped inline-flex items-center rounded-xl bg-primary px-5 py-3 text-white font-semibold shadow-sm
                 transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              ເລີ່ມຕົ້ນໃຊ້ງານ
            </NavLink>
            <NavLink
              to="#"
              className="font-laoLooped inline-flex items-center rounded-xl border border-primary px-5 py-3 text-secondary font-semibold
                 transition hover:bg-primary hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              ຮຽນຮູ້ເພິ່ມເຕິມ
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Baner;
